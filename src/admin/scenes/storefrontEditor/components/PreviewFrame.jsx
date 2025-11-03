import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';

const PreviewFrame = ({ viewport = 'desktop' }) => {
  const iframeRef = useRef(null);
  const { config } = useEditorStore();

  // Send configuration updates to iframe whenever config changes
  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;

    // Wait for iframe to be fully loaded
    const timer = setTimeout(() => {
      sendConfigToIframe(config);
    }, 500);

    return () => clearTimeout(timer);
  }, [config]);

  const sendConfigToIframe = (config) => {
    if (!iframeRef.current?.contentWindow) return;

    try {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'STOREFRONT_CONFIG_UPDATE',
          payload: config,
          timestamp: Date.now(),
        },
        window.location.origin // Same origin for security
      );

      console.log('📤 Sent config to iframe:', config);
    } catch (error) {
      console.error('Failed to send config to iframe:', error);
    }
  };

  const handleIframeLoad = () => {
    console.log('✅ Preview iframe loaded');
    // Send initial configuration
    sendConfigToIframe(config);
  };

  // Listen for messages from iframe (optional, for future two-way communication)
  useEffect(() => {
    const handleMessage = (event) => {
      // Security: verify origin
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'PREVIEW_READY') {
        console.log('✅ Preview iframe is ready');
        sendConfigToIframe(config);
      }

      if (event.data.type === 'PREVIEW_ERROR') {
        console.error('❌ Preview error:', event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [config]);

  const viewportStyles = viewport === 'mobile'
  ? { maxWidth: '375px', margin: '0 auto' }
  : {};

  return (
    <div className="preview-frame flex-1 bg-gray-100 p-6 overflow-hidden">
      <div
        className="preview-container h-full bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300"
        style={viewportStyles}
      >
        <div className="relative h-full">
          <iframe
            ref={iframeRef}
            src="/?preview=true"
            title="Store Preview"
            onLoad={handleIframeLoad}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Live Preview - Changes apply instantly • {viewport === 'desktop' ? 'Desktop' : 'Mobile (375px)'}
        </span>
      </div>
    </div>
  );

};

export default PreviewFrame;
