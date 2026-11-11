import React from 'react';
import { BuildJob } from '../types';
import { X, Play, RotateCcw, AlertTriangle, CheckCircle2, Square, Download, Cpu, HardDrive } from 'lucide-react';

interface JobMonitorModalProps {
  job: BuildJob | null;
  onClose: () => void;
  onCancel: (jobId: string) => void;
  onRetry: (jobId: string) => void;
  onViewProduct?: (productId: string) => void;
}

export const JobMonitorModal: React.FC<JobMonitorModalProps> = ({
  job,
  onClose,
  onCancel,
  onRetry,
  onViewProduct,
}) => {
  if (!job) return null;

  const isFinished = job.status === 'Ready' || job.status === 'Failed' || job.status === 'Cancelled';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#292D2B] border border-[#454943] max-w-2xl w-full p-6 shadow-2xl space-y-5 font-mono text-xs">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#454943] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 bg-[#202322] text-[#B76E45] font-bold border border-[#454943]">
                {job.id}
              </span>
              <h3 className="text-base font-bold text-[#F1EBDD]">{job.title}</h3>
            </div>
            <p className="text-xs text-[#AAA99F] mt-1">
              Input: <span className="text-[#F1EBDD]">{job.input.slice(0, 60)}...</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#AAA99F] hover:text-[#F1EBDD] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2">
              <span className="text-[#AAA99F]">STATUS:</span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold ${
                  job.status === 'Ready'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : job.status === 'Failed'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : job.status === 'Cancelled'
                    ? 'bg-[#202322] text-[#AAA99F]'
                    : 'bg-[#B76E45]/20 text-[#B76E45] border border-[#B76E45]/40 animate-pulse'
                }`}
              >
                {job.status}
              </span>
              {job.assignedWorkerId && (
                <span className="text-[10px] text-[#C69B70]">({job.assignedWorkerId})</span>
              )}
            </span>
            <span className="tabular-nums font-bold text-[#F1EBDD]">{job.progress}%</span>
          </div>

          <div className="w-full bg-[#202322] border border-[#454943] h-2">
            <div
              className={`h-full transition-all duration-300 ${
                job.status === 'Ready'
                  ? 'bg-emerald-400'
                  : job.status === 'Failed'
                  ? 'bg-red-400'
                  : 'bg-[#B76E45]'
              }`}
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>

        {/* Real Step Execution Logs Terminal */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[#C69B70] uppercase">
            WORKER STEP TIMELINE & TRACE LOGS:
          </span>
          <div className="bg-[#202322] border border-[#454943] p-4 h-48 overflow-y-auto space-y-2 text-[11px] font-mono scrollbar-thin">
            {job.logs.length === 0 ? (
              <div className="text-[#6E7067]">Awaiting worker assignment...</div>
            ) : (
              job.logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#6E7067] text-[10px] shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-[#C69B70] uppercase shrink-0">[{log.phase}]</span>
                  <span
                    className={`break-all ${
                      log.type === 'error'
                        ? 'text-red-400'
                        : log.type === 'warn'
                        ? 'text-amber-400'
                        : log.type === 'success'
                        ? 'text-emerald-400 font-bold'
                        : 'text-[#F1EBDD]'
                    }`}
                  >
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-3 border-t border-[#454943] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isFinished && (
              <button
                onClick={() => onCancel(job.id)}
                className="px-3 py-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Square className="w-3.5 h-3.5" />
                <span>CANCEL JOB</span>
              </button>
            )}
            {(job.status === 'Failed' || job.status === 'Cancelled') && (
              <button
                onClick={() => onRetry(job.id)}
                className="px-3 py-1.5 border border-[#C69B70] text-[#C69B70] hover:bg-[#C69B70]/10 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RETRY JOB</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {job.status === 'Ready' && job.productId && (
              <>
                <a
                  href={`/api/download/${job.productId}`}
                  className="px-4 py-2 bg-[#B76E45] hover:bg-[#A65F3C] text-[#F1EBDD] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD ARTIFACT</span>
                </a>
                {onViewProduct && (
                  <button
                    onClick={() => {
                      onViewProduct(job.productId!);
                      onClose();
                    }}
                    className="px-3 py-2 border border-[#454943] hover:border-[#C69B70] text-[#F1EBDD] text-xs transition cursor-pointer"
                  >
                    VIEW IN VAULT
                  </button>
                )}
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#454943] text-[#AAA99F] hover:text-[#F1EBDD] text-xs transition cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
