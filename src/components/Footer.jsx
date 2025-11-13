import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    navigate(path);
  };

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-sky-300">
              {t('footer.about', 'About Us')}
            </h3>
            <ul className="space-y-2">
              <li>
                <span
                  onClick={() => handleLinkClick('/about')}
                  className="text-slate-300 hover:text-sky-300 transition-colors cursor-pointer inline-block"
                >
                  {t('footer.aboutUs', 'About My TCG Shop')}
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleLinkClick('/contact')}
                  className="text-slate-300 hover:text-sky-300 transition-colors cursor-pointer inline-block"
                >
                  {t('footer.contact', 'Contact Us')}
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleLinkClick('/careers')}
                  className="text-slate-300 hover:text-sky-300 transition-colors cursor-pointer inline-block"
                >
                  {t('footer.careers', 'Careers')}
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleLinkClick('/blog')}
                  className="text-slate-300 hover:text-sky-300 transition-colors cursor-pointer inline-block"
                >
                  {t('footer.blog', 'Blog')}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-sky-300">
              {t('footer.customerService', 'Customer Service')}
            </h3>
            <ul className="space-y-2">
              <li>
                <span
                  onClick={() => handleLinkClick('/help')}
                  className="text-slate-300 hover:text-sky-300 transition-colors cursor-pointer inline-block"
                >
                  {t('footer.help', 'Help Center')}
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleLinkClick('/shipping')}
                  className="text-slate-300 hover:text-sky-300 transition-colors cursor-pointer inline-block"
                >
                  {t('footer.shipping', 'Shipping Info')}
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleLinkClick('/returns')}
                  className="text-slate-300 hover:text-sky-300 transition-colors cursor-pointer inline-block"
                >
                  {t('footer.returns', 'Returns & Refunds')}
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleLinkClick('/track')}
                  className="text-slate-300 hover:text-sky-300 transition-colors cursor-pointer inline-block"
                >
                  {t('footer.track', 'Track Your Order')}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-sky-300">
              {t('footer.legal', 'Legal')}
            </h3>
            <ul className="space-y-2">
              <li>
                <span
                  onClick={() => handleLinkClick('/privacy')}
                  className="text-slate-300 hover:text-sky-300 transition-colors cursor-pointer inline-block"
                >
                  {t('footer.privacy', 'Privacy Policy')}
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleLinkClick('/terms')}
                  className="text-slate-300 hover:text-sky-300 transition-colors cursor-pointer inline-block"
                >
                  {t('footer.terms', 'Terms of Service')}
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleLinkClick('/cookies')}
                  className="text-slate-300 hover:text-sky-300 transition-colors cursor-pointer inline-block"
                >
                  {t('footer.cookies', 'Cookie Policy')}
                </span>
              </li>
              <li>
                <span
                  onClick={() => handleLinkClick('/security')}
                  className="text-slate-300 hover:text-sky-300 transition-colors cursor-pointer inline-block"
                >
                  {t('footer.security', 'Security')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8">
          {/* Logo Section - Centered */}
          <div className="flex justify-center mb-6">
            <div className="text-sky-300">
              <Logo className="w-10 h-10" />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-slate-400 hover:text-sky-300 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-sky-300 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-sky-300 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.71 13.742 3.71 12.445c0-1.297.488-2.448 1.297-3.323.875-.875 2.026-1.297 3.323-1.297 1.297 0 2.448.422 3.323 1.297.875.875 1.297 2.026 1.297 3.323 0 1.297-.422 2.448-1.297 3.323-.875.807-2.026 1.297-3.323 1.297zm7.83-9.037h-1.441V6.547h1.441v1.404zm-.72 5.094c0 .36-.072.703-.216 1.009-.144.306-.348.573-.612.801s-.573.408-.924.54c-.351.132-.729.198-1.134.198-.405 0-.783-.066-1.134-.198-.351-.132-.66-.312-.924-.54s-.468-.495-.612-.801c-.144-.306-.216-.649-.216-1.009 0-.36.072-.703.216-1.009.144-.306.348-.573.612-.801s.573-.408.924-.54c.351-.132.729-.198 1.134-.198.405 0 .783.066 1.134.198.351.132.66.312.924.54s.468.495.612.801c.144.306.216.649.216 1.009z"/>
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-slate-400">
              © {new Date().getFullYear()} My TCG Shop. {t('footer.allRightsReserved', 'All rights reserved.')}{' '}
              <span className="text-xs">
                Made with ❤️ for TCG collectors
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
