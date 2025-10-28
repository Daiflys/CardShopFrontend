import { useState, ChangeEvent, FormEvent } from "react";
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
  Grid,
  SelectChangeEvent
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import UpdateIcon from "@mui/icons-material/Update";
import { setPriceBulk, incrementPriceBulk, adjustPricePercentageBulk } from "../../api/bulkPrice";
import { languageOptions } from "../../../utils/languageFlags";
import { conditionOptions, getConditionColor as getTailwindConditionColor } from "../../../utils/cardConditions";
import { rarityOptions, getRarityColorHex, getRaritySymbol } from "../../../utils/rarityOptions";
import type { CardToSellDTO } from "../../api/types";

const BulkPriceChange: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Form state
  const [mode, setMode] = useState<string>("set");
  const [language, setLanguage] = useState<string>("en");
  const [set, setSet] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [increment, setIncrement] = useState<string>("");
  const [percentage, setPercentage] = useState<string>("");
  const [quantityLessThan, setQuantityLessThan] = useState<string>("");
  const [rarity, setRarity] = useState<string>("");
  const [condition, setCondition] = useState<string>("");

  // Result state
  const [updatedCards, setUpdatedCards] = useState<CardToSellDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Convert Tailwind color class to hex for MUI
  const tailwindToHex = (tailwindClass: string): string => {
    const colorMap: Record<string, string> = {
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
  const getConditionColorHex = (conditionCode: string): string => {
    const tailwindColor = getTailwindConditionColor(conditionCode);
    return tailwindToHex(tailwindColor);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    setUpdatedCards([]);

    try {
      let result: any;
      const baseParams = {
        language,
        set,
        rarity: rarity.toLowerCase(),
        condition
      };

      // Call appropriate endpoint based on mode
      switch (mode) {
        case "set":
          result = await setPriceBulk({
            ...baseParams,
            price: parseFloat(price)
          });
          break;

        case "increment":
          result = await incrementPriceBulk({
            ...baseParams,
            increment: parseFloat(increment),
            ...(quantityLessThan && { quantityLessThan: parseInt(quantityLessThan) })
          });
          break;

        case "percentage":
          result = await adjustPricePercentageBulk({
            ...baseParams,
            percentage: parseFloat(percentage)
          });
          break;

        default:
          throw new Error("Invalid mode selected");
      }

      // Handle paginated response and map to include id
      const cards: CardToSellDTO[] = (result.content || result).map((card: CardToSellDTO) => ({
        ...card,
        id: card.cardToSellId || card.id
      }));
      setUpdatedCards(cards);

      if (cards.length === 0) {
        setSuccessMessage("No cards found matching the criteria.");
      } else {
        setSuccessMessage(`Successfully updated ${cards.length} card(s)!`);
      }
    } catch (err) {
      console.error("Error changing prices:", err);
      setError((err as Error).message || "Failed to change prices");
      setUpdatedCards([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form reset
  const handleReset = (): void => {
    setMode("set");
    setLanguage("en");
    setSet("");
    setPrice("");
    setIncrement("");
    setPercentage("");
    setQuantityLessThan("");
    setRarity("");
    setCondition("");
    setUpdatedCards([]);
    setError(null);
    setSuccessMessage("");
  };

  // Get condition name from code
  const getConditionName = (code: string): string => {
    const condition = conditionOptions.find(opt => opt.code === code);
    return condition ? condition.name : code;
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    const baseValid = language && set && rarity && condition;

    if (!baseValid) return false;

    switch (mode) {
      case "set":
        return !!price && parseFloat(price) > 0;
      case "increment":
        return increment !== "";
      case "percentage":
        return percentage !== "";
      default:
        return false;
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
      renderCell: (params: GridRenderCellParams) => {
        const conditionColor = getConditionColorHex(params.row.condition);
        const conditionName = getConditionName(params.row.condition);
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
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          <AttachMoneyIcon sx={{ fontSize: "1rem", color: colors.greenAccent[500], mr: 0.5 }} />
          <Typography fontWeight="bold" color={colors.greenAccent[500]}>
            {params.row.cardPrice?.toFixed(2) || "0.00"}
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
            {/* Mode Selector */}
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: colors.grey[300] }}>Mode</InputLabel>
                <Select
                  value={mode}
                  onChange={(e: SelectChangeEvent) => setMode(e.target.value)}
                  label="Mode"
                  sx={{
                    color: colors.grey[100],
                  }}
                >
                  <MenuItem value="set">
                    <Box>
                      <Typography fontWeight="bold">Set Fixed Price</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Assign a fixed price to all matching cards
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="increment">
                    <Box>
                      <Typography fontWeight="bold">Increment Price</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Add or subtract a fixed amount (with optional stock filter)
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="percentage">
                    <Box>
                      <Typography fontWeight="bold">Adjust by Percentage</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Increase or decrease price by percentage
                      </Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Language */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: colors.grey[300] }}>Language</InputLabel>
                <Select
                  value={language}
                  onChange={(e: SelectChangeEvent) => setLanguage(e.target.value)}
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSet(e.target.value)}
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

            {/* Conditional Fields Based on Mode */}
            {mode === "set" && (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Price"
                  value={price}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                  inputProps={{ min: 0.01, step: 0.01 }}
                  helperText="Fixed price to set (must be > 0)"
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
            )}

            {mode === "increment" && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Increment"
                    value={increment}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setIncrement(e.target.value)}
                    inputProps={{ step: 0.01 }}
                    helperText="Amount to add (negative to subtract)"
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
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Quantity Less Than (Optional)"
                    value={quantityLessThan}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantityLessThan(e.target.value)}
                    inputProps={{ min: 1, step: 1 }}
                    helperText="Only update cards with stock below this value"
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
              </>
            )}

            {mode === "percentage" && (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Percentage"
                  value={percentage}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPercentage(e.target.value)}
                  inputProps={{ step: 0.1 }}
                  helperText="Percentage to adjust (e.g., 10 for +10%, -5 for -5%)"
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
            )}

            {/* Rarity */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: colors.grey[300] }}>Rarity</InputLabel>
                <Select
                  value={rarity}
                  onChange={(e: SelectChangeEvent) => setRarity(e.target.value)}
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
                  onChange={(e: SelectChangeEvent) => setCondition(e.target.value)}
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
                  disabled={!isFormValid() || loading}
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
