import React, { useEffect, useState } from 'react';

export interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const isPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === 'true';

  // Load saved logo from Storefront Editor config
  useEffect(() => {
    try {
      const raw = localStorage.getItem('STOREFRONT_EDITOR_CONFIG');
      if (raw) {
        const parsed = JSON.parse(raw);
        const canApply = isPreview || parsed?.applyToSite !== false;
        if (canApply && parsed?.logo?.file) {
          setCustomLogo(parsed.logo.file as string);
          setCustomWidth(Number(parsed.logo.width) || null);
        } else {
          setCustomLogo(null);
          setCustomWidth(null);
        }
      }
    } catch {
      // ignore
    }

    // Update in preview mode when editor posts message
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'STOREFRONT_CONFIG_UPDATE') {
        const cfg = event.data.payload;
        const canApply = isPreview || cfg?.applyToSite !== false;
        if (canApply && cfg?.logo?.file) {
          setCustomLogo(cfg.logo.file as string);
          setCustomWidth(Number(cfg.logo.width) || null);
        } else {
          setCustomLogo(null);
          setCustomWidth(null);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const renderDefault = () => (
    <>
      <svg
        className={className}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="4" y="8" width="12" height="16" rx="1.5" fill="currentColor" opacity="0.4" />
        <rect x="8" y="6" width="12" height="16" rx="1.5" fill="currentColor" opacity="0.7" />
        <rect x="12" y="4" width="12" height="16" rx="1.5" fill="currentColor" />
        <circle cx="18" cy="8" r="1.5" fill="white" opacity="0.8" />
      </svg>
      <span className="text-xl font-bold">My TCG Shop</span>
    </>
  );

  const renderCustom = () => (
    <img
      src={customLogo as string}
      alt="Store Logo"
      style={{ width: customWidth ? `${customWidth}px` : undefined, height: 'auto', maxHeight: '60px', objectFit: 'contain' }}
    />
  );

  return (
    <div className="flex items-center gap-2">
      {customLogo ? renderCustom() : renderDefault()}
    </div>
  );
};

export default Logo;
