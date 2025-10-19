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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Grid,
  Paper,
  SelectChangeEvent
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import {
  getAllUsers,
  updateUserRole,
  getAdminStats
} from "../../api/adminUsers";
import {
  USER_ROLES,
  getAllRoles,
  getRoleLabel,
  getRoleColor,
  getProviderLabel,
  getProviderColor
} from "../../../utils/userRoles";
import type { UserDTO, AdminStats } from "../../api/types";

interface UserRow extends UserDTO {
  provider?: string;
  result?: string;
}

const Users: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Role change modal
  const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [roleChangeLoading, setRoleChangeLoading] = useState<boolean>(false);

  const roles = getAllRoles();

  // Load users and stats
  const loadData = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const [usersData, statsData] = await Promise.all([
        getAllUsers(),
        getAdminStats()
      ]);

      setUsers(usersData as UserRow[]);
      setStats(statsData);
    } catch (err) {
      console.error("Error loading users data:", err);
      setError((err as Error).message || "Failed to load users data");
      setUsers([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Handle opening role change modal
  const handleOpenRoleModal = (user: UserRow): void => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleModalOpen(true);
  };

  // Handle closing role change modal
  const handleCloseRoleModal = (): void => {
    setRoleModalOpen(false);
    setSelectedUser(null);
    setNewRole("");
  };

  // Handle role change
  const handleRoleChange = async (): Promise<void> => {
    if (!selectedUser || !newRole) return;

    setRoleChangeLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const updatedUser = await updateUserRole(selectedUser.id, newRole as 'ROLE_USER' | 'ROLE_ADMIN');

      // Update users list with updated user
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === updatedUser.id ? { ...updatedUser as UserRow } : user
        )
      );

      // Reload stats
      const statsData = await getAdminStats();
      setStats(statsData);

      setSuccessMessage(`User ${selectedUser.username}'s role updated successfully to ${getRoleLabel(newRole)}`);
      handleCloseRoleModal();
    } catch (err) {
      console.error("Error updating user role:", err);
      setError((err as Error).message || "Failed to update user role");
    } finally {
      setRoleChangeLoading(false);
    }
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      minWidth: 150,
      align: "left",
      headerAlign: "left",
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      align: "left",
      headerAlign: "left",
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center">
          <EmailOutlinedIcon sx={{ mr: 1, fontSize: "1.2rem", color: colors.grey[400] }} />
          <Typography>{params.row.email}</Typography>
        </Box>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 140,
      align: "left",
      headerAlign: "left",
      renderCell: (params: GridRenderCellParams) => {
        const roleColor = getRoleColor(params.row.role);
        return (
          <Box display="flex" alignItems="center">
            {params.row.role === USER_ROLES.ROLE_ADMIN.value ? (
              <AdminPanelSettingsOutlinedIcon sx={{ color: roleColor, mr: 0.5 }} />
            ) : (
              <PersonOutlineOutlinedIcon sx={{ color: roleColor, mr: 0.5 }} />
            )}
            <Chip
              label={getRoleLabel(params.row.role)}
              sx={{
                backgroundColor: roleColor,
                color: "#fff",
                fontWeight: "bold",
              }}
              size="small"
            />
          </Box>
        );
      },
    },
    {
      field: "provider",
      headerName: "Provider",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => {
        const providerColor = getProviderColor(params.row.provider);
        return (
          <Box display="flex" alignItems="center" justifyContent="center">
            {params.row.provider === 'GOOGLE' && (
              <GoogleIcon sx={{ color: providerColor, mr: 0.5, fontSize: "1.1rem" }} />
            )}
            {params.row.provider === 'LOCAL' && (
              <EmailOutlinedIcon sx={{ color: providerColor, mr: 0.5, fontSize: "1.1rem" }} />
            )}
            <Typography sx={{ color: providerColor, fontSize: "0.875rem" }}>
              {getProviderLabel(params.row.provider)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          onClick={() => handleOpenRoleModal(params.row)}
          sx={{
            color: colors.blueAccent[500],
            "&:hover": {
              color: colors.blueAccent[300],
            },
          }}
          size="small"
        >
          <EditOutlinedIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="USER MANAGEMENT" subtitle="Manage users and their roles" />
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadData}
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

      {/* Statistics */}
      {stats && (
        <Grid container spacing={2} mb="20px">
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: colors.primary[400],
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h6" color={colors.grey[300]}>
                  Total Users
                </Typography>
                <Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
                  {stats.totalUsers}
                </Typography>
              </Box>
              <PeopleOutlinedIcon sx={{ fontSize: "3rem", color: colors.blueAccent[500] }} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: colors.primary[400],
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h6" color={colors.grey[300]}>
                  Admin Users
                </Typography>
                <Typography variant="h3" fontWeight="bold" color={getRoleColor(USER_ROLES.ROLE_ADMIN.value)}>
                  {stats.totalAdmins}
                </Typography>
              </Box>
              <AdminPanelSettingsOutlinedIcon sx={{ fontSize: "3rem", color: getRoleColor(USER_ROLES.ROLE_ADMIN.value) }} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: colors.primary[400],
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h6" color={colors.grey[300]}>
                  Regular Users
                </Typography>
                <Typography variant="h3" fontWeight="bold" color={getRoleColor(USER_ROLES.ROLE_USER.value)}>
                  {stats.totalUsers - stats.totalAdmins}
                </Typography>
              </Box>
              <PersonOutlineOutlinedIcon sx={{ fontSize: "3rem", color: getRoleColor(USER_ROLES.ROLE_USER.value) }} />
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: "20px" }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: "20px" }} onClose={() => setError(null)}>
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
            fontWeight: "bold",
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
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
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

      {/* Role Change Modal */}
      <Dialog
        open={roleModalOpen}
        onClose={handleCloseRoleModal}
        maxWidth="sm"
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
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Change User Role
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ mt: 3 }}>
          {selectedUser && (
            <Box>
              <Typography variant="body1" mb={2} color={colors.grey[300]}>
                Change role for user: <strong>{selectedUser.username}</strong> ({selectedUser.email})
              </Typography>

              <FormControl fullWidth>
                <InputLabel sx={{ color: colors.grey[300] }}>Role</InputLabel>
                <Select
                  value={newRole}
                  onChange={(e: SelectChangeEvent) => setNewRole(e.target.value)}
                  label="Role"
                  sx={{
                    color: colors.grey[100],
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.grey[500],
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.grey[300],
                    },
                  }}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      <Box display="flex" alignItems="center">
                        <Chip
                          label={role.label}
                          sx={{
                            backgroundColor: role.color,
                            color: "#fff",
                            fontWeight: "bold",
                            mr: 1,
                          }}
                          size="small"
                        />
                        <Typography variant="body2" color={colors.grey[400]}>
                          {role.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, backgroundColor: colors.primary[500] }}>
          <Button
            onClick={handleCloseRoleModal}
            variant="outlined"
            sx={{
              borderColor: colors.grey[500],
              color: colors.grey[100],
              "&:hover": {
                borderColor: colors.grey[300],
              },
            }}
            disabled={roleChangeLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRoleChange}
            variant="contained"
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              "&:hover": {
                backgroundColor: colors.blueAccent[800],
              },
            }}
            disabled={roleChangeLoading || !newRole || newRole === selectedUser?.role}
          >
            {roleChangeLoading ? <CircularProgress size={24} /> : "Update Role"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
