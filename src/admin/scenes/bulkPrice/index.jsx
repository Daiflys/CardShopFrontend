import { useState } from "react";
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
  Paper,
  Grid
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import UpdateIcon from "@mui/icons-material/Update";
import { changePriceBulk } from "../../api/bulkPrice";
import { languageOptions } from "../../../utils/languageFlags";
import { conditionOptions, getConditionColor as getTailwindConditionColor } from "../../../utils/cardConditions";
import { rarityOptions, getRarityColorHex, getRaritySymbol } from "../../../utils/rarityOptions";

const BulkPriceChange = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Form state
  const [language, setLanguage] = useState("en");
  const [set, setSet] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [rarity, setRarity] = useState("");
  const [condition, setCondition] = useState("");

  // Result state
  const [updatedCards, setUpdatedCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Convert Tailwind color class to hex for MUI
  const tailwindToHex = (tailwindClass) => {
    const colorMap = {
      'bg-cyan-400': '#22d3ee',
      'bg-green-500': '#22c55e',
      'bg-yellow-600': '#ca8a04',
      'bg-yellow-500': '#eab308',
      'bg-orange-500': '#f97316',
      'bg-red-400': '#f87171',
      'bg-red-600': '#dc2626'
    };
    return colorMap[tailwindClass] || '#9ca3af';
  };

  // Get condition color in hex
  const getConditionColorHex = (conditionCode) => {
    const tailwindColor = getTailwindConditionColor(conditionCode);
    return tailwindToHex(tailwindColor);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    setUpdatedCards([]);

    try {
      const result = await changePriceBulk({
        language,
        set,
        newPrice: parseFloat(newPrice),
        rarity: rarity.toLowerCase(), // Ensure lowercase for rarity
        condition
      });

      // Handle paginated response and map to include id
      const cards = (result.content || result).map(card => ({
        ...card,
        id: card.cardToSellId || card.id // Use cardToSellId as id for DataGrid
      }));
      setUpdatedCards(cards);

      if (cards.length === 0) {
        setSuccessMessage("No cards found matching the criteria.");
      } else {
        setSuccessMessage(`Successfully updated ${cards.length} card(s)!`);
      }
    } catch (err) {
      console.error("Error changing prices:", err);
      setError(err.message || "Failed to change prices");
      setUpdatedCards([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setLanguage("en");
    setSet("");
    setNewPrice("");
    setRarity("");
    setCondition("");
    setUpdatedCards([]);
    setError(null);
    setSuccessMessage("");
  };

  // Get condition name from code
  const getConditionName = (code) => {
    const condition = conditionOptions.find(opt => opt.code === code);
    return condition ? condition.name : code;
  };

  // Check if form is valid
  const isFormValid = language && set && newPrice && rarity && condition && parseFloat(newPrice) > 0;

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
      field: "name",
      headerName: "Card Name",
      flex: 1,
      minWidth: 200,
      align: "left",
      headerAlign: "left",
      cellClassName: "name-column--cell",
    },
    {
      field: "setName",
      headerName: "Set",
      width: 120,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "condition",
      headerName: "Condition",
      width: 150,
      align: "left",
      headerAlign: "left",
      renderCell: ({ row }) => {
        const conditionColor = getConditionColorHex(row.condition);
        const conditionName = getConditionName(row.condition);
        return (
          <Chip
            label={conditionName}
            sx={{
              backgroundColor: conditionColor,
              color: "#fff",
              fontWeight: "bold",
            }}
            size="small"
          />
        );
      },
    },
    {
      field: "cardPrice",
      headerName: "New Price",
      width: 120,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          <AttachMoneyIcon sx={{ fontSize: "1rem", color: colors.greenAccent[500], mr: 0.5 }} />
          <Typography fontWeight="bold" color={colors.greenAccent[500]}>
            {row.cardPrice?.toFixed(2) || "0.00"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Box m="20px">
      <Header title="BULK PRICE CHANGE" subtitle="Update prices for multiple cards at once" />

      {/* Form */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: colors.primary[400],
          borderRadius: "8px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Language */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: colors.grey[300] }}>Language</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  label="Language"
                  sx={{
                    color: colors.grey[100],
                  }}
                >
                  {languageOptions.map((lang) => (
                    <MenuItem key={lang.key} value={lang.key}>
                      <Box display="flex" alignItems="center">
                        <Box mr={1}>{lang.flag}</Box>
                        <Typography>{lang.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Set */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Set Code"
                value={set}
                onChange={(e) => setSet(e.target.value)}
                placeholder="e.g., MOM, BRO, ONE"
                helperText="3-letter set code (case insensitive)"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: colors.grey[100],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.grey[300],
                  },
                  "& .MuiFormHelperText-root": {
                    color: colors.grey[400],
                  },
                }}
              />
            </Grid>

            {/* New Price */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="New Price"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                inputProps={{ min: 0.01, step: 0.01 }}
                helperText="Must be greater than 0"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: colors.grey[100],
                  },
                  "& .MuiInputLabel-root": {
                    color: colors.grey[300],
                  },
                  "& .MuiFormHelperText-root": {
                    color: colors.grey[400],
                  },
                }}
              />
            </Grid>

            {/* Rarity */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: colors.grey[300] }}>Rarity</InputLabel>
                <Select
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value)}
                  label="Rarity"
                  sx={{
                    color: colors.grey[100],
                  }}
                >
                  <MenuItem value="">
                    <em>Select rarity</em>
                  </MenuItem>
                  {rarityOptions.filter(r => r !== 'All').map((r) => (
                    <MenuItem key={r} value={r}>
                      <Box display="flex" alignItems="center">
                        <Chip
                          label={getRaritySymbol(r)}
                          sx={{
                            backgroundColor: getRarityColorHex(r),
                            color: "#fff",
                            fontWeight: "bold",
                            mr: 1,
                            minWidth: "30px",
                          }}
                          size="small"
                        />
                        <Typography>{r}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Condition */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: colors.grey[300] }}>Condition</InputLabel>
                <Select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  label="Condition"
                  sx={{
                    color: colors.grey[100],
                  }}
                >
                  <MenuItem value="">
                    <em>Select condition</em>
                  </MenuItem>
                  {conditionOptions.map((c) => (
                    <MenuItem key={c.code} value={c.code}>
                      <Box display="flex" alignItems="center">
                        <Chip
                          label={c.code}
                          sx={{
                            backgroundColor: getConditionColorHex(c.code),
                            color: "#fff",
                            fontWeight: "bold",
                            mr: 1,
                            minWidth: "40px",
                          }}
                          size="small"
                        />
                        <Typography>{c.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Buttons */}
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" gap={1} height="100%" alignItems="center">
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <UpdateIcon />}
                  disabled={!isFormValid || loading}
                  sx={{
                    backgroundColor: colors.greenAccent[700],
                    color: colors.grey[100],
                    "&:hover": {
                      backgroundColor: colors.greenAccent[800],
                    },
                    flex: 1,
                  }}
                >
                  {loading ? "Updating..." : "Update Prices"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  disabled={loading}
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
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Results Table */}
      {updatedCards.length > 0 && (
        <Box
          height="60vh"
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
          }}
        >
          <DataGrid
            rows={updatedCards}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            sx={{
              "& .MuiDataGrid-row:hover": {
                backgroundColor: colors.primary[300],
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default BulkPriceChange;
