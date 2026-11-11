import React, { useState } from 'react';
import { SystemTestReport, SystemTestResult } from '../types';
import { Play, CheckCircle2, XCircle, Clock, ShieldCheck, Terminal, AlertCircle } from 'lucide-react';

export const SystemTestsView: React.FC = () => {
  const [report, setReport] = useState<SystemTestReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSuite = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/system/tests/run', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل تشغيل الاختبارات الآلية');
      }
      setReport(data.report);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تشغيل الفحوصات');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-right">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">مركز الاختبارات وضمان الجودة الميداني</h2>
          <p className="text-xs text-slate-400 mt-1">
            تنفيذ الفحوصات الفعلية لحماية SSRF، توليد ملفات PDF، تجميع حزم PWA، سلامة التخزين، ومطابقة بصمات SHA-256.
          </p>
        </div>

        <button
          onClick={runSuite}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>جارٍ تنفيذ الاختبارات الفعلية...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>تشغيل حزمة الاختبارات الآلية الآن</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Scorecard */}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 block">إجمالي الفحوصات المنفذة</span>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">{report.totalTests}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 block">الاختبارات الناجحة (PASS)</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" />
              <span>{report.passed}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 block">الاختبارات الفاشلة (FAIL)</span>
            <div className={`text-2xl font-bold font-mono mt-1 tabular-nums flex items-center gap-1.5 ${
              report.failed > 0 ? 'text-red-400' : 'text-slate-400'
            }`}>
              {report.failed > 0 && <XCircle className="w-5 h-5" />}
              <span>{report.failed}</span>
            </div>
          </div>
        </div>
      )}

      {/* Test List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white">سجل نتائج الفحص الآلي الحقيقي</h3>
          </div>
          {report && (
            <span className="text-[10px] font-mono text-slate-400">
              تاريخ الفحص: {new Date(report.timestamp).toLocaleTimeString('ar-EG')}
            </span>
          )}
        </div>

        <div className="divide-y divide-slate-800/80">
          {!report && !isRunning && (
            <div className="p-12 text-center text-slate-500 text-xs">
              اضغط على "تشغيل حزمة الاختبارات الآلية الآن" لبدء الفحص الميداني المباشر.
            </div>
          )}

          {report?.results.map((t) => (
            <div key={t.id} className="p-4 hover:bg-slate-800/40 transition flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-bold border border-slate-800">
                    {t.id}
                  </span>
                  <span className="text-xs font-bold text-white">{t.name}</span>
                </div>
                <p className="text-xs text-slate-400">{t.details}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-mono text-slate-500">{t.durationMs}ms</span>
                <span
                  className={`text-[10px] font-mono px-2.5 py-1 rounded font-bold ${
                    t.status === 'PASS'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : t.status === 'FAIL'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
