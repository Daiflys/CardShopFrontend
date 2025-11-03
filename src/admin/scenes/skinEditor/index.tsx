import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme as useMuiTheme,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { tokens } from "../../theme";
import AdminHeader from "../../components/Header";
import MainHeader from "../../../components/Header";
import { useSkin } from "../../../hooks/useComponent";
import { useTheme as useAppTheme } from "../../../hooks/useTheme";
import { useThemeConfigStore } from "../../../store/themeConfigStore";

interface HeaderElementConfig {
  visible: boolean;
  width?: string;
  fontSize?: string;
}

interface HeaderElements {
  logo: HeaderElementConfig;
  search: HeaderElementConfig;
  navigation: HeaderElementConfig;
  cart: HeaderElementConfig;
  userMenu: HeaderElementConfig;
  languageSwitcher: HeaderElementConfig;
}

interface HeaderStyles {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  height: string;
  padding: string;
}

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

const SkinEditor: React.FC = () => {
  const theme = useMuiTheme();
  const colors = tokens(theme.palette.mode);

  // Skin management
  const { currentSkin, availableSkins, switchSkin } = useSkin();
  const { theme: appTheme, updateTheme } = useAppTheme();

  // Theme config store
  const { themes, fetchThemes, createTheme, activateTheme } = useThemeConfigStore();

  // Tab state
  const [currentTab, setCurrentTab] = useState<number>(0);

  // Preview mode state
  const [previewMode, setPreviewMode] = useState<string>("desktop");

  // Dialog states
  const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState<boolean>(false);
  const [themeName, setThemeName] = useState<string>("");
  const [themeDescription, setThemeDescription] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Header element configurations
  const [headerElements, setHeaderElements] = useState<HeaderElements>({
    logo: { visible: true, width: '120px', fontSize: '24px' },
    search: { visible: true, width: '400px' },
    navigation: { visible: true },
    cart: { visible: true },
    userMenu: { visible: true },
    languageSwitcher: { visible: true },
  });

  // Header style editor state
  const [headerStyles, setHeaderStyles] = useState<HeaderStyles>({
    backgroundColor: '#f0f9ff',
    textColor: '#0284c7',
    borderColor: '#e0f2fe',
    buttonBgColor: '#0284c7',
    buttonTextColor: '#ffffff',
    height: 'auto',
    padding: '16px',
  });

  // Load themes on mount
  useEffect(() => {
    fetchThemes().catch((err) => {
      console.error("Failed to fetch themes:", err);
    });
  }, [fetchThemes]);

  // Tab panel component
  const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
      </div>
    );
  };

  // Serialize current configuration to JSON
  const serializeConfig = () => {
    return JSON.stringify({
      skin: currentSkin,
      components: {
        header: {
          elements: headerElements,
          styles: headerStyles,
        },
      },
    });
  };

  // Deserialize JSON config and apply to state
  const deserializeConfig = (configJson: string) => {
    try {
      const config = JSON.parse(configJson);

      if (config.skin && availableSkins.includes(config.skin)) {
        switchSkin(config.skin);
      }

      if (config.components?.header?.elements) {
        setHeaderElements(config.components.header.elements);
      }

      if (config.components?.header?.styles) {
        setHeaderStyles(config.components.header.styles);
      }

      return true;
    } catch (error) {
      console.error("Failed to deserialize config:", error);
      return false;
    }
  };

  // Handle save theme
  const handleSaveTheme = async () => {
    if (!themeName.trim()) {
      setSnackbarMessage("Please enter a theme name");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const configJson = serializeConfig();
      await createTheme({
        name: themeName,
        description: themeDescription,
        configJson,
      });

      setSnackbarMessage("Theme saved successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setSaveDialogOpen(false);
      setThemeName("");
      setThemeDescription("");

      // Refresh themes list
      fetchThemes();
    } catch (error: any) {
      setSnackbarMessage("Failed to save theme: " + error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle load theme
  const handleLoadTheme = async (themeId: number) => {
    try {
      const themeToLoad = themes.find((t) => t.id === themeId);
      if (!themeToLoad) {
        throw new Error("Theme not found");
      }

      const success = deserializeConfig(themeToLoad.configJson);
      if (success) {
        // Also activate the theme
        await activateTheme(themeId);

        setSnackbarMessage("Theme loaded and activated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setLoadDialogOpen(false);
      } else {
        throw new Error("Invalid theme configuration");
      }
    } catch (error: any) {
      setSnackbarMessage("Failed to load theme: " + error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box m="20px">
      <AdminHeader title="SKIN EDITOR" subtitle="Visual editor for customizing your website components" />

      {/* Save/Load Theme Buttons */}
      <Box display="flex" gap={2} mb={3}>
        <Button
          variant="contained"
          onClick={() => setSaveDialogOpen(true)}
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: colors.greenAccent[700],
            },
          }}
        >
          💾 Save Theme
        </Button>
        <Button
          variant="contained"
          onClick={() => setLoadDialogOpen(true)}
          sx={{
            backgroundColor: colors.blueAccent[600],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: colors.blueAccent[700],
            },
          }}
        >
          📂 Load Theme
        </Button>
      </Box>

      {/* Main Tabs */}
      <Box backgroundColor={colors.primary[400]} borderRadius="8px" mb={3}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue: number) => setCurrentTab(newValue)}
          sx={{
            "& .MuiTab-root": {
              color: colors.grey[100],
              fontSize: "16px",
              fontWeight: "600",
            },
            "& .Mui-selected": {
              color: colors.greenAccent[500],
            },
            "& .MuiTabs-indicator": {
              backgroundColor: colors.greenAccent[500],
            },
          }}
        >
          <Tab label="Header Editor" />
          <Tab label="Footer Editor" />
          <Tab label="Card Styles" />
          <Tab label="Global Styles" />
        </Tabs>
      </Box>

      {/* Skin Selector - Always visible */}
      <Box backgroundColor={colors.primary[400]} p={3} borderRadius="8px" mb={3}>
        <Typography variant="h4" mb={2} color={colors.grey[100]}>
          Current Skin Template
        </Typography>

        <FormControl fullWidth>
          <InputLabel>Select Skin</InputLabel>
          <Select
            value={currentSkin}
            onChange={(e: SelectChangeEvent) => switchSkin(e.target.value)}
            label="Select Skin"
          >
            {availableSkins.map((skin) => (
              <MenuItem key={skin} value={skin}>
                {skin.charAt(0).toUpperCase() + skin.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="body2" mt={2} color={colors.grey[300]}>
          Currently active: <strong>{currentSkin}</strong>
        </Typography>
      </Box>

      {/* TAB 0: Header Editor */}
      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={3}>
          {/* Header Preview */}
          <Grid item xs={12}>
            <Box backgroundColor={colors.primary[400]} p={3} borderRadius="8px">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" color={colors.grey[100]}>
                  Header Preview
                </Typography>

                {/* Mobile/Desktop Toggle */}
                <Box display="flex" gap={1}>
                  <Button
                    variant={previewMode === "desktop" ? "contained" : "outlined"}
                    onClick={() => setPreviewMode("desktop")}
                    sx={{
                      backgroundColor: previewMode === "desktop" ? colors.blueAccent[600] : "transparent",
                      color: colors.grey[100],
                      borderColor: colors.blueAccent[600],
                    }}
                  >
                    Desktop
                  </Button>
                  <Button
                    variant={previewMode === "mobile" ? "contained" : "outlined"}
                    onClick={() => setPreviewMode("mobile")}
                    sx={{
                      backgroundColor: previewMode === "mobile" ? colors.blueAccent[600] : "transparent",
                      color: colors.grey[100],
                      borderColor: colors.blueAccent[600],
                    }}
                  >
                    Mobile
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  position: 'relative',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  width: previewMode === "mobile" ? '375px' : '100%',
                  maxWidth: '100%',
                  margin: previewMode === "mobile" ? '0 auto' : '0',
                  transition: 'width 0.3s ease',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    zIndex: 10,
                    pointerEvents: 'all',
                    cursor: 'not-allowed',
                  },
                  '&::after': {
                    content: '"🔒 PREVIEW MODE - Click disabled"',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    zIndex: 11,
                    pointerEvents: 'none',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  },
                  '&:hover::after': {
                    opacity: 1,
                  },
                  '& header': {
                    background: `${headerStyles.backgroundColor} !important`,
                    borderColor: `${headerStyles.borderColor} !important`,
                    padding: `${headerStyles.padding} !important`,
                  },
                  '& header a, & header button[class*="logo"], & header nav a': {
                    color: `${headerStyles.textColor} !important`,
                  },
                  '& header button[class*="signup"], & header button[class*="REGÍSTRATE"]': {
                    background: `${headerStyles.buttonBgColor} !important`,
                    color: `${headerStyles.buttonTextColor} !important`,
                  },
                  '& header button[class*="logo"], & header a[class*="logo"]': {
                    display: headerElements.logo.visible ? 'flex' : 'none !important',
                    width: headerElements.logo.width,
                    fontSize: headerElements.logo.fontSize,
                  },
                  '& header input[type="search"], & header [class*="search"], & header form': {
                    display: headerElements.search.visible ? 'flex' : 'none !important',
                    width: headerElements.search.width,
                  },
                  '& header nav': {
                    display: headerElements.navigation.visible ? 'flex' : 'none !important',
                  },
                  '& header [class*="cart"], & header button[aria-label*="cart"]': {
                    display: headerElements.cart.visible ? 'flex' : 'none !important',
                  },
                  '& header [class*="user"], & header button[aria-label*="user"]': {
                    display: headerElements.userMenu.visible ? 'flex' : 'none !important',
                  },
                  '& header [class*="language"], & header select[class*="lang"]': {
                    display: headerElements.languageSwitcher.visible ? 'flex' : 'none !important',
                  },
                }}
              >
                <MainHeader />
              </Box>

              <Typography variant="body2" mt={2} color={colors.grey[300]}>
                {previewMode === "mobile"
                  ? "Mobile preview (375px width). Use the controls below to edit elements."
                  : "Desktop preview. Use the controls below to edit elements."}
              </Typography>
            </Box>
          </Grid>

          {/* Element Inspector */}
          <Grid item xs={12} md={6}>
            <Box backgroundColor={colors.primary[400]} p={3} borderRadius="8px">
              <Typography variant="h4" mb={3} color={colors.grey[100]}>
                Element Visibility & Size
              </Typography>

              {Object.entries(headerElements).map(([key, config]) => (
                <Box key={key} mb={3} p={2} backgroundColor={colors.primary[500]} borderRadius="4px">
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" color={colors.grey[100]}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.visible}
                          onChange={(e) =>
                            setHeaderElements({
                              ...headerElements,
                              [key]: { ...config, visible: e.target.checked },
                            })
                          }
                        />
                      }
                      label="Visible"
                    />
                  </Box>

                  {config.width && (
                    <TextField
                      fullWidth
                      label="Width"
                      value={config.width}
                      onChange={(e) =>
                        setHeaderElements({
                          ...headerElements,
                          [key]: { ...config, width: e.target.value },
                        })
                      }
                      size="small"
                      placeholder="e.g., 200px, 50%, auto"
                    />
                  )}

                  {config.fontSize && (
                    <TextField
                      fullWidth
                      label="Font Size"
                      value={config.fontSize}
                      onChange={(e) =>
                        setHeaderElements({
                          ...headerElements,
                          [key]: { ...config, fontSize: e.target.value },
                        })
                      }
                      size="small"
                      sx={{ mt: 1 }}
                      placeholder="e.g., 16px, 1.5rem"
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Color & Style Editor */}
          <Grid item xs={12} md={6}>
            <Box backgroundColor={colors.primary[400]} p={3} borderRadius="8px">
              <Typography variant="h4" mb={3} color={colors.grey[100]}>
                Colors & Styles
              </Typography>

              <Grid container spacing={2}>
                {/* Background Color */}
                <Grid item xs={12}>
                  <Typography variant="h6" mb={1} color={colors.grey[100]}>
                    Background Color
                  </Typography>
                  <Box display="flex" gap={2}>
                    <input
                      type="color"
                      value={headerStyles.backgroundColor}
                      onChange={(e) =>
                        setHeaderStyles({ ...headerStyles, backgroundColor: e.target.value })
                      }
                      style={{ width: "60px", height: "40px", cursor: "pointer" }}
                    />
                    <TextField
                      fullWidth
                      value={headerStyles.backgroundColor}
                      onChange={(e) =>
                        setHeaderStyles({ ...headerStyles, backgroundColor: e.target.value })
                      }
                      size="small"
                    />
                  </Box>
                </Grid>

                {/* Text Color */}
                <Grid item xs={12}>
                  <Typography variant="h6" mb={1} color={colors.grey[100]}>
                    Text Color
                  </Typography>
                  <Box display="flex" gap={2}>
                    <input
                      type="color"
                      value={headerStyles.textColor}
                      onChange={(e) =>
                        setHeaderStyles({ ...headerStyles, textColor: e.target.value })
                      }
                      style={{ width: "60px", height: "40px", cursor: "pointer" }}
                    />
                    <TextField
                      fullWidth
                      value={headerStyles.textColor}
                      onChange={(e) =>
                        setHeaderStyles({ ...headerStyles, textColor: e.target.value })
                      }
                      size="small"
                    />
                  </Box>
                </Grid>

                {/* Button Colors */}
                <Grid item xs={12}>
                  <Typography variant="h6" mb={1} color={colors.grey[100]}>
                    Button Background
                  </Typography>
                  <Box display="flex" gap={2}>
                    <input
                      type="color"
                      value={headerStyles.buttonBgColor}
                      onChange={(e) =>
                        setHeaderStyles({ ...headerStyles, buttonBgColor: e.target.value })
                      }
                      style={{ width: "60px", height: "40px", cursor: "pointer" }}
                    />
                    <TextField
                      fullWidth
                      value={headerStyles.buttonBgColor}
                      onChange={(e) =>
                        setHeaderStyles({ ...headerStyles, buttonBgColor: e.target.value })
                      }
                      size="small"
                    />
                  </Box>
                </Grid>

                {/* Padding */}
                <Grid item xs={12}>
                  <Typography variant="h6" mb={1} color={colors.grey[100]}>
                    Padding
                  </Typography>
                  <TextField
                    fullWidth
                    value={headerStyles.padding}
                    onChange={(e) =>
                      setHeaderStyles({ ...headerStyles, padding: e.target.value })
                    }
                    size="small"
                    placeholder="e.g., 16px, 1rem 2rem"
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  // Save configuration to localStorage for SkinConfigListener
                  const skinConfig = {
                    header: {
                      elements: headerElements,
                      styles: headerStyles,
                    },
                    timestamp: new Date().toISOString(),
                  };

                  localStorage.setItem('skinEditorConfig', JSON.stringify(skinConfig));

                  // Dispatch custom event for same-window updates
                  window.dispatchEvent(new CustomEvent('skinConfigUpdate'));

                  setSnackbarMessage('Header styles saved successfully!');
                  setSnackbarSeverity('success');
                  setSnackbarOpen(true);
                }}
                sx={{
                  mt: 3,
                  backgroundColor: colors.greenAccent[600],
                  color: colors.grey[100],
                  fontSize: "16px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: colors.greenAccent[700],
                  },
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>

      {/* TAB 1: Footer Editor */}
      <TabPanel value={currentTab} index={1}>
        <Box backgroundColor={colors.primary[400]} p={3} borderRadius="8px">
          <Typography variant="h4" color={colors.grey[100]}>
            Footer Editor (Coming Soon)
          </Typography>
          <Typography variant="body1" color={colors.grey[300]} mt={2}>
            Configure footer styles, visibility, and layout here.
          </Typography>
        </Box>
      </TabPanel>

      {/* TAB 2: Card Styles */}
      <TabPanel value={currentTab} index={2}>
        <Box backgroundColor={colors.primary[400]} p={3} borderRadius="8px">
          <Typography variant="h4" color={colors.grey[100]}>
            Card Styles (Coming Soon)
          </Typography>
          <Typography variant="body1" color={colors.grey[300]} mt={2}>
            Customize product card and search result card styles here.
          </Typography>
        </Box>
      </TabPanel>

      {/* TAB 3: Global Styles */}
      <TabPanel value={currentTab} index={3}>
        <Box backgroundColor={colors.primary[400]} p={3} borderRadius="8px">
          <Typography variant="h4" color={colors.grey[100]}>
            Global Styles (Coming Soon)
          </Typography>
          <Typography variant="body1" color={colors.grey[300]} mt={2}>
            Configure typography, spacing, and global color palette here.
          </Typography>
        </Box>
      </TabPanel>

      {/* Save Theme Dialog */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Save Theme Configuration</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Theme Name"
            type="text"
            fullWidth
            variant="outlined"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={themeDescription}
            onChange={(e) => setThemeDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveTheme} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Load Theme Dialog */}
      <Dialog
        open={loadDialogOpen}
        onClose={() => setLoadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Load Theme Configuration</DialogTitle>
        <DialogContent>
          {themes.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              No saved themes found. Create one by clicking "Save Theme" button.
            </Typography>
          ) : (
            <List>
              {themes.map((theme) => (
                <ListItem key={theme.id} disablePadding>
                  <ListItemButton onClick={() => handleLoadTheme(theme.id!)}>
                    <ListItemText
                      primary={theme.name}
                      secondary={
                        <>
                          {theme.description && <span>{theme.description}<br /></span>}
                          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                            Created: {new Date(theme.createdAt!).toLocaleDateString()}
                            {theme.isActive && ' • Active'}
                          </span>
                        </>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoadDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SkinEditor;
