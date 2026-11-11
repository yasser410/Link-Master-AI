import React, { useState } from 'react';
import { AdminStats, EngineSetting, AIProviderConfig } from '../types';
import {
  ShieldAlert,
  Cpu,
  Database,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Power,
  Zap,
  Activity,
  Layers,
  HardDrive,
  Users,
  Flame,
  Radio,
} from 'lucide-react';

interface AdminConsoleViewProps {
  stats: AdminStats | null;
  onToggleEngine: (engineId: string, enabled: boolean) => void;
  onRefreshStats: () => void;
  lang: 'ar' | 'en';
}

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  stats,
  onToggleEngine,
  onRefreshStats,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'engines' | 'ai' | 'storage'>('overview');

  if (!stats) {
    return (
      <div className="max-w-[1380px] mx-auto p-12 text-center text-[#AAA99F] font-mono text-xs">
        {lang === 'ar' ? 'جارٍ تحميل لوحة المشرف...' : 'LOADING SUPERVISOR CONSOLE...'}
      </div>
    );
  }

  const usedKb = (stats.storage.usedBytes / 1024).toFixed(1);
  const quotaGb = (stats.storage.quotaBytes / (1024 * 1024 * 1024)).toFixed(0);

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* Title Header */}
      <div className="border-b border-[#454943] pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#B76E45] text-[#F1EBDD] font-mono text-[10px] font-bold">
              SUPERVISOR PRIVILEGE: EL HAG YASSER (الحاج ياسر)
            </span>
            <span className="text-xs font-mono text-emerald-400">FOUNDRY SYSTEM STATUS: ONLINE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-mono uppercase text-[#F1EBDD]">
            {lang === 'ar' ? 'لوحة تحكم المشرف العام' : 'MASTER SUPERVISOR CONSOLE'}
          </h1>
          <p className="text-xs sm:text-sm text-[#AAA99F] font-mono mt-1">
            {lang === 'ar'
              ? 'مراقبة العمال السحابيين الـ17، تفعيل وإيقاف محركات التحويل، وإدارة سعة التخزين الفيزيائية.'
              : 'Master telemetry for 17 isolated workers, engine toggles, storage footprints, and AI gateways.'}
          </p>
        </div>

        <button
          onClick={onRefreshStats}
          className="px-4 py-2 border border-[#454943] hover:border-[#C69B70] text-[#F1EBDD] font-mono text-xs font-bold uppercase transition cursor-pointer"
        >
          {lang === 'ar' ? 'تحديث الإحصاءات' : 'REFRESH METRICS'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#454943] pb-3 text-xs font-mono">
        {[
          { id: 'overview', label: lang === 'ar' ? 'نظرة شاملة' : 'Overview' },
          { id: 'engines', label: lang === 'ar' ? 'المحركات الـ5' : '5 Engines' },
          { id: 'ai', label: lang === 'ar' ? 'بوابات الذكاء الاصطناعي' : 'AI Providers' },
          { id: 'storage', label: lang === 'ar' ? 'التخزين والتنزيلات' : 'Physical Storage' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 border transition cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#B76E45] bg-[#B76E45] text-[#F1EBDD] font-bold'
                : 'border-[#454943] bg-[#292D2B] text-[#AAA99F] hover:text-[#F1EBDD]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-[#454943] bg-[#292D2B]">
              <span className="text-xs text-[#AAA99F]">ACTIVE WORKERS</span>
              <span className="text-2xl font-black text-[#F1EBDD] block mt-1">17 / 17</span>
              <span className="text-[10px] text-emerald-400">All daemon slots online</span>
            </div>

            <div className="p-4 border border-[#454943] bg-[#292D2B]">
              <span className="text-xs text-[#AAA99F]">TOTAL DELIVERED</span>
              <span className="text-2xl font-black text-[#C69B70] block mt-1">
                {stats.totalProducts}
              </span>
              <span className="text-[10px] text-[#AAA99F]">Physical products compiled</span>
            </div>

            <div className="p-4 border border-[#454943] bg-[#292D2B]">
              <span className="text-xs text-[#AAA99F]">COMPLETED JOBS</span>
              <span className="text-2xl font-black text-emerald-400 block mt-1">
                {stats.completedJobs}
              </span>
              <span className="text-[10px] text-[#AAA99F]">Success rate: 99.8%</span>
            </div>

            <div className="p-4 border border-[#454943] bg-[#292D2B]">
              <span className="text-xs text-[#AAA99F]">DISK FOOTPRINT</span>
              <span className="text-2xl font-black text-[#F1EBDD] block mt-1">{usedKb} KB</span>
              <span className="text-[10px] text-[#AAA99F]">Of {quotaGb} GB quota</span>
            </div>
          </div>

          <div className="p-6 border border-[#454943] bg-[#292D2B] space-y-3">
            <h3 className="text-sm font-bold text-[#F1EBDD] uppercase">FOUNDRY OWNERSHIP & ACCESS CONTROL</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[#AAA99F]">
              <div>
                <strong>Chief Architect:</strong> {stats.supervisor}
              </div>
              <div>
                <strong>Brand:</strong> {stats.brand}
              </div>
              <div>
                <strong>Security:</strong> AES-256 + SSRF Loopback Shield
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 5 Engines */}
      {activeTab === 'engines' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 gap-4">
            {stats.engines.map((eng) => (
              <div
                key={eng.id}
                className="p-5 border border-[#454943] bg-[#292D2B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#B76E45]">{eng.code}</span>
                    <span className="font-bold text-[#F1EBDD] text-sm">{eng.name}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold ${
                        eng.enabled
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {eng.enabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#AAA99F]">{eng.description}</p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right text-[11px] text-[#AAA99F]">
                    <div>Active Workers: {eng.activeWorkers}</div>
                    <div>Success Rate: {eng.successRate}%</div>
                  </div>

                  <button
                    onClick={() => onToggleEngine(eng.id, !eng.enabled)}
                    className={`px-4 py-2 border font-bold text-xs uppercase transition cursor-pointer ${
                      eng.enabled
                        ? 'border-red-500/40 text-red-400 hover:bg-red-500/10'
                        : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                  >
                    {eng.enabled ? 'DISABLE' : 'ENABLE'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: AI Providers */}
      {activeTab === 'ai' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.aiProviders.map((provider) => (
              <div key={provider.id} className="p-5 border border-[#454943] bg-[#292D2B] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#F1EBDD]">{provider.name}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold ${
                      provider.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-[#454943] text-[#AAA99F]'
                    }`}
                  >
                    {provider.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1 text-[#AAA99F] text-[11px]">
                  <div>
                    <strong>Model:</strong> {provider.model}
                  </div>
                  <div>
                    <strong>Latency:</strong> ~{provider.latencyMs}ms
                  </div>
                  <div>
                    <strong>Pricing Tier:</strong> {provider.pricingInfo}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Physical Storage */}
      {activeTab === 'storage' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="p-6 border border-[#454943] bg-[#292D2B] space-y-4">
            <h3 className="text-sm font-bold text-[#F1EBDD]">PHYSICAL FILE STORAGE TELEMETRY</h3>
            <div className="space-y-2 text-[#AAA99F]">
              <div>
                <strong>Storage Directory:</strong> <code>/storage/files/</code>
              </div>
              <div>
                <strong>Database Ledger:</strong> <code>/storage/db.json</code>
              </div>
              <div>
                <strong>Total Delivered Downloads:</strong> {stats.storage.totalDownloads}
              </div>
              <div>
                <strong>Used Footprint:</strong> {usedKb} KB
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
