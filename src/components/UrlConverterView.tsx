import React, { useState } from 'react';
import { Globe, ShieldCheck, Download, ArrowRight, ExternalLink, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface UrlConverterViewProps {
  onStartJob: (title: string, category: 'url_conversion', input: string, format: string, platform: string) => void;
  isLoading: boolean;
}

export const UrlConverterView: React.FC<UrlConverterViewProps> = ({ onStartJob, isLoading }) => {
  const [urlInput, setUrlInput] = useState('');
  const [targetFormat, setTargetFormat] = useState('pwa');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Unshorten tool state
  const [shortUrlInput, setShortUrlInput] = useState('');
  const [unshortenResult, setUnshortenResult] = useState<any>(null);
  const [isUnshortening, setIsUnshortening] = useState(false);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysis(null);

    try {
      const res = await fetch('/api/convert/url/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل فحص الرابط');
      }
      setAnalysis(data.analysis);
    } catch (err: any) {
      setAnalysisError(err.message || 'حدث خطأ أثناء فحص الرابط');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExecute = () => {
    if (!urlInput.trim()) return;
    const title = analysis?.title || `تحويل رابط: ${new URL(urlInput).hostname}`;
    const platform = targetFormat === 'android' ? 'Android' : targetFormat === 'pwa' ? 'PWA' : 'Cross-Platform';
    onStartJob(title, 'url_conversion', urlInput.trim(), targetFormat, platform);
  };

  const handleUnshorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortUrlInput.trim()) return;

    setIsUnshortening(true);
    setUnshortenResult(null);

    try {
      const res = await fetch('/api/tools/unshorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: shortUrlInput.trim() }),
      });
      const data = await res.json();
      setUnshortenResult(data);
    } catch (err: any) {
      setUnshortenResult({ isSafe: false, error: err.message });
    } finally {
      setIsUnshortening(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-right">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">محرك تحويل الروابط إلى منتجات</h2>
            <p className="text-xs text-slate-400 mt-1">
              تحويل صفحات ومصادر الويب إلى حزم تطبيقات ومستندات قياسية مع حماية SSRF وفحص الأمان التلقائي.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>حماية SSRF مفعلة</span>
          </span>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-2">رابط الموقع أو الصفحة المستهدفة</label>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                required
                className="w-full flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition font-mono text-left"
                dir="ltr"
              />
              <button
                type="submit"
                disabled={isAnalyzing || !urlInput}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-slate-700 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>جارٍ الفحص...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>فحص الرابط</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error Notification */}
        {analysisError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold">تحذير أمني أو خطأ في الاتصال بالرابط:</div>
              <div>{analysisError}</div>
            </div>
          </div>
        )}

        {/* Analysis Inspection Preview */}
        {analysis && (
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-mono tracking-wider">بيانات الصفحة المستخرجة</span>
                <h3 className="text-base font-bold text-white mt-0.5">{analysis.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{analysis.description}</p>
              </div>
              {analysis.favicon && (
                <img
                  src={analysis.favicon}
                  alt="favicon"
                  className="w-10 h-10 rounded-lg p-1 bg-slate-900 border border-slate-800 object-contain shrink-0"
                  onError={(e) => ((e.target as any).style.display = 'none')}
                />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>بروتوكول آمن ({analysis.securityStatus.isHttps ? 'HTTPS' : 'HTTP'})</span>
              </div>
              <div>نطاق: <span className="font-mono text-slate-200">{analysis.domain}</span></div>
              <div>الفقرات المستخرجة: <span className="font-mono text-slate-200">{analysis.paragraphs?.length || 0}</span></div>
              <div>الروابط الداخلية: <span className="font-mono text-slate-200">{analysis.links?.length || 0}</span></div>
            </div>
          </div>
        )}

        {/* Target Format Options */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-3">اختر المنتج النهائي المراد إنتاجه</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'pwa',
                title: 'تطبيق ويب تقدمي (PWA)',
                desc: 'حزمة تثبيت مستقلة مع مشغل Service Worker ودعم التخزين غير المتصل',
                badge: 'PWA ZIP',
              },
              {
                id: 'pdf',
                title: 'مستند PDF رسمي',
                desc: 'وثيقة PDF معيارية منسقة بوضوح مع المحتوى والروابط المستخلصة',
                badge: 'PDF 1.4',
              },
              {
                id: 'android',
                title: 'حزمة أندرويد (Android)',
                desc: 'مشروع أندرويد كامل مع AndroidManifest و WebView مجهز للبناء إلى APK',
                badge: 'Android ZIP',
              },
              {
                id: 'desktop',
                title: 'مشغل حاسوب مكتبي (Desktop)',
                desc: 'مشغلات ويندوز وماك ولينكس لتشغيل الموقع كنافذة مستقلة بدون متصفح',
                badge: 'Desktop ZIP',
              },
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => setTargetFormat(opt.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  targetFormat === opt.id
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    targetFormat === opt.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {opt.badge}
                  </span>
                  <input
                    type="radio"
                    name="targetFormat"
                    checked={targetFormat === opt.id}
                    onChange={() => setTargetFormat(opt.id)}
                    className="accent-amber-500"
                  />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{opt.title}</h4>
                <p className="text-[11px] text-slate-400 leading-normal">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Action */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            سيتم إرسال المهمة لعامل معزول وحساب البصمة الرقمية للملف فور انتهائه.
          </div>
          <button
            onClick={handleExecute}
            disabled={isLoading || !urlInput.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>تنفيذ التحويل واستخراج المنتج</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Auxiliary Security Tool: Safe Unshortener */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">أداة فك وفحص الروابط المختصرة (Safe Unshorten)</h3>
            <p className="text-xs text-slate-400">
              تتبع مسار إعادة التوجيه خطوة بخطوة والتأكد من أمان الرابط النهائي وخلوه من البرمجيات الخبيثة.
            </p>
          </div>
        </div>

        <form onSubmit={handleUnshorten} className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="url"
            value={shortUrlInput}
            onChange={(e) => setShortUrlInput(e.target.value)}
            placeholder="مثال: https://bit.ly/xyz أو t.co/..."
            required
            className="w-full flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition font-mono text-left"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={isUnshortening || !shortUrlInput}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer disabled:opacity-50 transition"
          >
            {isUnshortening ? 'جارٍ الفحص...' : 'فك وفحص المسار'}
          </button>
        </form>

        {unshortenResult && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold">
              {unshortenResult.isSafe ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> الوجهة آمنة ومصرح بها
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> تحذير: الوجهة محظورة أو غير صالحة ({unshortenResult.error})
                </span>
              )}
            </div>
            <div>
              <span className="text-slate-400">الرابط النهائي الحقيقي: </span>
              <a
                href={unshortenResult.finalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 font-mono underline ml-2"
              >
                {unshortenResult.finalUrl}
              </a>
            </div>
            {unshortenResult.chain?.length > 1 && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block mb-1">مسار القفزات وإعادة التوجيه ({unshortenResult.chain.length}):</span>
                <ol className="list-decimal list-inside space-y-0.5 font-mono text-[11px] text-slate-300">
                  {unshortenResult.chain.map((c: string, idx: number) => (
                    <li key={idx} className="truncate">{c}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
