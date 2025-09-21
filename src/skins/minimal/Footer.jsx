import React from "react";

const MinimalFooter = ({
  theme,
  logo,
  aboutSection,
  customerServiceSection,
  legalSection,
  socialMediaSection,
  copyrightSection
}) => {
  const footerStyles = theme?.components?.footer || {
    container: "bg-gray-800 text-white",
    content: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
    logoContainer: "",
    link: "text-gray-300 hover:text-white transition-colors cursor-pointer",
    divider: "border-t border-gray-700 pt-6",
    copyright: "text-gray-400"
  };

  return (
    <footer className={footerStyles.container}>
      <div className={footerStyles.content}>
        {/* Simplified single row layout for minimal design */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 mb-8">
          {/* Logo and main links */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className={footerStyles.logoContainer}>
              {logo}
            </div>

            {/* Simplified navigation - just essential links */}
            <div className="flex flex-wrap gap-4 text-center md:text-left text-sm">
              <span className={footerStyles.link}>About</span>
              <span className={footerStyles.link}>Contact</span>
              <span className={footerStyles.link}>Help</span>
              <span className={footerStyles.link}>Privacy</span>
            </div>
          </div>

          {/* Social media only */}
          <div className="flex space-x-4">
            {socialMediaSection}
          </div>
        </div>

        {/* Copyright only */}
        <div className={`${footerStyles.divider} text-center`}>
          <div className={footerStyles.copyright}>
            {copyrightSection}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;