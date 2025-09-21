import React from "react";

const DefaultFooter = ({
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
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: About */}
          <div className="space-y-4">
            {aboutSection}
          </div>

          {/* Column 2: Customer Service */}
          <div className="space-y-4">
            {customerServiceSection}
          </div>

          {/* Column 3: Legal & Policies */}
          <div className="space-y-4">
            {legalSection}
          </div>
        </div>

        {/* Divider */}
        <div className={theme.components.footer.divider}>
          {/* Logo Section - Centered */}
          <div className="flex justify-center mb-6">
            <div className={theme.components.footer.logoContainer}>
              {logo}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media */}
            <div className="flex space-x-4">
              {socialMediaSection}
            </div>

            {/* Copyright */}
            <div className={theme.components.footer.copyright}>
              {copyrightSection}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DefaultFooter;