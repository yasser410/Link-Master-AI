import React, { useState, useEffect } from 'react';
import {
  Package,
  Smartphone,
  Monitor,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Download,
  Flame,
  HardDrive,
  Cpu,
  Layers,
  FileCode,
} from 'lucide-react';
import { PackagingSpec, BuildJob } from '../types';

interface BuildPackagingViewProps {
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
}

export const BuildPackagingView: React.FC<BuildPackagingViewProps> = ({
  onStartJob,
  isLoading,
  lang,
}) => {
  const [specs, setSpecs] = useState<PackagingSpec[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<string>('PWA');
  const [appName, setAppName] = useState('Foundry Enterprise Portal');
  const [appUrl, setAppUrl] = useState('https://foundry.local');

  useEffect(() => {
    fetch('/api/packaging/specs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSpecs(data.specs);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDispatchPackaging = (spec: PackagingSpec) => {
    onStartJob(
      `${lang === 'ar' ? 'تجميع حزمة' : 'Package Artifact'}: ${appName} (${spec.platform})`,
      'packaging',
      `${appName}|${appUrl}|${spec.platform}`,
      spec.artifactFormat.toLowerCase(),
      spec.platform.split(' ')[0],
      {
        platform: spec.platform,
        classification: spec.classification,
        signingStatus: spec.signingStatus,
      }
    );
  };

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* Title Header */}
      <div className="border-b border-[#454943] pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#C69B70] text-[#202322] font-mono text-[10px] font-bold">
              STN-05 // PACKAGING & COMPILATION WORKERS: WRK-15 TO WRK-17
            </span>
            <span className="text-xs font-mono text-emerald-400">ARTIFACT COMPILER READY</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-mono uppercase text-[#F1EBDD]">
            {lang === 'ar' ? 'مركز تجميع الحزم والمنصات' : 'BUILD & PACKAGING LAB'}
          </h1>
          <p className="text-xs sm:text-sm text-[#AAA99F] font-mono mt-1">
            {lang === 'ar'
              ? 'تجهيز حزم التثبيت النهائية لأنظمة التشغيل المختلفة (Android, Windows, macOS, Linux, PWA) مع التمييز الدقيق بين الحزمة الأولية والنهائية.'
              : 'Cross-platform packaging matrix. Compiles native installers, PWA bundles, Android manifests, and standalone scripts.'}
          </p>
        </div>

        <div className="p-3 bg-[#292D2B] border border-[#454943] text-right font-mono text-xs">
          <span className="text-[#AAA99F] block text-[10px]">SIGNING ENVIRONMENT</span>
          <span className="text-[#F1EBDD] font-bold">SHA-256 INTEGRITY SEAL</span>
        </div>
      </div>

      {/* Target Packaging Specs Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold font-mono text-[#F1EBDD] uppercase tracking-wider flex items-center gap-2">
          <Package className="w-4 h-4 text-[#B76E45]" />
          <span>{lang === 'ar' ? 'مواصفات حزم الأنظمة المدعومة' : 'SUPPORTED PLATFORM PACKAGING SPECIFICATIONS'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specs.map((spec) => (
            <div
              key={spec.id}
              className="p-5 border border-[#454943] bg-[#292D2B] hover:border-[#B76E45] transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="px-2 py-0.5 bg-[#202322] text-[#C69B70] font-bold border border-[#454943]">
                    {spec.artifactFormat}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 ${
                      spec.classification === 'Final Executable'
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-[#AAA99F] bg-[#202322]'
                    }`}
                  >
                    {spec.classification}
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#F1EBDD] font-mono">{spec.platform}</h4>

                <div className="mt-3 space-y-1.5 text-[11px] font-mono text-[#AAA99F]">
                  <div>
                    <span className="text-[#C69B70]">Environment: </span>
                    {spec.buildEnvironment}
                  </div>
                  <div>
                    <span className="text-[#C69B70]">Signing: </span>
                    {spec.signingStatus}
                  </div>
                  <div className="text-[10px] text-[#6E7067] pt-1">
                    Req: {spec.requirements}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#454943] flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400">READY</span>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleDispatchPackaging(spec)}
                  className="px-3 py-1.5 bg-[#B76E45] hover:bg-[#A65F3C] text-[#F1EBDD] font-mono font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تجميع الحزمة' : 'ASSEMBLE'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
