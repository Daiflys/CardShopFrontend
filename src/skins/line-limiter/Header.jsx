import React from "react";

const LineLimiterHeader = ({
  theme,
  logo,
  navigation,
  searchComponent,
  userMenu,
  languageSwitcher
}) => {
  const headerStyles = theme?.components?.header || {
    container: "bg-blue-600 text-white shadow-lg",
    wrapper: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    content: "flex items-center justify-between h-16",
    leftSection: "flex items-center space-x-8",
    logo: "text-xl font-bold text-white",
    navigation: "hidden md:flex space-x-6 ml-4",
    centerSection: "flex-1 max-w-lg mx-8",
    rightSection: "flex items-center space-x-4",
    languageSwitcher: ""
  };

  return (
    <header className={headerStyles.container}>
      <div className={headerStyles.wrapper}>
        <div className={headerStyles.content}>
          <div className={headerStyles.leftSection}>
            <div className={headerStyles.logo}>
              {logo}
            </div>
            <nav className={headerStyles.navigation}>
              {navigation}
            </nav>
          </div>

          <div className={headerStyles.centerSection}>
            {searchComponent}
          </div>

          <div className={headerStyles.rightSection}>
            <div className={headerStyles.languageSwitcher}>
              {languageSwitcher}
            </div>
            {userMenu}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LineLimiterHeader;