import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Flame,
  RotateCcw,
  Square,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Terminal,
} from 'lucide-react';
import { WorkerItem, BuildJob } from '../types';

interface WorkersJobsViewProps {
  jobs: BuildJob[];
  activeJob: BuildJob | null;
  onSelectJob: (job: BuildJob) => void;
  onCancelJob: (jobId: string) => void;
  onRetryJob: (jobId: string) => void;
  lang: 'ar' | 'en';
}

export const WorkersJobsView: React.FC<WorkersJobsViewProps> = ({
  jobs,
  activeJob,
  onSelectJob,
  onCancelJob,
  onRetryJob,
  lang,
}) => {
  const [workers, setWorkers] = useState<WorkerItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchWorkers = async () => {
    try {
      const res = await fetch('/api/workers');
      const data = await res.json();
      if (data.success) {
        setWorkers(data.workers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkers();
    const interval = setInterval(fetchWorkers, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleResetWorker = async (workerId: string) => {
    try {
      await fetch(`/api/workers/${workerId}/reset`, { method: 'POST' });
      fetchWorkers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* Title Header */}
      <div className="border-b border-[#454943] pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#B76E45] text-[#F1EBDD] font-mono text-[10px] font-bold">
              CLOUD EXECUTION FABRIC: 17 ISOLATED DAEMONS
            </span>
            <span className="text-xs font-mono text-emerald-400">HARDWARE CONCURRENCY 100%</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-mono uppercase text-[#F1EBDD]">
            {lang === 'ar' ? 'أسطول العمال الـ17 وطابور المهام' : '17-WORKER FLEET & ACTIVE QUEUE'}
          </h1>
          <p className="text-xs sm:text-sm text-[#AAA99F] font-mono mt-1">
            {lang === 'ar'
              ? 'مراقبة فورية لأداء كل عامل سحابي مستقل، استهلاك الذاكرة والمعالج، وتتبع مراحل البناء خطوة بخطوة.'
              : 'Real-time telemetry of 17 isolated cloud daemons with memory, CPU metrics, and asynchronous job life-cycles.'}
          </p>
        </div>

        <button
          onClick={fetchWorkers}
          className="px-4 py-2 border border-[#454943] hover:border-[#C69B70] text-[#F1EBDD] font-mono text-xs font-bold uppercase transition cursor-pointer"
        >
          {lang === 'ar' ? 'تحديث أداء العمال' : 'REFRESH TELEMETRY'}
        </button>
      </div>

      {/* 17 Workers Hardware Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-[#F1EBDD] uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#B76E45]" />
            <span>{lang === 'ar' ? 'لوحة تحكم وتوزيع العمال الـ17' : '17 ISOLATED WORKERS TELEMETRY MATRIX'}</span>
          </h3>
          <span className="text-xs font-mono text-[#AAA99F]">
            BUSY: {workers.filter((w) => w.status === 'BUSY').length} / 17
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {workers.map((w) => {
            const isBusy = w.status === 'BUSY';
            const isFailed = w.status === 'FAILED';
            return (
              <div
                key={w.id}
                className={`p-3 border font-mono text-xs flex flex-col justify-between transition ${
                  isBusy
                    ? 'border-[#B76E45] bg-[#B76E45]/10 text-[#F1EBDD]'
                    : isFailed
                    ? 'border-red-500 bg-red-500/10 text-red-200'
                    : 'border-[#454943] bg-[#292D2B] text-[#AAA99F]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-bold text-[#F1EBDD]">{w.id}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold ${
                        isBusy ? 'text-[#B76E45]' : isFailed ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>

                  <div className="text-[11px] font-bold text-[#F1EBDD] truncate">{w.engineName}</div>

                  <div className="mt-2 space-y-0.5 text-[10px] text-[#AAA99F]">
                    <div>CPU: {w.cpuPercent}%</div>
                    <div>MEM: {w.memoryMb} MB</div>
                    <div>JOBS: {w.processedJobs}</div>
                  </div>

                  {w.currentJobTitle && (
                    <div className="mt-2 p-1.5 bg-[#202322] border border-[#454943] text-[9px] text-[#C69B70] truncate">
                      {w.currentJobTitle}
                    </div>
                  )}
                </div>

                <div className="pt-2 mt-2 border-t border-[#454943]/60 flex items-center justify-between">
                  <span className="text-[9px] text-[#6E7067]">{w.uptimeSeconds}s UP</span>
                  <button
                    onClick={() => handleResetWorker(w.id)}
                    className="text-[9px] text-[#AAA99F] hover:text-[#F1EBDD] transition cursor-pointer"
                    title="إعادة تهيئة العامل"
                  >
                    RESET
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Jobs Queue */}
      <div className="space-y-4 pt-6 border-t border-[#454943]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-[#F1EBDD] uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#C69B70]" />
            <span>{lang === 'ar' ? 'سجل العمليات والمهام السحابية' : 'ASYNCHRONOUS PIPELINE TASK QUEUE'}</span>
          </h3>
          <span className="text-xs font-mono text-[#AAA99F]">TOTAL: {jobs.length}</span>
        </div>

        {jobs.length === 0 ? (
          <div className="p-8 border border-[#454943] bg-[#292D2B] text-center text-xs font-mono text-[#AAA99F]">
            {lang === 'ar' ? 'لا توجد مهام حالية في الطابور.' : 'No active jobs in queue.'}
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => {
              const isReady = job.status === 'Ready';
              const isFailed = job.status === 'Failed';
              const isCancelled = job.status === 'Cancelled';
              return (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="p-4 border border-[#454943] bg-[#292D2B] hover:border-[#B76E45] transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#B76E45]">{job.id}</span>
                      <span className="font-bold text-[#F1EBDD]">{job.title}</span>
                      {job.assignedWorkerId && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#202322] border border-[#454943] text-[#C69B70]">
                          {job.assignedWorkerId}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#AAA99F] truncate max-w-lg">{job.input}</p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Progress Bar */}
                    <div className="w-24 sm:w-32 bg-[#202322] border border-[#454943] h-2">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isReady ? 'bg-emerald-400' : isFailed ? 'bg-red-400' : 'bg-[#B76E45]'
                        }`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <span className="tabular-nums font-bold text-[#F1EBDD] w-10 text-right">
                      {job.progress}%
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold ${
                        isReady
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isFailed
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : isCancelled
                          ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          : 'bg-[#B76E45]/20 text-[#B76E45] border border-[#B76E45]/40 animate-pulse'
                      }`}
                    >
                      {job.status}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {!isReady && !isFailed && !isCancelled && (
                        <button
                          onClick={() => onCancelJob(job.id)}
                          className="p-1 hover:text-red-400 transition"
                          title="إلغاء المهمة"
                        >
                          <Square className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {(isFailed || isCancelled) && (
                        <button
                          onClick={() => onRetryJob(job.id)}
                          className="p-1 hover:text-[#C69B70] transition"
                          title="إعادة المحاولة"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
