import React, { useState } from 'react';
import { Globe, Lightbulb, FileText, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface UnifiedHeroBuilderProps {
  onStartUrlConversion: (url: string, format: string) => void;
  onStartAppBuild: (idea: string) => void;
  onNavigateTab: (tab: string) => void;
  isLoading: boolean;
}

export const UnifiedHeroBuilder: React.FC<UnifiedHeroBuilderProps> = ({
  onStartUrlConversion,
  onStartAppBuild,
  onNavigateTab,
  isLoading,
}) => {
  const [activeMode, setActiveMode] = useState<'url' | 'idea' | 'file'>('url');
  const [inputValue, setInputValue] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('pwa');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (activeMode === 'url') {
      onStartUrlConversion(inputValue.trim(), selectedFormat);
    } else if (activeMode === 'idea') {
      onStartAppBuild(inputValue.trim());
    } else {
      onNavigateTab('file');
    }
  };

  const setExample = (text: string, mode: 'url' | 'idea', format?: string) => {
    setActiveMode(mode);
    setInputValue(text);
    if (format) setSelectedFormat(format);
  };

  return (
    <div className="relative overflow-hidden pt-8 pb-12 border-b border-slate-800 bg-gradient-to-b from-slate-900/50 to-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        {/* Supervisor Badge & Motto */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <span>المالك والمشرف: الحاج ياسر – El Hag Yasser</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">من أي فكرة أو رابط إلى منتج نهائي جاهز للاستخدام</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight text-balance">
          المنصة السحابية الشاملة لبناء المنتجات النهائية
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed text-balance">
          حوّل الروابط إلى تطبيقات ومستندات، وانقل أفكارك إلى تطبيقات حقيقية تعمل فوراً مع فحص الجودة
          وحساب البصمة الرقمية ورابط تحميل مباشر. بدون الحاجة لكتابة أو تصدير كود.
        </p>

        {/* Mode Tabs */}
        <div className="flex items-center justify-center p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-md mx-auto shadow-inner">
          <button
            onClick={() => {
              setActiveMode('url');
              setInputValue('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeMode === 'url' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>تحويل رابط</span>
          </button>
          <button
            onClick={() => {
              setActiveMode('idea');
              setInputValue('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeMode === 'idea' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>فكرة إلى تطبيق</span>
          </button>
          <button
            onClick={() => onNavigateTab('file')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeMode === 'file' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>تحويل ملف</span>
          </button>
        </div>

        {/* Master Input Box */}
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-right">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              {activeMode === 'url' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    أدخل رابط الموقع أو الصفحة (HTTP / HTTPS مع فحص SSRF التلقائي)
                  </label>
                  <input
                    type="url"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="https://example.com أو أي رابط صفحة..."
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition shadow-inner font-mono text-left"
                    dir="ltr"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    اكتب وصف التطبيق الذي تريده بلغتك الطبيعية (العربية أو الإنجليزية)
                  </label>
                  <textarea
                    rows={3}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="مثال: تطبيق متكامل لإدارة متجر ملابس مع المخزون والعملاء والفواتير والبحث مع تصدير التقارير..."
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition shadow-inner resize-none"
                  />
                </div>
              )}
            </div>

            {/* Output Format Selector for URL Mode */}
            {activeMode === 'url' && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400">المنتج النهائي المطلوب:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'pwa', label: 'تطبيق PWA مثبت' },
                    { id: 'pdf', label: 'مستند PDF رسمي' },
                    { id: 'android', label: 'حزمة Android' },
                    { id: 'desktop', label: 'مشغل Desktop' },
                    { id: 'markdown', label: 'ماركدون MD' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setSelectedFormat(fmt.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition cursor-pointer ${
                        selectedFormat === fmt.id
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>عزل كامل في Workers &bull; فحص بصمة SHA-256 &bull; رابط تنزيل مباشر</span>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>جارٍ البناء السحابي...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>بدء التنفيذ والبناء السحابي</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Examples */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-500">أمثلة سريعة:</span>
            <button
              onClick={() => setExample('https://news.ycombinator.com', 'url', 'pwa')}
              className="text-amber-400/90 hover:underline hover:text-amber-300 cursor-pointer"
            >
              موقع تقني إلى تطبيق PWA
            </button>
            <span>&bull;</span>
            <button
              onClick={() =>
                setExample('تطبيق إدارة مهام ومشاريع مع تتبع الوقت وحساب الإنتاجية وتقارير أسبوعية', 'idea')
              }
              className="text-amber-400/90 hover:underline hover:text-amber-300 cursor-pointer"
            >
              تطبيق إدارة المشاريع والوقت
            </button>
            <span>&bull;</span>
            <button
              onClick={() =>
                setExample('لوحة تحكم لإدارة متجر ملابس ومخزون وسجلات المبيعات وفواتير العملاء', 'idea')
              }
              className="text-amber-400/90 hover:underline hover:text-amber-300 cursor-pointer"
            >
              لوحة تحكم متجر ملابس
            </button>
          </div>
        </div>

        {/* Feature 3-Pillars Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-right max-w-4xl mx-auto">
          <div
            onClick={() => onNavigateTab('url')}
            className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">1. تحويل الرابط إلى منتج</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تحويل المواقع إلى حزم PWA وAndroid وDesktop Launcher ومستندات PDF مع فك الروابط وحماية SSRF.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('app')}
            className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">2. فكرة إلى تطبيق متكامل</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              بناء حقيقي لتطبيق تفاعلي ذي كفاءة عالية مع معاينة مباشرة وتعديل باللغة الطبيعية دون لمس الكود.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('file')}
            className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">3. مركز تحويل الملفات والوسائط</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تحويل المستندات والصور (PNG/WebP/SVG) والجداول CSV/JSON وتوليد الصوتيات مع حساب البصمة الرقمية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
