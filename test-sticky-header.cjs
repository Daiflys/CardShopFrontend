const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Starting sticky header test...');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  try {
    // Step 1: Navigate to the homepage
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Step 2: Take screenshot at the top
    console.log('Taking screenshot at top of page...');
    await page.screenshot({
      path: 'homepage-top.png',
      fullPage: false
    });
    console.log('Screenshot saved: homepage-top.png');

    // Step 3: Get header element and its computed styles BEFORE scrolling
    console.log('\nInspecting header element BEFORE scroll...');
    const headerInfoBefore = await page.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return { found: false };

      const computedStyle = window.getComputedStyle(header);
      const rect = header.getBoundingClientRect();

      return {
        found: true,
        className: header.className,
        position: computedStyle.position,
        top: computedStyle.top,
        zIndex: computedStyle.zIndex,
        position_actual: computedStyle.getPropertyValue('position'),
        boundingRect: {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          height: rect.height,
          width: rect.width
        }
      };
    });

    console.log('Header info before scroll:', JSON.stringify(headerInfoBefore, null, 2));

    // Step 4: Scroll down by 1000px
    console.log('\nScrolling down by 1000px...');
    await page.evaluate(() => {
      window.scrollBy(0, 1000);
    });
    await page.waitForTimeout(500); // Wait for scroll to complete

    // Step 5: Take screenshot after scrolling
    console.log('Taking screenshot after scroll...');
    await page.screenshot({
      path: 'homepage-scrolled.png',
      fullPage: false
    });
    console.log('Screenshot saved: homepage-scrolled.png');

    // Step 6: Get header element and its computed styles AFTER scrolling
    console.log('\nInspecting header element AFTER scroll...');
    const headerInfoAfter = await page.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return { found: false };

      const computedStyle = window.getComputedStyle(header);
      const rect = header.getBoundingClientRect();

      return {
        found: true,
        className: header.className,
        position: computedStyle.position,
        top: computedStyle.top,
        zIndex: computedStyle.zIndex,
        position_actual: computedStyle.getPropertyValue('position'),
        boundingRect: {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          height: rect.height,
          width: rect.width
        },
        isVisible: rect.top >= 0 && rect.top < window.innerHeight
      };
    });

    console.log('Header info after scroll:', JSON.stringify(headerInfoAfter, null, 2));

    // Step 7: Analysis
    console.log('\n=== ANALYSIS ===');

    if (!headerInfoBefore.found || !headerInfoAfter.found) {
      console.log('ERROR: Header element not found!');
    } else {
      console.log(`\nHeader Classes: ${headerInfoBefore.className}`);
      console.log(`Position Style: ${headerInfoAfter.position}`);
      console.log(`Top Style: ${headerInfoAfter.top}`);
      console.log(`Z-Index: ${headerInfoAfter.zIndex}`);

      console.log(`\nBefore Scroll - Header position: top=${headerInfoBefore.boundingRect.top}px`);
      console.log(`After Scroll - Header position: top=${headerInfoAfter.boundingRect.top}px`);

      const isSticky = headerInfoAfter.position === 'sticky';
      const isAtTop = Math.abs(headerInfoAfter.boundingRect.top) < 5; // Within 5px of top
      const hasCorrectClasses = headerInfoBefore.className.includes('sticky') &&
                                headerInfoBefore.className.includes('top-0') &&
                                headerInfoBefore.className.includes('z-50');

      console.log(`\n--- Test Results ---`);
      console.log(`Has correct CSS classes (sticky top-0 z-50): ${hasCorrectClasses ? 'YES ✓' : 'NO ✗'}`);
      console.log(`Computed position is 'sticky': ${isSticky ? 'YES ✓' : 'NO ✗'}`);
      console.log(`Header stays at top after scroll: ${isAtTop ? 'YES ✓' : 'NO ✗'}`);
      console.log(`Header is visible: ${headerInfoAfter.isVisible ? 'YES ✓' : 'NO ✗'}`);

      if (hasCorrectClasses && isSticky && isAtTop && headerInfoAfter.isVisible) {
        console.log(`\n🎉 SUCCESS: Sticky header is working correctly!`);
      } else {
        console.log(`\n⚠️  ISSUES FOUND:`);
        if (!hasCorrectClasses) console.log('   - Missing required CSS classes');
        if (!isSticky) console.log('   - Position is not sticky (got: ' + headerInfoAfter.position + ')');
        if (!isAtTop) console.log('   - Header is not at the top (position: ' + headerInfoAfter.boundingRect.top + 'px)');
        if (!headerInfoAfter.isVisible) console.log('   - Header is not visible in viewport');
      }
    }

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    console.log('\nClosing browser...');
    await browser.close();
    console.log('Test complete!');
  }
})();
