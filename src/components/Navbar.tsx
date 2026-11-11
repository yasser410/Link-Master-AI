import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Activity,
  Layers,
  Globe,
  Code2,
  FileSpreadsheet,
  Music,
  Package,
  Archive,
  Cpu,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Sliders,
  Settings,
  Sun,
  Moon,
  Flame,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  activeJobsCount: number;
  serverOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDark,
  onToggleTheme,
  lang,
  onToggleLang,
  activeJobsCount,
  serverOnline,
}) => {
  const primaryNavItems = [
    { id: 'command_center', label: lang === 'ar' ? 'غرفة القيادة' : 'Command Center', icon: Activity },
    { id: 'url_foundry', label: lang === 'ar' ? 'مسبك الروابط' : 'URL Foundry', icon: Globe },
    { id: 'app_foundry', label: lang === 'ar' ? 'ورشة التطبيقات' : 'AI App Foundry', icon: Code2 },
    { id: 'file_lab', label: lang === 'ar' ? 'معمل الملفات' : 'File Lab', icon: FileSpreadsheet },
    { id: 'audio_workshop', label: lang === 'ar' ? 'ورشة الصوتيات' : 'Audio Workshop', icon: Music },
    { id: 'packaging', label: lang === 'ar' ? 'تجميع الحزم' : 'Packaging', icon: Package },
    { id: 'products_vault', label: lang === 'ar' ? 'خزينة المنتجات' : 'Products Vault', icon: Archive },
    { id: 'workers_jobs', label: lang === 'ar' ? 'العمال الـ17' : '17 Workers & Jobs', icon: Cpu },
    { id: 'quality_control', label: lang === 'ar' ? 'فحص الجودة' : 'Quality Control', icon: CheckCircle2 },
    { id: 'security_center', label: lang === 'ar' ? 'مركز الأمان' : 'Security Center', icon: ShieldCheck },
    { id: 'admin_console', label: lang === 'ar' ? 'لوحة المشرف' : 'Admin Console', icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#454943] bg-[#202322] dark:bg-[#202322] px-4 sm:px-8 py-3">
      <div className="max-w-[1480px] mx-auto flex items-center justify-between gap-6">
        {/* Brand Zone: Industrial Monogram & Supervisor Crest */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('command_center')}
            className="flex items-center gap-3 text-right group cursor-pointer focus:outline-none"
          >
            {/* Chamfered Ingot Crest */}
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[#C69B70] via-[#B76E45] to-[#8C4A26] p-0.5 shadow-md foundry-cut-sm flex items-center justify-center">
              <div className="w-full h-full bg-[#292D2B] flex items-center justify-center font-mono font-black text-xs text-[#F1EBDD] tracking-widest">
                DF
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wider text-[#F1EBDD] whitespace-nowrap leading-none font-mono">
                  THE DIGITAL FOUNDRY
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B76E45] animate-pulse" />
              </div>
              <span className="text-[10px] text-[#C69B70] font-mono tracking-wider whitespace-nowrap leading-tight mt-1">
                YASSER UNIVERSAL BUILDER // EL HAG YASSER
              </span>
            </div>
          </button>
        </div>

        {/* Primary Desktop Industrial Navigation */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-[#AAA99F]">
          {primaryNavItems.slice(0, 8).map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-2.5 py-1.5 rounded-sm transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer font-mono text-[11px] ${
                  isActive
                    ? 'bg-[#292D2B] text-[#F1EBDD] border border-[#B76E45] shadow-sm'
                    : 'hover:text-[#F1EBDD] hover:bg-[#292D2B]/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B76E45]' : 'text-[#AAA99F]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* More Dropdown / Secondary Switcher */}
          <div className="flex items-center gap-1 border-r border-[#454943] pr-2 mr-2">
            {[
              { id: 'quality_control', label: lang === 'ar' ? 'الجودة' : 'QC', icon: CheckCircle2 },
              { id: 'security_center', label: lang === 'ar' ? 'الأمان' : 'Security', icon: ShieldCheck },
              { id: 'admin_console', label: lang === 'ar' ? 'المشرف' : 'Admin', icon: Sliders },
            ].map((sub) => {
              const SubIcon = sub.icon;
              const isActive = currentTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectTab(sub.id)}
                  className={`px-2 py-1 rounded-sm text-[11px] font-mono transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#B76E45] text-[#F1EBDD] font-bold'
                      : 'text-[#AAA99F] hover:text-[#F1EBDD] hover:bg-[#292D2B]'
                  }`}
                >
                  <SubIcon className="w-3 h-3" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Zone 3: Hardware Telemetry & Quick Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Server Heartbeat Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-sm bg-[#292D2B] border border-[#454943] text-[10px] font-mono text-[#AAA99F]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${serverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`}
            />
            <span>{serverOnline ? 'ONLINE' : 'DISCONNECTED'}</span>
          </div>

          {/* Live Task Badge */}
          {activeJobsCount > 0 && (
            <button
              onClick={() => onSelectTab('workers_jobs')}
              className="flex items-center gap-1.5 bg-[#B76E45]/20 border border-[#B76E45] text-[#F1EBDD] px-2.5 py-1 rounded-sm text-xs font-mono font-bold animate-pulse cursor-pointer"
              title="مهام جارية في المسبك الرقمي"
            >
              <Flame className="w-3.5 h-3.5 text-[#B76E45]" />
              <span>{activeJobsCount} ACTIVE</span>
            </button>
          )}

          <PWAInstallButton />

          {/* Language Switch */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1 text-xs font-mono font-bold rounded-sm border border-[#454943] bg-[#292D2B] text-[#AAA99F] hover:text-[#F1EBDD] hover:border-[#B76E45] transition cursor-pointer"
            title="Toggle Language (العربية / English)"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-sm border border-[#454943] bg-[#292D2B] text-[#AAA99F] hover:text-[#F1EBDD] hover:border-[#B76E45] transition cursor-pointer"
            title="Toggle Light / Dark Foundry Mode"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#C69B70]" /> : <Moon className="w-4 h-4 text-[#AAA99F]" />}
          </button>
        </div>
      </div>

      {/* Horizontal Sub-Navigation for Tablet / Medium & Mobile Screens */}
      <div className="flex xl:hidden items-center overflow-x-auto gap-2 pt-2.5 border-t border-[#454943]/60 mt-2 text-xs font-mono text-[#AAA99F] scrollbar-none">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-sm flex items-center gap-1.5 transition-colors ${
                isActive
                  ? 'bg-[#B76E45] text-[#F1EBDD] font-bold shadow-sm'
                  : 'hover:text-[#F1EBDD] hover:bg-[#292D2B]'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
