import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  Download,
  Play,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  Wand2,
  Maximize2,
  ExternalLink,
} from 'lucide-react';

interface IdeaToAppViewProps {
  onStartJob: (title: string, category: 'app_generation', input: string, format: string, platform: string) => void;
  isLoading: boolean;
}

export const IdeaToAppView: React.FC<IdeaToAppViewProps> = ({ onStartJob, isLoading }) => {
  const [ideaText, setIdeaText] = useState('');
  const [appName, setAppName] = useState('');
  const [platform, setPlatform] = useState('Web');
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [currentAppHtml, setCurrentAppHtml] = useState<string | null>(null);
  const [currentAppName, setCurrentAppName] = useState<string>('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Modification state
  const [modificationPrompt, setModificationPrompt] = useState('');
  const [isModifying, setIsModifying] = useState(false);
  const [modificationSuccess, setModificationSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;
    const title = appName.trim() || ideaText.trim().split(/\s+/).slice(0, 3).join(' ');
    onStartJob(title, 'app_generation', ideaText.trim(), 'app', platform);
  };

  const setPreset = (name: string, idea: string) => {
    setAppName(name);
    setIdeaText(idea);
  };

  const handleApplyModification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modificationPrompt.trim() || !currentAppHtml) return;

    setIsModifying(true);
    setModificationSuccess(null);

    try {
      const res = await fetch('/api/app/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: currentAppHtml,
          instruction: modificationPrompt.trim(),
          appName: currentAppName,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل تطبيق التعديل');
      }

      setCurrentAppHtml(data.updatedHtml);
      setModificationSuccess(`تم تطبيق التعديل بنجاح: "${modificationPrompt.trim()}"`);
      setModificationPrompt('');

      // Update iframe source directly via blob
      const blob = new Blob([data.updatedHtml], { type: 'text/html;charset=utf-8' });
      setActivePreviewUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      alert(`حدث خطأ أثناء تعديل التطبيق: ${err.message}`);
    } finally {
      setIsModifying(false);
    }
  };

  const downloadCurrentHtml = () => {
    if (!currentAppHtml) return;
    const blob = new Blob([currentAppHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(currentAppName || 'application').replace(/[^a-zA-Z0-9]/g, '_')}_standalone.html`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-right">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-black text-white">محرك تحويل الفكرة إلى تطبيق متكامل (AI App Builder)</h2>
        <p className="text-xs text-slate-400 mt-1">
          اكتب فكرتك بلغتك الطبيعية وسيقوم المحرك ببناء الواجهة والوظائف وقاعدة البيانات واختبارها
          وتجهيزها للاستخدام الفوري والتنزيل المباشر.
        </p>
      </div>

      {/* Main Creation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left/Main Form (5 cols on lg) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">اسم التطبيق (اختياري)</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="مثال: نظام إدارة متجر الأناقة"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                وصف التطبيق ووظائفه بالتفصيل
              </label>
              <textarea
                rows={5}
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                placeholder="اكتب ما تحتاجه في التطبيق: الحقول، العمليات، الحسابات، لوحة الإحصائيات، طريقة تصفية وعرض البيانات..."
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-2">المنصة المستهدفة للبناء</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Web', label: 'تطبيق ويب' },
                  { id: 'PWA', label: 'تطبيق PWA' },
                  { id: 'Desktop', label: 'حاسوب مكتبي' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id)}
                    className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                      platform === p.id
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !ideaText.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>جارٍ هندسة وبناء التطبيق...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>بناء واختبار التطبيق في السحابة</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Idea Presets */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 block">أفكار جاهزة للتجربة الفورية:</span>
            <div className="space-y-1.5">
              {[
                {
                  name: 'نظام إدارة متجر ومخزون',
                  idea: 'تطبيق متكامل لإدارة متجر ملابس مع قائمة المنتجات، الأسعار، المخزون، فواتير العملاء، وسجل المبيعات اليومية مع تصدير التقارير.',
                },
                {
                  name: 'لوحة متابعة المهام والإنتاجية',
                  idea: 'تطبيق لإدارة مهام الفريق والمشاريع مع مؤقت زمني وتصنيفات الأولوية وحساب نسبة الإنجاز والبحث المتقدم.',
                },
                {
                  name: 'نظام مواعيد واستشارات عيادة',
                  idea: 'تطبيق حجز ومتابعة مواعيد المرضى مع التاريخ الطبي وحالة الموعد وإمكانية إضافة الملاحظات وتنزيل السجلات.',
                },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPreset(preset.name, preset.idea)}
                  className="w-full text-right p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition text-xs text-slate-300 flex items-center justify-between group cursor-pointer"
                >
                  <span className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-amber-500/80">استخدام</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right/Preview Area (7 cols on lg) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">المعاينة التفاعلية المباشرة (Sandbox)</h3>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded transition ${
                  previewDevice === 'desktop' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="عرض شاشة الحاسوب"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded transition ${
                  previewDevice === 'tablet' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="عرض الجهاز اللوحي"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded transition ${
                  previewDevice === 'mobile' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="عرض الهاتف"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sandbox Frame */}
          <div className="flex-1 min-h-[420px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center relative">
            {activePreviewUrl ? (
              <div
                className={`h-full transition-all duration-300 mx-auto ${
                  previewDevice === 'mobile'
                    ? 'w-[360px] border-x border-slate-800 shadow-2xl'
                    : previewDevice === 'tablet'
                    ? 'w-[640px] border-x border-slate-800'
                    : 'w-full'
                }`}
              >
                <iframe
                  src={activePreviewUrl}
                  title="App Sandbox"
                  className="w-full h-full min-h-[460px] border-none bg-slate-950"
                  sandbox="allow-scripts allow-forms allow-modals allow-downloads"
                />
              </div>
            ) : (
              <div className="text-center p-8 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">لا توجد معاينة نشطة حالياً</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  ابدأ بوصف فكرتك واضغط "بناء واختبار التطبيق"، وستظهر هنا المعاينة التفاعلية
                  الحقيقية للتطبيق لتجربته وتعديله مباشرة.
                </p>
              </div>
            )}
          </div>

          {/* Natural Language Modification Bar (Shown when preview is active) */}
          {activePreviewUrl && (
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <form onSubmit={handleApplyModification} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={modificationPrompt}
                    onChange={(e) => setModificationPrompt(e.target.value)}
                    placeholder="اطلب تعديلاً بلغة طبيعية: (أضف لوحة تحكم، أضف تسجيل الدخول، غيّر الألوان، أضف بحث)..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isModifying || !modificationPrompt.trim()}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isModifying ? 'جارٍ التعديل...' : 'تطبيق التعديل'}</span>
                </button>
              </form>

              {modificationSuccess && (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{modificationSuccess}</span>
                </div>
              )}

              {/* Action Buttons for Current App */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">جاهز للتنزيل المباشر كملف مستقل</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadCurrentHtml}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تنزيل تطبيق HTML المستقل</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
