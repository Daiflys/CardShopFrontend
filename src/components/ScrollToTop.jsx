import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 *
 * Automatically scrolls to the top of the page whenever the route changes.
 * This ensures users always see the top of a new page instead of maintaining
 * the scroll position from the previous page.
 *
 * Usage: Place inside <BrowserRouter> in App.jsx
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately when route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything
}

export default ScrollToTop;
