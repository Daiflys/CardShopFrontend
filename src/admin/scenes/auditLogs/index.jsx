import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Paper
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import {
  getRecentAuditLogs,
  getAuditLogsByUser,
  getAuditLogsByAction,
  getAuditLogsByRange,
  getAuditLogsByUserAndRange
} from "../../api/auditLogs";
import {
  getAllAuditActions,
  getAuditActionLabel,
  getAuditActionColor,
  getResultColor,
  RESULT_TYPES
} from "../../../utils/auditActions";

const AuditLogs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [totalRows, setTotalRows] = useState(0);

  // Filters
  const [filterUsername, setFilterUsername] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Details Modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const auditActions = getAllAuditActions();

  // Load audit logs
  const loadAuditLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      let data;

      // Determine which API to call based on filters
      if (filterUsername && (filterStartDate || filterEndDate)) {
        // User + date range
        const start = filterStartDate || new Date(0).toISOString();
        const end = filterEndDate || new Date().toISOString();
        data = await getAuditLogsByUserAndRange(filterUsername, start, end);
      } else if (filterStartDate || filterEndDate) {
        // Date range only
        const start = filterStartDate || new Date(0).toISOString();
        const end = filterEndDate || new Date().toISOString();
        data = await getAuditLogsByRange(start, end);
      } else if (filterUsername) {
        // User only
        data = await getAuditLogsByUser(filterUsername, page, pageSize);
      } else if (filterAction) {
        // Action only
        data = await getAuditLogsByAction(filterAction, page, pageSize);
      } else {
        // Recent logs (default)
        data = await getRecentAuditLogs(page, pageSize);
      }

      // Handle both array and paginated response
      if (Array.isArray(data)) {
        setLogs(data);
        setTotalRows(data.length);
      } else if (data.content) {
        setLogs(data.content);
        setTotalRows(data.totalElements || data.content.length);
      } else {
        setLogs([]);
        setTotalRows(0);
      }
    } catch (err) {
      console.error("Error loading audit logs:", err);
      setError(err.message || "Failed to load audit logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Load logs on mount and when filters/pagination change
  useEffect(() => {
    loadAuditLogs();
  }, [page, pageSize]);

  // Handle filter application
  const handleApplyFilters = () => {
    setPage(0); // Reset to first page
    loadAuditLogs();
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setFilterUsername("");
    setFilterAction("");
    setFilterStartDate("");
    setFilterEndDate("");
    setPage(0);
    // Trigger reload after state updates
    setTimeout(() => loadAuditLogs(), 100);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (err) {
      return timestamp;
    }
  };

  // Parse details JSON
  const parseDetails = (details) => {
    if (!details) return "N/A";
    try {
      const parsed = JSON.parse(details);
      return JSON.stringify(parsed, null, 2);
    } catch (err) {
      return details;
    }
  };

  // Handle opening details modal
  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setDetailsModalOpen(true);
  };

  // Handle closing details modal
  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
    setSelectedLog(null);
  };

  // DataGrid columns
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      flex: 1,
      minWidth: 180,
      align: "left",
      headerAlign: "left",
      renderCell: ({ row }) => formatTimestamp(row.timestamp),
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      minWidth: 120,
      align: "left",
      headerAlign: "left",
      cellClassName: "name-column--cell",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      minWidth: 150,
      align: "left",
      headerAlign: "left",
      renderCell: ({ row }) => {
        const actionColor = getAuditActionColor(row.action);
        return (
          <Chip
            label={getAuditActionLabel(row.action)}
            sx={{
              backgroundColor: actionColor,
              color: "#fff",
              fontWeight: "bold",
            }}
            size="small"
          />
        );
      },
    },
    {
      field: "result",
      headerName: "Result",
      width: 140,
      align: "left",
      headerAlign: "left",
      renderCell: ({ row }) => {
        const resultColor = getResultColor(row.result);
        const isSuccess = row.result === RESULT_TYPES.SUCCESS;
        return (
          <Box display="flex" alignItems="center">
            {isSuccess ? (
              <CheckCircleOutlineIcon sx={{ color: resultColor, mr: 0.5, fontSize: "1.2rem" }} />
            ) : (
              <ErrorOutlineIcon sx={{ color: resultColor, mr: 0.5, fontSize: "1.2rem" }} />
            )}
            <Typography sx={{ color: resultColor, fontSize: "0.875rem" }}>
              {row.result}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "entityType",
      headerName: "Entity Type",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => row.entityType || "N/A",
    },
    {
      field: "entityId",
      headerName: "Entity ID",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => row.entityId || "N/A",
    },
    {
      field: "ipAddress",
      headerName: "IP Address",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => row.ipAddress || "N/A",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <IconButton
          onClick={() => handleViewDetails(row)}
          sx={{
            color: colors.blueAccent[500],
            "&:hover": {
              color: colors.blueAccent[300],
            },
          }}
          size="small"
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="AUDIT LOGS" subtitle="System Activity and Security Audit Trail" />

      {/* Filters */}
      <Box
        mb="20px"
        p="20px"
        backgroundColor={colors.primary[400]}
        borderRadius="8px"
      >
        <Box display="flex" alignItems="center" mb="15px">
          <FilterListIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
          <Typography variant="h5" color={colors.grey[100]}>
            Filters
          </Typography>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gap="15px"
        >
          <TextField
            label="Username"
            variant="outlined"
            value={filterUsername}
            onChange={(e) => setFilterUsername(e.target.value)}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: colors.grey[100],
              },
              "& .MuiInputLabel-root": {
                color: colors.grey[300],
              },
            }}
          />

          <FormControl size="small" variant="outlined">
            <InputLabel sx={{ color: colors.grey[300] }}>Action Type</InputLabel>
            <Select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              label="Action Type"
              sx={{
                color: colors.grey[100],
              }}
            >
              <MenuItem value="">
                <em>All Actions</em>
              </MenuItem>
              {auditActions.map((action) => (
                <MenuItem key={action.value} value={action.value}>
                  {action.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Start Date"
            type="datetime-local"
            variant="outlined"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: colors.grey[100],
              },
              "& .MuiInputLabel-root": {
                color: colors.grey[300],
              },
            }}
          />

          <TextField
            label="End Date"
            type="datetime-local"
            variant="outlined"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: colors.grey[100],
              },
              "& .MuiInputLabel-root": {
                color: colors.grey[300],
              },
            }}
          />
        </Box>

        <Box display="flex" gap="10px" mt="15px">
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={handleApplyFilters}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              "&:hover": {
                backgroundColor: colors.blueAccent[800],
              },
            }}
          >
            Apply Filters
          </Button>
          <Button
            variant="outlined"
            onClick={handleResetFilters}
            sx={{
              borderColor: colors.grey[500],
              color: colors.grey[100],
              "&:hover": {
                borderColor: colors.grey[300],
              },
            }}
          >
            Reset
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadAuditLogs}
            sx={{
              borderColor: colors.grey[500],
              color: colors.grey[100],
              "&:hover": {
                borderColor: colors.grey[300],
              },
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: "20px" }}>
          {error}
        </Alert>
      )}

      {/* DataGrid */}
      <Box
        height="65vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={logs}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          paginationMode="client"
          loading={loading}
          components={{
            LoadingOverlay: () => (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <CircularProgress />
              </Box>
            ),
          }}
          sx={{
            "& .MuiDataGrid-row:hover": {
              backgroundColor: colors.primary[300],
            },
          }}
        />
      </Box>

      {/* Details Modal */}
      <Dialog
        open={detailsModalOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: colors.primary[500],
            color: colors.grey[100],
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Audit Log Details
          </Typography>
          <IconButton onClick={handleCloseDetails} sx={{ color: colors.grey[100] }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {selectedLog && (
            <Box>
              {/* Basic Information */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: colors.primary[500],
                  borderRadius: "8px",
                }}
              >
                <Typography variant="h6" color={colors.greenAccent[500]} mb={1}>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2, borderColor: colors.grey[700] }} />

                <Box display="grid" gridTemplateColumns="150px 1fr" gap={1.5}>
                  <Typography fontWeight="bold" color={colors.grey[300]}>
                    ID:
                  </Typography>
                  <Typography>{selectedLog.id}</Typography>

                  <Typography fontWeight="bold" color={colors.grey[300]}>
                    Timestamp:
                  </Typography>
                  <Typography>{formatTimestamp(selectedLog.timestamp)}</Typography>

                  <Typography fontWeight="bold" color={colors.grey[300]}>
                    Username:
                  </Typography>
                  <Typography color={colors.greenAccent[300]}>
                    {selectedLog.username}
                  </Typography>

                  <Typography fontWeight="bold" color={colors.grey[300]}>
                    Action:
                  </Typography>
                  <Box>
                    <Chip
                      label={getAuditActionLabel(selectedLog.action)}
                      sx={{
                        backgroundColor: getAuditActionColor(selectedLog.action),
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                      size="small"
                    />
                  </Box>

                  <Typography fontWeight="bold" color={colors.grey[300]}>
                    Result:
                  </Typography>
                  <Box display="flex" alignItems="center">
                    {selectedLog.result === RESULT_TYPES.SUCCESS ? (
                      <CheckCircleOutlineIcon
                        sx={{
                          color: getResultColor(selectedLog.result),
                          mr: 1,
                        }}
                      />
                    ) : (
                      <ErrorOutlineIcon
                        sx={{
                          color: getResultColor(selectedLog.result),
                          mr: 1,
                        }}
                      />
                    )}
                    <Typography
                      sx={{
                        color: getResultColor(selectedLog.result),
                        fontWeight: "bold",
                      }}
                    >
                      {selectedLog.result}
                    </Typography>
                  </Box>

                  <Typography fontWeight="bold" color={colors.grey[300]}>
                    IP Address:
                  </Typography>
                  <Typography>{selectedLog.ipAddress || "N/A"}</Typography>
                </Box>
              </Paper>

              {/* Entity Information */}
              {(selectedLog.entityType || selectedLog.entityId) && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: colors.primary[500],
                    borderRadius: "8px",
                  }}
                >
                  <Typography variant="h6" color={colors.greenAccent[500]} mb={1}>
                    Entity Information
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: colors.grey[700] }} />

                  <Box display="grid" gridTemplateColumns="150px 1fr" gap={1.5}>
                    <Typography fontWeight="bold" color={colors.grey[300]}>
                      Entity Type:
                    </Typography>
                    <Typography>{selectedLog.entityType || "N/A"}</Typography>

                    <Typography fontWeight="bold" color={colors.grey[300]}>
                      Entity ID:
                    </Typography>
                    <Typography>{selectedLog.entityId || "N/A"}</Typography>
                  </Box>
                </Paper>
              )}

              {/* Additional Details */}
              {selectedLog.details && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: colors.primary[500],
                    borderRadius: "8px",
                  }}
                >
                  <Typography variant="h6" color={colors.greenAccent[500]} mb={1}>
                    Additional Details
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: colors.grey[700] }} />

                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: colors.primary[600],
                      p: 2,
                      borderRadius: "4px",
                      overflow: "auto",
                      maxHeight: "300px",
                      fontSize: "0.875rem",
                      fontFamily: "monospace",
                      color: colors.grey[100],
                    }}
                  >
                    {parseDetails(selectedLog.details)}
                  </Box>
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, backgroundColor: colors.primary[500] }}>
          <Button
            onClick={handleCloseDetails}
            variant="contained"
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              "&:hover": {
                backgroundColor: colors.blueAccent[800],
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuditLogs;
