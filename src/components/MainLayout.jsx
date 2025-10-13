import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ThemeDemo from "./ThemeDemo";

const MainLayout = () => {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #f8fafc, #f0f9ff)' }}>
      <Header onThemeSettingsClick={() => setIsThemeModalOpen(true)} />
      <ThemeDemo
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
