import React from "react";

const LineLimiterFooter = ({
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
    wrapper: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
    content: "",
    sectionsContainer: "grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-6 mb-6",
    section: "",
    sectionTitle: "text-lg font-bold mb-4 text-blue-400",
    sectionContent: "space-y-2",
    link: "text-gray-300 hover:text-white transition-colors cursor-pointer",
    bottomSection: "flex flex-col md:flex-row justify-between items-center gap-4",
    logoContainer: "",
    socialContainer: "flex space-x-4",
    copyrightContainer: "text-gray-400"
  };

  return (
    <footer className={footerStyles.container}>
      <div className={footerStyles.wrapper}>
        <div className={footerStyles.content}>
          <div className={footerStyles.sectionsContainer}>
            <div className={footerStyles.section}>
              <h3 className={footerStyles.sectionTitle}>About Us</h3>
              <div className={footerStyles.sectionContent}>
                {aboutSection}
              </div>
            </div>

            <div className={footerStyles.section}>
              <h3 className={footerStyles.sectionTitle}>Customer Service</h3>
              <div className={footerStyles.sectionContent}>
                {customerServiceSection}
              </div>
            </div>

            <div className={footerStyles.section}>
              <h3 className={footerStyles.sectionTitle}>Legal</h3>
              <div className={footerStyles.sectionContent}>
                {legalSection}
              </div>
            </div>

            <div className={footerStyles.section}>
              <h3 className={footerStyles.sectionTitle}>Follow Us</h3>
              <div className={footerStyles.socialContainer}>
                {socialMediaSection}
              </div>
            </div>
          </div>

          <div className={footerStyles.bottomSection}>
            <div className={footerStyles.logoContainer}>
              {logo}
            </div>
            <div className={footerStyles.copyrightContainer}>
              {copyrightSection}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LineLimiterFooter;