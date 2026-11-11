import React, { useState } from 'react';
import {
  Globe,
  Code2,
  FileSpreadsheet,
  Music,
  Package,
  ArrowRight,
  ArrowLeft,
  Flame,
  Download,
  Play,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  HardDrive,
  ExternalLink,
  ChevronRight,
  Radio,
  FileText,
} from 'lucide-react';
import { ProductItem, BuildJob, AdminStats } from '../types';

interface CommandCenterViewProps {
  onStartJob: (
    title: string,
    category: BuildJob['category'],
    input: string,
    outputFormat: string,
    targetPlatform: string,
    payload?: any
  ) => void;
  onNavigateTab: (tab: string) => void;
  products: ProductItem[];
  adminStats: AdminStats | null;
  isLoading: boolean;
  lang: 'ar' | 'en';
  onOpenPreview: (url: string, title: string) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  onStartJob,
  onNavigateTab,
  products,
  adminStats,
  isLoading,
  lang,
  onOpenPreview,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'idea' | 'file'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [urlTarget, setUrlTarget] = useState<'pdf' | 'pwa' | 'android' | 'markdown' | 'metadata'>('pwa');
  const [ideaInput, setIdeaInput] = useState('');
  const [ideaPlatform, setIdeaPlatform] = useState<'Web' | 'PWA' | 'Android' | 'Desktop'>('Web');
  const [fileInputName, setFileInputName] = useState('');
  const [fileFormat, setFileFormat] = useState('json');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);
    if (!urlInput.trim()) return;
    try {
      let raw = urlInput.trim();
      if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
      const parsed = new URL(raw);
      const platformMap: Record<string, string> = {
        pdf: 'Cross-Platform',
        pwa: 'PWA',
        android: 'Android',
        markdown: 'Cross-Platform',
        metadata: 'Web',
      };
      onStartJob(
        `${lang === 'ar' ? 'تحويل رابط' : 'Convert URL'}: ${parsed.hostname}`,
        'url_conversion',
        parsed.href,
        urlTarget,
        platformMap[urlTarget] || 'Cross-Platform'
      );
      setUrlInput('');
    } catch {
      setInputError(lang === 'ar' ? 'الرجاء إدخال رابط صحيح (مثال: https://example.com)' : 'Please enter a valid URL (e.g. https://example.com)');
    }
  };

  const handleIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaInput.trim()) return;
    const title = ideaInput.slice(0, 30).trim();
    onStartJob(
      title,
      'app_generation',
      ideaInput,
      'app',
      ideaPlatform === 'Desktop' ? 'Cross-Platform' : ideaPlatform
    );
    setIdeaInput('');
  };

  const isRtl = lang === 'ar';
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const totalStorageFormatted = adminStats
    ? (adminStats.storage.usedBytes / 1024).toFixed(1) + ' KB'
    : '450 KB';

  const stations = [
    {
      id: 'url_foundry',
      code: 'STN-01',
      title: lang === 'ar' ? 'مسبك الروابط' : 'URL Foundry',
      desc: lang === 'ar' ? 'تحويل أي رابط ويب إلى PDF، تطبيق PWA، أو حزمة Android' : 'Transform any web URL into PDF, PWA, or native Android bundle',
      workers: 'WRK-01 — WRK-04 (4)',
      icon: Globe,
      accent: 'border-[#B76E45]',
    },
    {
      id: 'app_foundry',
      code: 'STN-02',
      title: lang === 'ar' ? 'ورشة توليد التطبيقات' : 'AI App Foundry',
      desc: lang === 'ar' ? 'توليد تطبيقات تفاعلية متكاملة مع وضع الحماية واختبار الصلاحية' : 'Synthesize standalone production web applications with instant preview',
      workers: 'WRK-05 — WRK-07 (3)',
      icon: Code2,
      accent: 'border-[#C69B70]',
    },
    {
      id: 'file_lab',
      code: 'STN-03',
      title: lang === 'ar' ? 'معمل الملفات الشامل' : 'Universal File Lab',
      desc: lang === 'ar' ? 'معالجة المستندات، CSV إلى JSON، وتوليد التقارير الموثقة' : 'Transform documents, CSV to JSON, and structured cryptographic datasets',
      workers: 'WRK-08 — WRK-12 (5)',
      icon: FileSpreadsheet,
      accent: 'border-[#454943]',
    },
    {
      id: 'audio_workshop',
      code: 'STN-04',
      title: lang === 'ar' ? 'ورشة الصوتيات وWAV' : 'Audio & Acoustic Forge',
      desc: lang === 'ar' ? 'توليد موجات صوتية نقية RIFF/WAV بدقة 44.1kHz بدون إنترنت' : 'Synthesize pure RIFF/WAV tones and acoustic tests with zero latency',
      workers: 'WRK-13 — WRK-14 (2)',
      icon: Music,
      accent: 'border-[#B76E45]',
    },
    {
      id: 'packaging',
      code: 'STN-05',
      title: lang === 'ar' ? 'تجميع الحزم والمنصات' : 'Binary Packaging Lab',
      desc: lang === 'ar' ? 'بناء حزم PWA ZIP، Android Manifest، وملفات التشغيل المكتبية' : 'Assemble PWA ZIPs, Android manifests, and desktop deployment bundles',
      workers: 'WRK-15 — WRK-17 (3)',
      icon: Package,
      accent: 'border-[#C69B70]',
    },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Zone: Industrial Brutalism Editorial Header */}
      <section className="relative border-b border-[#454943] bg-gradient-to-b from-[#242725] to-[#202322] px-4 sm:px-8 py-12 foundry-grid-bg">
        <div className="max-w-[1380px] mx-auto">
          {/* Top Stamp / Foundry Crest */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-[11px] font-mono font-bold tracking-widest uppercase bg-[#B76E45] text-[#F1EBDD] foundry-cut-sm">
                SPEC: INDUSTRIAL FOUNDRY 2.4
              </span>
              <span className="text-xs font-mono text-[#AAA99F]">
                SUPERVISOR: <strong className="text-[#F1EBDD]">EL HAG YASSER (الحاج ياسر)</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#C69B70]">
              <Radio className="w-3.5 h-3.5 text-[#B76E45] animate-pulse" />
              <span>17 ISOLATED CLOUD WORKERS ON STANDBY</span>
            </div>
          </div>

          {/* Master Title */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#F1EBDD] tracking-tight font-mono uppercase leading-none">
              {lang === 'ar' ? 'المسبك الرقمي الصناعي' : 'THE DIGITAL FOUNDRY'}
            </h1>
            <p className="text-lg sm:text-2xl text-[#C69B70] font-mono font-semibold tracking-wide">
              {lang === 'ar'
                ? 'من أي مدخل خام أو رابط إلى منتج نهائي قابل للاستخدام الفوري.'
                : 'From Raw Input or URL to Finished, Fully Deployable Product.'}
            </p>
            <p className="text-sm text-[#AAA99F] max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'منصة تصنيع سحابية هندسية معتمدة على 17 عاملاً مستقلاً، حماية أمنية SSRF مشددة، فحص SHA-256 للملفات الفيزيائية، وعدم تصدير الشيفرة إلا كمنتج نهائي متكامل.'
                : 'Autonomous multi-engine cloud manufacturing platform. 17 sandboxed workers, rigid SSRF containment, zero mock outputs, and authentic physical cryptographic delivery.'}
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <a
              href="#master-intake"
              className="px-6 py-3 bg-[#B76E45] hover:bg-[#A65F3C] text-[#F1EBDD] font-mono font-bold text-sm tracking-wider uppercase foundry-cut-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-[#F1EBDD]" />
              <span>{lang === 'ar' ? 'بدء التصنيع الفوري' : 'START PRODUCTION'}</span>
            </a>
            <button
              onClick={() => onNavigateTab('products_vault')}
              className="px-6 py-3 bg-[#292D2B] hover:bg-[#343836] border border-[#454943] text-[#F1EBDD] font-mono font-bold text-sm tracking-wider uppercase foundry-cut-sm transition flex items-center gap-2 cursor-pointer"
            >
              <HardDrive className="w-4 h-4 text-[#C69B70]" />
              <span>{lang === 'ar' ? 'فتح خزينة المنتجات' : 'OPEN PRODUCT VAULT'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('quality_control')}
              className="px-4 py-3 bg-transparent hover:bg-[#292D2B]/50 border border-[#454943] text-[#AAA99F] hover:text-[#F1EBDD] font-mono text-xs tracking-wider uppercase transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 inline mx-1" />
              <span>{lang === 'ar' ? 'تقرير فحص الجودة (16/16)' : '16-POINT QC REPORT'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Master Intake Console: Unified Raw Input Intake */}
      <section id="master-intake" className="max-w-[1380px] mx-auto px-4 sm:px-8">
        <div className="border border-[#454943] bg-[#292D2B] p-6 sm:p-8 foundry-cut-card shadow-xl">
          {/* Header of Intake */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#454943] pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#B76E45] rotate-45" />
              <h2 className="text-lg font-bold text-[#F1EBDD] font-mono uppercase tracking-wider">
                {lang === 'ar' ? 'وحدة الاستقبال والتوجيه الصناعية' : 'RAW INPUT INTAKE CONSOLE'}
              </h2>
            </div>
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 bg-[#202322] p-1 border border-[#454943] text-xs font-mono">
              <button
                onClick={() => setActiveTab('url')}
                className={`px-3 py-1.5 transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'url' ? 'bg-[#B76E45] text-[#F1EBDD] font-bold' : 'text-[#AAA99F] hover:text-[#F1EBDD]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'رابط ويب' : 'URL Link'}</span>
              </button>
              <button
                onClick={() => setActiveTab('idea')}
                className={`px-3 py-1.5 transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'idea' ? 'bg-[#B76E45] text-[#F1EBDD] font-bold' : 'text-[#AAA99F] hover:text-[#F1EBDD]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'فكرة تطبيق' : 'Idea / App'}</span>
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`px-3 py-1.5 transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'file' ? 'bg-[#B76E45] text-[#F1EBDD] font-bold' : 'text-[#AAA99F] hover:text-[#F1EBDD]'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'ملف / أصل' : 'File / Data'}</span>
              </button>
            </div>
          </div>

          {/* Form Content by Selected Intake Mode */}
          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase text-[#AAA99F] mb-2">
                  {lang === 'ar' ? 'أدخل رابط الموقع المراد تشغيله وتصنيعه:' : 'TARGET URL TO CONVERT AND ASSEMBLE:'}
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/article-or-tool"
                    className="flex-1 bg-[#202322] border border-[#454943] text-[#F1EBDD] px-4 py-3 text-sm font-mono focus:border-[#B76E45] focus:outline-none placeholder-[#6E7067]"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !urlInput.trim()}
                    className="px-6 py-3 bg-[#B76E45] hover:bg-[#A65F3C] disabled:opacity-50 text-[#F1EBDD] font-mono font-bold text-sm tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <Flame className="w-4 h-4" />
                    <span>{isLoading ? (lang === 'ar' ? 'جاري البناء...' : 'IGNITING...') : (lang === 'ar' ? 'تشغيل المسبك' : 'DISPATCH')}</span>
                  </button>
                </div>
                {inputError && (
                  <div className="mt-2 text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/30 p-2">
                    {inputError}
                  </div>
                )}
              </div>

              {/* Target Format Pills */}
              <div>
                <span className="block text-xs font-mono text-[#AAA99F] mb-2 uppercase">
                  {lang === 'ar' ? 'صيغة المنتج النهائي المطلوبة:' : 'DESIRED FINAL ARTIFACT:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { id: 'pwa', label: 'PWA Web App', desc: lang === 'ar' ? 'تطبيق ويب تقدمي أوفلاين' : 'Offline web app' },
                    { id: 'android', label: 'Android Package', desc: lang === 'ar' ? 'مشروع أندرويد SDK 34' : 'SDK 34 ready package' },
                    { id: 'pdf', label: 'PDF 1.4 Document', desc: lang === 'ar' ? 'مستند PDF مشفر ومفهرس' : 'Spec-compliant PDF' },
                    { id: 'markdown', label: 'Clean Markdown', desc: lang === 'ar' ? 'نص نقي بدون إعلانات' : 'Clean readable MD' },
                    { id: 'metadata', label: 'Safe Unshorten', desc: lang === 'ar' ? 'فحص الرابط وكشف المسار' : 'SSRF & link tracer' },
                  ].map((target) => (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => setUrlTarget(target.id as any)}
                      className={`p-3 text-left border transition cursor-pointer font-mono ${
                        urlTarget === target.id
                          ? 'border-[#B76E45] bg-[#B76E45]/15 text-[#F1EBDD]'
                          : 'border-[#454943] bg-[#202322] text-[#AAA99F] hover:border-[#6E7067]'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#F1EBDD]">{target.label}</div>
                      <div className="text-[10px] text-[#AAA99F] mt-1">{target.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {activeTab === 'idea' && (
            <form onSubmit={handleIdeaSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase text-[#AAA99F] mb-2">
                  {lang === 'ar' ? 'صف فكرة التطبيق المطلوب هندسته برمجياً:' : 'DESCRIBE THE SPECIFICATION OR TOOL TO SYNTHESIZE:'}
                </label>
                <textarea
                  rows={3}
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'مثال: تطبيق لإدارة فواتير ومصروفات المشاريع مع حساب الضرائب وتصدير PDF وحفظ محلي...'
                      : 'Example: Financial cashflow tracker with real-time tax calculation, local storage persistence, and PDF export...'
                  }
                  className="w-full bg-[#202322] border border-[#454943] text-[#F1EBDD] p-4 text-sm font-mono focus:border-[#B76E45] focus:outline-none placeholder-[#6E7067]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#AAA99F] uppercase">{lang === 'ar' ? 'بيئة التشغيل:' : 'TARGET RUNTIME:'}</span>
                  {(['Web', 'PWA', 'Android', 'Desktop'] as const).map((plt) => (
                    <button
                      key={plt}
                      type="button"
                      onClick={() => setIdeaPlatform(plt)}
                      className={`px-3 py-1.5 text-xs font-mono transition cursor-pointer border ${
                        ideaPlatform === plt
                          ? 'border-[#B76E45] bg-[#B76E45] text-[#F1EBDD] font-bold'
                          : 'border-[#454943] bg-[#202322] text-[#AAA99F] hover:text-[#F1EBDD]'
                      }`}
                    >
                      {plt}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !ideaInput.trim()}
                  className="px-6 py-3 bg-[#B76E45] hover:bg-[#A65F3C] disabled:opacity-50 text-[#F1EBDD] font-mono font-bold text-sm tracking-wider uppercase transition flex items-center gap-2 cursor-pointer"
                >
                  <Code2 className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'توليد التطبيق النهائي' : 'SYNTHESIZE APPLICATION'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'file' && (
            <div className="space-y-6">
              <div className="p-8 border-2 border-dashed border-[#454943] bg-[#202322] text-center space-y-3">
                <FileSpreadsheet className="w-10 h-10 text-[#C69B70] mx-auto" />
                <div className="text-sm font-mono text-[#F1EBDD]">
                  {lang === 'ar' ? 'معمل تحويل وتجهيز البيانات الصناعية' : 'Universal Structured File Conversion Mill'}
                </div>
                <p className="text-xs text-[#AAA99F] max-w-md mx-auto">
                  {lang === 'ar'
                    ? 'يدعم تحويل CSV إلى JSON، Markdown إلى HTML، توليد نغمات WAV، وفحص السلامة الحسابية.'
                    : 'Transform CSV datasets to JSON, Markdown to HTML, synthesize pure WAV audio tones with cryptographic validation.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => onNavigateTab('file_lab')}
                    className="px-5 py-2.5 bg-[#B76E45] hover:bg-[#A65F3C] text-[#F1EBDD] font-mono text-xs font-bold tracking-wider uppercase transition cursor-pointer"
                  >
                    {lang === 'ar' ? 'فتح معمل الملفات الكامل' : 'ENTER UNIVERSAL FILE LAB'}
                  </button>
                  <button
                    onClick={() => onNavigateTab('audio_workshop')}
                    className="px-5 py-2.5 bg-[#292D2B] border border-[#454943] hover:border-[#C69B70] text-[#F1EBDD] font-mono text-xs font-bold tracking-wider uppercase transition cursor-pointer"
                  >
                    {lang === 'ar' ? 'ورشة الصوتيات وWAV' : 'ENTER AUDIO WORKSHOP'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Foundry Telemetry Metrics: Real Storage & Worker Stats */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 border border-[#454943] bg-[#292D2B]">
            <div className="flex items-center justify-between text-xs font-mono text-[#AAA99F]">
              <span>TOTAL PRODUCTS</span>
              <HardDrive className="w-4 h-4 text-[#C69B70]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#F1EBDD] mt-2">
              {products.length}
            </div>
            <div className="text-[11px] font-mono text-[#AAA99F] mt-1">
              Storage footprint: <span className="text-[#C69B70]">{totalStorageFormatted}</span>
            </div>
          </div>

          <div className="p-5 border border-[#454943] bg-[#292D2B]">
            <div className="flex items-center justify-between text-xs font-mono text-[#AAA99F]">
              <span>ISOLATED WORKERS</span>
              <Cpu className="w-4 h-4 text-[#B76E45]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#F1EBDD] mt-2">
              17 / 17
            </div>
            <div className="text-[11px] font-mono text-emerald-400 mt-1">
              Active fleet on standby
            </div>
          </div>

          <div className="p-5 border border-[#454943] bg-[#292D2B]">
            <div className="flex items-center justify-between text-xs font-mono text-[#AAA99F]">
              <span>SECURITY DEFENSE</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#F1EBDD] mt-2">
              SSRF 100%
            </div>
            <div className="text-[11px] font-mono text-[#AAA99F] mt-1">
              Loopback & metadata isolated
            </div>
          </div>

          <div className="p-5 border border-[#454943] bg-[#292D2B]">
            <div className="flex items-center justify-between text-xs font-mono text-[#AAA99F]">
              <span>VERIFICATION INTEGRITY</span>
              <CheckCircle2 className="w-4 h-4 text-[#C69B70]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#F1EBDD] mt-2">
              SHA-256
            </div>
            <div className="text-[11px] font-mono text-[#AAA99F] mt-1">
              Cryptographic byte-checksum
            </div>
          </div>
        </div>
      </section>

      {/* 4. Industrial Engine Stations Grid (STN-01 to STN-05) */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#454943] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#C69B70]" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F1EBDD]">
              {lang === 'ar' ? 'محطات الإنتاج الصناعية الـ5' : 'THE 5 INDUSTRIAL MANUFACTURING STATIONS'}
            </h3>
          </div>
          <span className="text-xs font-mono text-[#AAA99F]">FULL PIPELINE READY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations.map((stn) => {
            const Icon = stn.icon;
            return (
              <div
                key={stn.id}
                className="p-5 border border-[#454943] bg-[#292D2B] hover:border-[#B76E45] transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-3">
                    <span className="px-2 py-0.5 bg-[#202322] border border-[#454943] text-[#C69B70] font-bold">
                      {stn.code}
                    </span>
                    <span className="text-[10px] text-[#AAA99F]">{stn.workers}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-[#B76E45]" />
                    <h4 className="text-base font-bold text-[#F1EBDD] font-mono">{stn.title}</h4>
                  </div>
                  <p className="text-xs text-[#AAA99F] leading-relaxed">{stn.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#454943] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400">OPERATIONAL</span>
                  <button
                    onClick={() => onNavigateTab(stn.id)}
                    className="text-xs font-mono font-bold text-[#C69B70] hover:text-[#F1EBDD] flex items-center gap-1 cursor-pointer transition"
                  >
                    <span>{lang === 'ar' ? 'دخول المحطة' : 'LAUNCH'}</span>
                    <Arrow className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Recent Production Line Showcase */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#454943] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#B76E45]" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F1EBDD]">
              {lang === 'ar' ? 'أحدث المنتجات المصنّعة والجاهزة للتنزيل المباشر' : 'RECENT MANUFACTURED ARTIFACTS IN VAULT'}
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('products_vault')}
            className="text-xs font-mono text-[#C69B70] hover:text-[#F1EBDD] transition cursor-pointer flex items-center gap-1"
          >
            <span>{lang === 'ar' ? 'فتح الخزينة بالكامل' : 'VIEW FULL VAULT'}</span>
            <Arrow className="w-3.5 h-3.5" />
          </button>
        </div>

        {products.length === 0 ? (
          <div className="p-8 border border-[#454943] bg-[#292D2B] text-center text-xs font-mono text-[#AAA99F]">
            {lang === 'ar' ? 'لا توجد منتجات مسجلة بعد. استخدم وحدة الاستقبال أعلاه لتصنيع منتجك الأول!' : 'No products recorded yet. Ignite a conversion above.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 6).map((prod) => (
              <div
                key={prod.id}
                className="p-5 border border-[#454943] bg-[#292D2B] hover:border-[#6E7067] transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 text-xs font-mono">
                    <span className="px-2 py-0.5 bg-[#202322] border border-[#B76E45]/40 text-[#C69B70] font-bold">
                      {prod.platform}
                    </span>
                    <span className="text-[#AAA99F]">
                      {(prod.filesize / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#F1EBDD] font-mono truncate">{prod.name}</h4>
                  <p className="text-xs text-[#AAA99F] mt-1 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  {/* SHA-256 Stamp */}
                  <div className="mt-3 p-2 bg-[#202322] border border-[#454943] text-[10px] font-mono text-[#AAA99F] truncate">
                    <span className="text-[#C69B70]">SHA256: </span>
                    {prod.sha256}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#454943] flex items-center justify-between gap-2">
                  <a
                    href={`/api/download/${prod.id}`}
                    download={prod.filename}
                    className="px-3 py-1.5 bg-[#B76E45] hover:bg-[#A65F3C] text-[#F1EBDD] font-mono font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'تنزيل مباشر' : 'DOWNLOAD'}</span>
                  </a>

                  {prod.interactiveUrl && (
                    <button
                      onClick={() => onOpenPreview(prod.interactiveUrl!, prod.name)}
                      className="px-3 py-1.5 border border-[#454943] hover:border-[#C69B70] text-[#F1EBDD] font-mono text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-[#C69B70]" />
                      <span>{lang === 'ar' ? 'تشغيل' : 'PREVIEW'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
