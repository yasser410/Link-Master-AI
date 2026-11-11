import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  Smartphone,
  Monitor,
  Tablet,
  Play,
  RotateCcw,
  Download,
  Flame,
  CheckCircle2,
  Layers,
  Cpu,
  Sliders,
  Terminal,
  FileCode,
} from 'lucide-react';
import { BuildJob } from '../types';

interface AiAppFoundryViewProps {
  onStartJob: (
    title: string,
    category: BuildJob['category'],
    input: string,
    outputFormat: string,
    targetPlatform: string,
    payload?: any
  ) => void;
  isLoading: boolean;
  lang: 'ar' | 'en';
  onOpenPreview: (url: string, title: string) => void;
}

export const AiAppFoundryView: React.FC<AiAppFoundryViewProps> = ({
  onStartJob,
  isLoading,
  lang,
  onOpenPreview,
}) => {
  const [idea, setIdea] = useState('');
  const [appName, setAppName] = useState('');
  const [platform, setPlatform] = useState<'Web' | 'PWA' | 'Android' | 'Desktop'>('Web');
  const [styleTheme, setStyleTheme] = useState<'industrial' | 'clean' | 'cyber'>('industrial');
  const [features, setFeatures] = useState({
    localStoragePersistence: true,
    responsiveLayout: true,
    dataExportJsonCsv: true,
    offlineCapable: true,
  });

  // Architectural preset blueprints
  const presets = [
    {
      title: lang === 'ar' ? 'لوحة تحكم مالية وفواتير' : 'Financial Ledger & Invoicing',
      prompt: lang === 'ar'
        ? 'تطبيق متكامل لإدارة التدفق المالي وحساب الضرائب مع جداول ورسوم بيانية وتصدير PDF وحفظ محلي'
        : 'Enterprise cashflow ledger with tax computation, dynamic charts, CSV/PDF export, and local storage state.',
      platform: 'Web',
    },
    {
      title: lang === 'ar' ? 'مدير مهام ومصفوفة أولويات' : 'Eisenhower Priority Matrix',
      prompt: lang === 'ar'
        ? 'منظومة إدارة مهام تفاعلية بتقسيم عاجل/مهم مع سحب وإفلات وتنبيهات صوتية ومزامنة محلية'
        : 'High-productivity quadrant task manager with drag-and-drop, audible timers, and exportable backup.',
      platform: 'PWA',
    },
    {
      title: lang === 'ar' ? 'محرر مستندات وملاحظات مشفر' : 'Encrypted Markdown Notebook',
      prompt: lang === 'ar'
        ? 'دفتر ملاحظات ومستندات Markdown احترافي مع معاينة حية وعدّاد كلمات وتصدير فوري'
        : 'Full-featured Markdown studio with live preview, word statistics, code highlighting, and instant export.',
      platform: 'Web',
    },
    {
      title: lang === 'ar' ? 'محلل شبكات وفاحص أمان' : 'Network Port & Latency Gauge',
      prompt: lang === 'ar'
        ? 'أداة اختبار سرعة وفحص زمن الاستجابة مع رسوم بيانية وتتبع سجل الأداء'
        : 'Network ping and telemetry benchmark tool with statistical graphs and latency timeline.',
      platform: 'Android',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    const title = appName.trim() || idea.slice(0, 30).trim();
    onStartJob(
      title,
      'app_generation',
      idea,
      'app',
      platform === 'Desktop' ? 'Cross-Platform' : platform,
      {
        theme: styleTheme,
        features,
      }
    );
  };

  const handleApplyPreset = (p: typeof presets[0]) => {
    setAppName(p.title);
    setIdea(p.prompt);
    setPlatform(p.platform as any);
  };

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* Title Header */}
      <div className="border-b border-[#454943] pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#C69B70] text-[#202322] font-mono text-[10px] font-bold">
              STN-02 // SYNTHESIS WORKERS: WRK-05 TO WRK-07
            </span>
            <span className="text-xs font-mono text-emerald-400">ENGINE: MULTI-AI SYNTHESIZER</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-mono uppercase text-[#F1EBDD]">
            {lang === 'ar' ? 'ورشة توليد التطبيقات الصناعية' : 'AI APPLICATION FOUNDRY'}
          </h1>
          <p className="text-xs sm:text-sm text-[#AAA99F] font-mono mt-1">
            {lang === 'ar'
              ? 'تحويل الأفكار والمتطلبات الهندسية إلى تطبيقات ويب وهواتف متكاملة، مستقلة تماماً وقابلة للاستخدام الفوري بدون أي أطر عمل خارجية.'
              : 'Synthesize self-contained zero-dependency enterprise applications with live browser sandbox execution.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#292D2B] border border-[#454943] font-mono text-xs text-right">
            <span className="text-[#AAA99F] block text-[10px]">VERIFICATION</span>
            <span className="text-[#C69B70] font-bold">LIVE DOM & SANDBOX</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Blueprint Form & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="p-6 border border-[#454943] bg-[#292D2B] space-y-6">
            <h3 className="text-base font-bold font-mono text-[#F1EBDD] border-b border-[#454943] pb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#B76E45]" />
              <span>{lang === 'ar' ? 'مواصفات التطبيق والهندسة المعمارية' : 'APPLICATION ARCHITECTURAL SPECIFICATION'}</span>
            </h3>

            <div>
              <label className="block text-xs font-mono uppercase text-[#AAA99F] mb-2">
                {lang === 'ar' ? 'اسم التطبيق أو الهوية:' : 'PRODUCT / APPLICATION NAME:'}
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: نظام إدارة المخازن الاحترافي' : 'e.g. Master Store Inventory Manager'}
                className="w-full bg-[#202322] border border-[#454943] text-[#F1EBDD] px-4 py-2.5 text-sm font-mono focus:border-[#B76E45] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#AAA99F] mb-2">
                {lang === 'ar' ? 'المواصفات الفنية والوظائف المطلوبة:' : 'FUNCTIONAL REQUIREMENTS & SPECIFICATION:'}
              </label>
              <textarea
                rows={5}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={
                  lang === 'ar'
                    ? 'اكتب تفاصيل التطبيق بدقة: واجهات المستخدم، الحسابات الرياضية، الحفظ المحلي، الأزرار والتفاعلات...'
                    : 'Detail the application: user interface flows, mathematical formulas, state persistence, buttons and interactions...'
                }
                className="w-full bg-[#202322] border border-[#454943] text-[#F1EBDD] p-4 text-sm font-mono focus:border-[#B76E45] focus:outline-none"
                required
              />
            </div>

            {/* Platform & Theme Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#AAA99F] mb-2">
                  {lang === 'ar' ? 'المنصة المستهدفة:' : 'TARGET RUNTIME PLATFORM:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Web', 'PWA', 'Android', 'Desktop'] as const).map((plt) => (
                    <button
                      key={plt}
                      type="button"
                      onClick={() => setPlatform(plt)}
                      className={`p-2.5 border text-center font-mono text-xs transition cursor-pointer ${
                        platform === plt
                          ? 'border-[#B76E45] bg-[#B76E45] text-[#F1EBDD] font-bold'
                          : 'border-[#454943] bg-[#202322] text-[#AAA99F] hover:text-[#F1EBDD]'
                      }`}
                    >
                      {plt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#AAA99F] mb-2">
                  {lang === 'ar' ? 'الهوية البصرية للواجهة:' : 'VISUAL DESIGN LANGUAGE:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'industrial', label: lang === 'ar' ? 'صناعي' : 'Foundry' },
                    { id: 'clean', label: lang === 'ar' ? 'نظيف' : 'Modern' },
                    { id: 'cyber', label: lang === 'ar' ? 'تقني' : 'Cyber' },
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => setStyleTheme(thm.id as any)}
                      className={`p-2.5 border text-center font-mono text-xs transition cursor-pointer ${
                        styleTheme === thm.id
                          ? 'border-[#C69B70] bg-[#C69B70] text-[#202322] font-bold'
                          : 'border-[#454943] bg-[#202322] text-[#AAA99F] hover:text-[#F1EBDD]'
                      }`}
                    >
                      {thm.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="p-4 bg-[#202322] border border-[#454943] space-y-2.5 font-mono text-xs">
              <span className="text-[#C69B70] uppercase font-bold block">
                {lang === 'ar' ? 'معايير الجودة والتصنيع المضمنة' : 'MANDATORY EMBEDDED CAPABILITIES'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#AAA99F]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={features.localStoragePersistence}
                    onChange={(e) => setFeatures({ ...features, localStoragePersistence: e.target.checked })}
                    className="accent-[#B76E45]"
                  />
                  <span>{lang === 'ar' ? 'حفظ البيانات محلياً (Offline State)' : 'LocalStorage State Persistence'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={features.responsiveLayout}
                    onChange={(e) => setFeatures({ ...features, responsiveLayout: e.target.checked })}
                    className="accent-[#B76E45]"
                  />
                  <span>{lang === 'ar' ? 'واجهة متجاوبة لكل الأجهزة' : 'Responsive Mobile & Desktop Matrix'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={features.dataExportJsonCsv}
                    onChange={(e) => setFeatures({ ...features, dataExportJsonCsv: e.target.checked })}
                    className="accent-[#B76E45]"
                  />
                  <span>{lang === 'ar' ? 'تصدير واستيراد البيانات (JSON/CSV)' : 'JSON & CSV Data Interchange'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={features.offlineCapable}
                    onChange={(e) => setFeatures({ ...features, offlineCapable: e.target.checked })}
                    className="accent-[#B76E45]"
                  />
                  <span>{lang === 'ar' ? 'يعمل بدون إنترنت (Zero API lock)' : 'Zero-Dependency Standalone Runtime'}</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !idea.trim()}
              className="w-full py-4 bg-[#B76E45] hover:bg-[#A65F3C] disabled:opacity-50 text-[#F1EBDD] font-mono font-bold text-sm tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Flame className="w-4 h-4" />
              <span>
                {isLoading
                  ? (lang === 'ar' ? 'جاري البناء والتجميع في WRK-05..07...' : 'SYNTHESIZING APPLICATION ARTIFACT...')
                  : (lang === 'ar' ? 'بدء التصنيع في ورشة التطبيقات' : 'IGNITE AI APPLICATION BUILD')}
              </span>
            </button>
          </form>
        </div>

        {/* Blueprint Presets Sidebar */}
        <div className="space-y-6">
          <div className="p-6 border border-[#454943] bg-[#292D2B] space-y-4 font-mono">
            <h3 className="text-sm font-bold text-[#F1EBDD] border-b border-[#454943] pb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#C69B70]" />
              <span>{lang === 'ar' ? 'مخططات جاهزة للتحميل الفوري' : 'ARCHITECTURAL BLUEPRINTS'}</span>
            </h3>
            <p className="text-xs text-[#AAA99F]">
              {lang === 'ar'
                ? 'انقر على أي مخطط لتعبئة المواصفات الهندسية وبدء تصنيعه فوراً.'
                : 'Select an industrial blueprint to load production parameters immediately.'}
            </p>

            <div className="space-y-3">
              {presets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplyPreset(preset)}
                  className="p-3 bg-[#202322] border border-[#454943] hover:border-[#B76E45] transition cursor-pointer text-left space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F1EBDD] group-hover:text-[#C69B70] transition">
                      {preset.title}
                    </span>
                    <span className="text-[10px] text-[#B76E45] font-bold px-1.5 py-0.5 bg-[#292D2B]">
                      {preset.platform}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#AAA99F] line-clamp-2 leading-relaxed">
                    {preset.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee Box */}
          <div className="p-6 border border-[#454943] bg-[#292D2B] space-y-3 font-mono text-xs">
            <h4 className="text-xs font-bold uppercase text-[#C69B70] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ZERO-MOCK PRODUCTION CLAUSE</span>
            </h4>
            <p className="text-[11px] text-[#AAA99F] leading-relaxed">
              Every synthesized application contains real HTML5 canvas, LocalStorage databases, and JavaScript event architectures. No dummy interfaces or static screenshots.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
