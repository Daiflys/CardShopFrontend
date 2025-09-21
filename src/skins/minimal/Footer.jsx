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
  return (
    <footer className={theme.components.footer.container}>
      <div className={theme.components.footer.content}>
        {/* Simplified single row layout for minimal design */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 mb-8">
          {/* Logo and main links */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className={theme.components.footer.logoContainer}>
              {logo}
            </div>

            {/* Simplified navigation - just essential links */}
            <div className="flex flex-wrap gap-4 text-center md:text-left text-sm">
              <span className={theme.components.footer.link}>About</span>
              <span className={theme.components.footer.link}>Contact</span>
              <span className={theme.components.footer.link}>Help</span>
              <span className={theme.components.footer.link}>Privacy</span>
            </div>
          </div>

          {/* Social media only */}
          <div className="flex space-x-4">
            {socialMediaSection}
          </div>
        </div>

        {/* Copyright only */}
        <div className={`${theme.components.footer.divider} text-center`}>
          <div className={theme.components.footer.copyright}>
            {copyrightSection}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;