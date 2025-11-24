import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Chip,
  Alert,
  IconButton,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  getPurchasesByStatus
} from "../../../api/purchases";
import type { PurchaseResponse, PurchaseStatus } from "../../../api/types";

const OrderManagement: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State
  const [orders, setOrders] = useState<PurchaseResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<PurchaseStatus>("AWAITING_VENDOR_CONFIRMATION");

  // Pagination
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalOrders, setTotalOrders] = useState<number>(0);

  // Load orders by status
  const loadOrders = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPurchasesByStatus(selectedStatus, page, pageSize);

      // Handle PageResponse structure
      if (response.content) {
        setOrders(response.content);
        setTotalOrders(response.totalElements || 0);
      } else {
        // Fallback if backend returns array directly
        setOrders(Array.isArray(response) ? response : []);
        setTotalOrders(Array.isArray(response) ? response.length : 0);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
      setError((err as Error).message || `Failed to load ${selectedStatus.toLowerCase()} orders`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when page, pageSize, or selectedStatus changes
  useEffect(() => {
    loadOrders();
  }, [page, pageSize, selectedStatus]);

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Order ID",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight="bold">
          #{params.value}
        </Typography>
      )
    },
    {
      field: "cardName",
      headerName: "Card Name",
      flex: 1,
      minWidth: 200
    },
    {
      field: "setName",
      headerName: "Set",
      flex: 0.8,
      minWidth: 150
    },
    {
      field: "condition",
      headerName: "Condition",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: colors.grey[100]
          }}
        />
      )
    },
    {
      field: "quantity",
      headerName: "Qty",
      width: 80,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight="bold" color={colors.greenAccent[500]}>
          €{Number(params.value).toFixed(2)}
        </Typography>
      )
    },
    {
      field: "totalPrice",
      headerName: "Total",
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        const total = params.row.price * params.row.quantity;
        return (
          <Typography variant="body2" fontWeight="bold" color={colors.greenAccent[400]}>
            €{total.toFixed(2)}
          </Typography>
        );
      }
    },
    {
      field: "buyerId",
      headerName: "Buyer ID",
      width: 100
    },
    {
      field: "purchaseDate",
      headerName: "Date",
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const date = new Date(params.value);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
      }
    },
    {
      field: "paymentProvider",
      headerName: "Payment",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value || "N/A"}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.value as PurchaseStatus;
        // Color mapping for different statuses
        const statusColors: Record<PurchaseStatus, string> = {
          AWAITING_VENDOR_CONFIRMATION: colors.blueAccent[500],
          AUTHORIZED: colors.blueAccent[300],
          CONFIRMED: colors.greenAccent[500],
          CREATED: colors.grey[500],
          CANCELLED: colors.redAccent[500],
          FAILED: colors.redAccent[700],
          REFUNDED: colors.redAccent[300],
          EXPIRED: colors.grey[700]
        };

        return (
          <Chip
            label={status}
            size="small"
            sx={{
              backgroundColor: statusColors[status] || colors.grey[500],
              color: colors.grey[100],
              fontWeight: "bold"
            }}
          />
        );
      }
    }
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="ORDER MANAGEMENT"
          subtitle="Review and manage customer orders by status"
        />
        <Box display="flex" gap={2} alignItems="center">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="status-select-label">Order Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={selectedStatus}
              label="Order Status"
              onChange={(e) => {
                setSelectedStatus(e.target.value as PurchaseStatus);
                setPage(0); // Reset to first page when status changes
              }}
              sx={{
                backgroundColor: colors.primary[400],
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.grey[700]
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.blueAccent[500]
                }
              }}
            >
              <MenuItem value="AWAITING_VENDOR_CONFIRMATION">Awaiting Vendor Confirmation</MenuItem>
              <MenuItem value="AUTHORIZED">Authorized</MenuItem>
              <MenuItem value="CONFIRMED">Confirmed</MenuItem>
              <MenuItem value="CREATED">Created</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
              <MenuItem value="REFUNDED">Refunded</MenuItem>
              <MenuItem value="EXPIRED">Expired</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={loadOrders} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Stats Card */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              backgroundColor: colors.primary[400],
              display: "flex",
              alignItems: "center",
              gap: 2
            }}
          >
            <ShoppingCartOutlinedIcon sx={{ fontSize: 40, color: colors.greenAccent[500] }} />
            <Box>
              <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                {totalOrders}
              </Typography>
              <Typography variant="body2" color={colors.grey[100]}>
                {selectedStatus.charAt(0) + selectedStatus.slice(1).toLowerCase()} Orders
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Messages */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Data Grid */}
      <Box
        height="65vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none"
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none"
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none"
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400]
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700]
          }
        }}
      >
        <DataGrid
          rows={orders}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={totalOrders}
          page={page}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 50]}
          loading={loading}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default OrderManagement;
