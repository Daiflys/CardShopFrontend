import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";

const AdminSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box
      sx={{
        "& .ps-sidebar-root": {
          background: `${colors.primary[400]} !important`,
          height: "100vh",
        },
        "& .ps-sidebar-container": {
          background: `${colors.primary[400]} !important`,
        },
        "& .ps-menu-button": {
          backgroundColor: "transparent !important",
        },
        "& .ps-menu-button:hover": {
          color: "#868dfb !important",
          backgroundColor: "transparent !important",
        },
        "& .ps-menu-button.ps-active": {
          color: "#6870fa !important",
        },
      }}
    >
      <Sidebar collapsed={isCollapsed} width="270px">
        <Menu>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMIN
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* USER */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`https://ui-avatars.com/api/?name=Admin+User&background=6870fa&color=fff&size=100`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Admin User
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  CardMarket Admin
                </Typography>
              </Box>
            </Box>
          )}

          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <MenuItem
              icon={<HomeOutlinedIcon />}
              component={<Link to="/admin" />}
              style={{ color: colors.grey[100] }}
            >
              Dashboard
            </MenuItem>

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Data"}
            </Typography>

            <MenuItem
              icon={<UploadFileOutlinedIcon />}
              component={<Link to="/admin/bulk-upload" />}
              style={{ color: colors.grey[100] }}
            >
              Bulk Upload
            </MenuItem>

            <MenuItem
              icon={<PriceChangeOutlinedIcon />}
              component={<Link to="/admin/bulk-price" />}
              style={{ color: colors.grey[100] }}
            >
              Bulk Price Change
            </MenuItem>

            <MenuItem
              icon={<StyleOutlinedIcon />}
              component={<Link to="/admin/manage-cards" />}
              style={{ color: colors.grey[100] }}
            >
              Manage Cards
            </MenuItem>

            <MenuItem
              icon={<PeopleOutlinedIcon />}
              component={<Link to="/admin/users" />}
              style={{ color: colors.grey[100] }}
            >
              Manage Users
            </MenuItem>

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Reports"}
            </Typography>

            <MenuItem
              icon={<SellOutlinedIcon />}
              component={<Link to="/admin/sales" />}
              style={{ color: colors.grey[100] }}
            >
              Sales Overview
            </MenuItem>

            <MenuItem
              icon={<InventoryOutlinedIcon />}
              component={<Link to="/admin/inventory" />}
              style={{ color: colors.grey[100] }}
            >
              Inventory
            </MenuItem>

            <MenuItem
              icon={<AssessmentOutlinedIcon />}
              component={<Link to="/admin/audit-logs" />}
              style={{ color: colors.grey[100] }}
            >
              Audit Logs
            </MenuItem>

            {/* Customization */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Customization"}
            </Typography>

            <MenuItem
              icon={<PaletteOutlinedIcon />}
              component={<Link to="/admin/skin-editor" />}
              style={{ color: colors.grey[100] }}
            >
              Skin Editor
            </MenuItem>

            {/* Back to Website */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Navigation"}
            </Typography>

            <MenuItem
              icon={<ExitToAppOutlinedIcon />}
              component={<Link to="/" />}
              style={{ color: colors.greenAccent[500] }}
            >
              Back to Website
            </MenuItem>
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default AdminSidebar;
