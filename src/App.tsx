import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CommandCenterView } from './components/CommandCenterView';
import { UrlFoundryView } from './components/UrlFoundryView';
import { AiAppFoundryView } from './components/AiAppFoundryView';
import { UniversalFileLabView } from './components/UniversalFileLabView';
import { AudioWorkshopView } from './components/AudioWorkshopView';
import { BuildPackagingView } from './components/BuildPackagingView';
import { ProductsVaultView } from './components/ProductsVaultView';
import { WorkersJobsView } from './components/WorkersJobsView';
import { QualityControlView } from './components/QualityControlView';
import { SecurityCenterView } from './components/SecurityCenterView';
import { AdminConsoleView } from './components/AdminConsoleView';
import { JobMonitorModal } from './components/JobMonitorModal';
import { AppPreviewModal } from './components/AppPreviewModal';
import { ProductItem, BuildJob, AdminStats } from './types';
import { ShieldCheck, Flame, Radio, Download } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('command_center');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [jobs, setJobs] = useState<BuildJob[]>([]);
  const [activeJob, setActiveJob] = useState<BuildJob | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverOnline, setServerOnline] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'error' | 'success' } | null>(null);

  const showToast = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Preview Modal
  const [previewModal, setPreviewModal] = useState<{ url: string | null; title: string }>({
    url: null,
    title: '',
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Apply language direction & html lang attribute
  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  // Fetch initial data
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setServerOnline(true);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setServerOnline(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
        if (activeJob) {
          const updated = data.jobs.find((j: BuildJob) => j.id === activeJob.id);
          if (updated) setActiveJob(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setAdminStats(data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchJobs();
    fetchAdminStats();

    // Poll jobs periodically
    const timer = setInterval(() => {
      fetchJobs();
    }, 2500);

    return () => clearInterval(timer);
  }, [activeJob?.id]);

  // Actions
  const handleStartJob = async (
    title: string,
    category: BuildJob['category'],
    input: string,
    outputFormat: string,
    targetPlatform: string,
    payload?: any
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          input,
          outputFormat,
          targetPlatform,
          payload,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل إرسال المهمة');
      }

      setActiveJob(data.job);
      fetchJobs();
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'فشل إرسال المهمة', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      await fetch(`/api/jobs/${jobId}/cancel`, { method: 'POST' });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/retry`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.job) {
        setActiveJob(data.job);
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleEngine = async (engineId: string, enabled: boolean) => {
    try {
      const res = await fetch(`/api/admin/engines/${engineId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      if (res.ok) {
        fetchAdminStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeJobsCount = jobs.filter(
    (j) => j.status === 'Queued' || j.status === 'Analyzing' || j.status === 'Building' || j.status === 'Testing'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#202322] text-[#F1EBDD] selection:bg-[#B76E45]/40 selection:text-[#F1EBDD]">
      {/* Top Industrial Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        activeJobsCount={activeJobsCount}
        serverOnline={serverOnline}
      />

      {/* Main Foundry Route View */}
      <main className="flex-1">
        {currentTab === 'command_center' && (
          <CommandCenterView
            onStartJob={handleStartJob}
            onNavigateTab={setCurrentTab}
            products={products}
            adminStats={adminStats}
            isLoading={isLoading}
            lang={lang}
            onOpenPreview={(url, name) => setPreviewModal({ url, title: name })}
          />
        )}

        {currentTab === 'url_foundry' && (
          <UrlFoundryView onStartJob={handleStartJob} isLoading={isLoading} lang={lang} />
        )}

        {currentTab === 'app_foundry' && (
          <AiAppFoundryView
            onStartJob={handleStartJob}
            isLoading={isLoading}
            lang={lang}
            onOpenPreview={(url, name) => setPreviewModal({ url, title: name })}
          />
        )}

        {currentTab === 'file_lab' && (
          <UniversalFileLabView onStartJob={handleStartJob} isLoading={isLoading} lang={lang} />
        )}

        {currentTab === 'audio_workshop' && (
          <AudioWorkshopView onStartJob={handleStartJob} isLoading={isLoading} lang={lang} />
        )}

        {currentTab === 'packaging' && (
          <BuildPackagingView onStartJob={handleStartJob} isLoading={isLoading} lang={lang} />
        )}

        {currentTab === 'products_vault' && (
          <ProductsVaultView
            products={products}
            onOpenPreview={(url, name) => setPreviewModal({ url, title: name })}
            onRefreshProducts={fetchProducts}
            lang={lang}
          />
        )}

        {currentTab === 'workers_jobs' && (
          <WorkersJobsView
            jobs={jobs}
            activeJob={activeJob}
            onSelectJob={setActiveJob}
            onCancelJob={handleCancelJob}
            onRetryJob={handleRetryJob}
            lang={lang}
          />
        )}

        {currentTab === 'quality_control' && <QualityControlView lang={lang} />}

        {currentTab === 'security_center' && <SecurityCenterView lang={lang} />}

        {currentTab === 'admin_console' && (
          <AdminConsoleView
            stats={adminStats}
            onToggleEngine={handleToggleEngine}
            onRefreshStats={fetchAdminStats}
            lang={lang}
          />
        )}
      </main>

      {/* Global Job Monitor Modal */}
      <JobMonitorModal
        job={activeJob}
        onClose={() => setActiveJob(null)}
        onCancel={handleCancelJob}
        onRetry={handleRetryJob}
        onViewProduct={(prodId) => {
          fetchProducts();
          setCurrentTab('products_vault');
        }}
      />

      {/* Global Interactive App Preview Modal */}
      <AppPreviewModal
        url={previewModal.url}
        title={previewModal.title}
        onClose={() => setPreviewModal({ url: null, title: '' })}
      />

      {/* Industrial Brutalist Toast Banner */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 border font-mono text-xs shadow-2xl flex items-center gap-3 transition-all animate-bounce ${
            toast.type === 'error'
              ? 'border-red-500 bg-[#292D2B] text-red-200'
              : toast.type === 'success'
              ? 'border-emerald-500 bg-[#292D2B] text-emerald-200'
              : 'border-[#B76E45] bg-[#292D2B] text-[#F1EBDD]'
          }`}
        >
          <span className="font-bold">{toast.type === 'error' ? '!' : '✓'}</span>
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-[#AAA99F] hover:text-[#F1EBDD] font-bold text-sm cursor-pointer ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Architectural Industrial Footer */}
      <footer className="border-t border-[#454943] bg-[#202322] py-10 px-4 sm:px-8 mt-16 font-mono text-xs">
        <div className="max-w-[1380px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-[#F1EBDD] tracking-wider">THE DIGITAL FOUNDRY</span>
              <span className="text-[#454943]">&bull;</span>
              <span className="text-[#C69B70]">CHIEF ARCHITECT: EL HAG YASSER — الحاج ياسر</span>
              <span className="text-[#454943]">&bull;</span>
              <span className="text-emerald-400">17 DAEMONS ISOLATED</span>
            </div>
            <p className="text-[#AAA99F] text-[11px] leading-relaxed max-w-2xl">
              {lang === 'ar'
                ? 'الشعار: من أي فكرة أو رابط إلى منتج نهائي جاهز للاستخدام الفوري. تنفيذ سحابي حقيقي بدون محاكاة شكلية، فحص أمان SSRF، وتوقيع تشفيري SHA-256 للملفات الفيزيائية.'
                : 'Motto: From Raw Input to Finished Product. 100% authentic cloud workers, SSRF loopback isolation, zero-mock execution, and physical cryptographic delivery.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#AAA99F]">
            <button
              onClick={() => setCurrentTab('url_foundry')}
              className="hover:text-[#F1EBDD] transition cursor-pointer"
            >
              {lang === 'ar' ? 'مسبك الروابط' : 'URL Foundry'}
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setCurrentTab('app_foundry')}
              className="hover:text-[#F1EBDD] transition cursor-pointer"
            >
              {lang === 'ar' ? 'ورشة التطبيقات' : 'App Foundry'}
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setCurrentTab('file_lab')}
              className="hover:text-[#F1EBDD] transition cursor-pointer"
            >
              {lang === 'ar' ? 'معمل الملفات' : 'File Lab'}
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setCurrentTab('audio_workshop')}
              className="hover:text-[#F1EBDD] transition cursor-pointer"
            >
              {lang === 'ar' ? 'الصوتيات' : 'Audio Forge'}
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setCurrentTab('packaging')}
              className="hover:text-[#F1EBDD] transition cursor-pointer"
            >
              {lang === 'ar' ? 'تجميع الحزم' : 'Packaging'}
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setCurrentTab('products_vault')}
              className="hover:text-[#C69B70] text-[#C69B70] transition cursor-pointer"
            >
              {lang === 'ar' ? 'الخزينة المباشرة' : 'Product Vault'}
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setCurrentTab('quality_control')}
              className="hover:text-emerald-400 text-emerald-400 transition cursor-pointer"
            >
              {lang === 'ar' ? 'فحص الجودة' : 'QC Suite'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
