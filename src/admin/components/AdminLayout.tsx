import { useState } from "react";
import { Outlet } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode, tokens } from "../theme";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const AdminLayout: React.FC = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const colors = tokens(theme.palette.mode);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div
          className="app"
          style={{
            display: "flex",
            height: "100vh",
            overflow: "hidden",
            backgroundColor: colors.primary[500]
          }}
        >
          <AdminSidebar isSidebar={isSidebar} />
          <main
            className="content"
            style={{
              flexGrow: 1,
              overflow: "auto",
              backgroundColor: colors.primary[500]
            }}
          >
            <AdminTopbar setIsSidebar={setIsSidebar} />
            <div style={{ padding: "20px" }}>
              <Outlet />
            </div>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AdminLayout;
