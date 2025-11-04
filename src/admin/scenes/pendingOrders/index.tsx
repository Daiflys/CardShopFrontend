import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  getPendingPurchases,
  confirmPurchase,
  cancelPurchase
} from "../../../api/purchases";
import type { PurchaseResponse } from "../../../api/types";

const PendingOrders: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State
  const [orders, setOrders] = useState<PurchaseResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Pagination
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalOrders, setTotalOrders] = useState<number>(0);

  // Confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseResponse | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Load pending orders
  const loadOrders = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPendingPurchases(page, pageSize);

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
      console.error("Error loading pending orders:", err);
      setError((err as Error).message || "Failed to load pending orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when page changes
  useEffect(() => {
    loadOrders();
  }, [page, pageSize]);

  // Handle confirm order
  const handleConfirmOrder = async (): Promise<void> => {
    if (!selectedOrder) return;

    setActionLoading(true);
    try {
      await confirmPurchase(selectedOrder.id);
      setSuccessMessage(`Order #${selectedOrder.id} confirmed successfully`);
      setConfirmDialogOpen(false);
      setSelectedOrder(null);

      // Reload orders
      await loadOrders();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error confirming order:", err);
      setError((err as Error).message || "Failed to confirm order");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle cancel order
  const handleCancelOrder = async (): Promise<void> => {
    if (!selectedOrder) return;

    setActionLoading(true);
    try {
      await cancelPurchase(selectedOrder.id);
      setSuccessMessage(`Order #${selectedOrder.id} cancelled. Stock has been restored.`);
      setCancelDialogOpen(false);
      setSelectedOrder(null);

      // Reload orders
      await loadOrders();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError((err as Error).message || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  // Open confirmation dialogs
  const openConfirmDialog = (order: PurchaseResponse): void => {
    setSelectedOrder(order);
    setConfirmDialogOpen(true);
  };

  const openCancelDialog = (order: PurchaseResponse): void => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

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
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            size="small"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={() => openConfirmDialog(params.row as PurchaseResponse)}
            sx={{
              backgroundColor: colors.greenAccent[600],
              "&:hover": {
                backgroundColor: colors.greenAccent[700]
              }
            }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<CancelOutlinedIcon />}
            onClick={() => openCancelDialog(params.row as PurchaseResponse)}
            sx={{
              borderColor: colors.redAccent[400],
              color: colors.redAccent[400],
              "&:hover": {
                borderColor: colors.redAccent[500],
                backgroundColor: colors.redAccent[900]
              }
            }}
          >
            Cancel
          </Button>
        </Box>
      )
    }
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="PENDING ORDERS"
          subtitle="Review and manage pending customer orders"
        />
        <Box>
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
                Pending Orders
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

      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage("")} sx={{ mb: 2 }}>
          {successMessage}
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

      {/* Confirm Order Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => !actionLoading && setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to confirm order <strong>#{selectedOrder?.id}</strong>?
          </Typography>
          {selectedOrder && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Card: {selectedOrder.cardName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quantity: {selectedOrder.quantity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: €{(selectedOrder.price * selectedOrder.quantity).toFixed(2)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmOrder}
            variant="contained"
            color="success"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : <CheckCircleOutlineIcon />}
          >
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => !actionLoading && setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel order <strong>#{selectedOrder?.id}</strong>?
          </Typography>
          <Typography variant="body2" color="warning.main" mt={1}>
            Stock will be restored automatically.
          </Typography>
          {selectedOrder && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Card: {selectedOrder.cardName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quantity: {selectedOrder.quantity}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} disabled={actionLoading}>
            Keep Order
          </Button>
          <Button
            onClick={handleCancelOrder}
            variant="contained"
            color="error"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : <CancelOutlinedIcon />}
          >
            Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingOrders;
