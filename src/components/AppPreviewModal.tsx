import React, { useState } from 'react';
import { X, Monitor, Tablet, Smartphone, ExternalLink, Maximize2 } from 'lucide-react';

interface AppPreviewModalProps {
  url: string | null;
  title: string;
  onClose: () => void;
}

export const AppPreviewModal: React.FC<AppPreviewModalProps> = ({ url, title, onClose }) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-6 font-mono text-xs">
      <div className="bg-[#292D2B] border border-[#454943] w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Control Bar */}
        <div className="bg-[#202322] px-4 sm:px-6 py-3 border-b border-[#454943] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-bold text-[#F1EBDD] truncate max-w-xs">{title}</h3>
            <span className="text-[10px] text-[#C69B70] hidden sm:inline">SANDBOX RUNTIME CONTAINER</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-[#292D2B] p-1 border border-[#454943]">
              <button
                onClick={() => setDevice('desktop')}
                className={`p-1.5 transition cursor-pointer ${
                  device === 'desktop' ? 'bg-[#B76E45] text-[#F1EBDD] font-bold' : 'text-[#AAA99F] hover:text-[#F1EBDD]'
                }`}
                title="Desktop Viewport"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`p-1.5 transition cursor-pointer ${
                  device === 'tablet' ? 'bg-[#B76E45] text-[#F1EBDD] font-bold' : 'text-[#AAA99F] hover:text-[#F1EBDD]'
                }`}
                title="Tablet Viewport"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-1.5 transition cursor-pointer ${
                  device === 'mobile' ? 'bg-[#B76E45] text-[#F1EBDD] font-bold' : 'text-[#AAA99F] hover:text-[#F1EBDD]'
                }`}
                title="Mobile Viewport"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-[#AAA99F] hover:text-[#F1EBDD] transition cursor-pointer"
              title="Open Standalone Window"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-[#AAA99F] hover:text-[#F1EBDD] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sandbox Viewport Area */}
        <div className="flex-1 bg-[#202322] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          <div
            className={`transition-all duration-300 h-full border border-[#454943] bg-white shadow-2xl overflow-hidden ${
              device === 'desktop'
                ? 'w-full'
                : device === 'tablet'
                ? 'w-[768px] max-w-full rounded-lg border-4 border-[#454943]'
                : 'w-[375px] max-w-full rounded-2xl border-8 border-[#454943]'
            }`}
          >
            <iframe
              src={url}
              title={title}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-forms allow-same-origin allow-downloads"
            />
          </div>
        </div>

        {/* Footer telemetry */}
        <div className="bg-[#202322] border-t border-[#454943] px-4 py-2 flex items-center justify-between text-[10px] text-[#AAA99F]">
          <div className="flex items-center gap-2">
            <span>SANDBOX: ISOLATED DOM</span>
            <span>&bull;</span>
            <span>PERSISTENCE: LOCAL STORAGE ENABLED</span>
          </div>
          <div>MODE: ZERO EXTERNAL SCRIPT DEPENDENCY</div>
        </div>
      </div>
    </div>
  );
};
