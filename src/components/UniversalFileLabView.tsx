import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileCode,
  FileText,
  Layers,
  Upload,
  Download,
  Flame,
  CheckCircle2,
  HardDrive,
  Cpu,
  Hash,
} from 'lucide-react';
import { BuildJob } from '../types';

interface UniversalFileLabViewProps {
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

export const UniversalFileLabView: React.FC<UniversalFileLabViewProps> = ({
  onStartJob,
  isLoading,
  lang,
}) => {
  const [activeBay, setActiveBay] = useState<'data' | 'doc' | 'checksum'>('data');

  // Bay 1: Data
  const [csvContent, setCsvContent] = useState(
    'id,item_name,quantity,unit_price,status\n1,Forged Steel Beam,120,45.50,IN_STOCK\n2,Copper Ingot Grade-A,340,82.00,ALLOCATED\n3,Carbon Filter 44,80,19.20,IN_STOCK'
  );

  // Bay 2: Doc
  const [markdownContent, setMarkdownContent] = useState(
    '# Yasser Universal Builder — Specification\n\n## Overview\nIndustrial cloud manufacturing with 17 workers.\n\n- SSRF Protected\n- Real SHA-256 validation\n- Zero-mock deliverable products'
  );

  // Bay 3: Checksum
  const [hashInput, setHashInput] = useState('');
  const [computedHash, setComputedHash] = useState<string | null>(null);

  const handleComputeHash = async () => {
    if (!hashInput) return;
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    setComputedHash(hashHex);
  };

  const handleDispatchCsv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent.trim()) return;
    onStartJob(
      lang === 'ar' ? 'تحويل جدول CSV إلى JSON' : 'CSV to JSON Transformation',
      'file_conversion',
      csvContent,
      'json',
      'Cross-Platform',
      { type: 'csv_to_json' }
    );
  };

  const handleDispatchMarkdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!markdownContent.trim()) return;
    onStartJob(
      lang === 'ar' ? 'تجميع مستند Markdown إلى HTML/PDF' : 'Markdown to HTML/PDF',
      'file_conversion',
      markdownContent,
      'pdf',
      'Cross-Platform',
      { type: 'md_to_doc' }
    );
  };

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* Title Header */}
      <div className="border-b border-[#454943] pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#454943] text-[#F1EBDD] font-mono text-[10px] font-bold">
              STN-03 // FILE CONVERSION WORKERS: WRK-08 TO WRK-12
            </span>
            <span className="text-xs font-mono text-emerald-400">FLEET: 5 WORKERS ALLOCATED</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-mono uppercase text-[#F1EBDD]">
            {lang === 'ar' ? 'معمل تحويل الملفات الصناعي' : 'UNIVERSAL FILE LAB'}
          </h1>
          <p className="text-xs sm:text-sm text-[#AAA99F] font-mono mt-1">
            {lang === 'ar'
              ? 'معالجة وتجهيز جداول البيانات، المستندات المنسقة، وفحص البصمات التشفيرية مع عزل كامل.'
              : 'Enterprise file parsing, structured data milling, and byte-level cryptographic integrity inspection.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#202322] p-1 border border-[#454943] font-mono text-xs">
          <button
            onClick={() => setActiveBay('data')}
            className={`px-3 py-1.5 transition cursor-pointer ${
              activeBay === 'data' ? 'bg-[#B76E45] text-[#F1EBDD] font-bold' : 'text-[#AAA99F]'
            }`}
          >
            {lang === 'ar' ? 'جداول CSV / JSON' : 'CSV & DATA'}
          </button>
          <button
            onClick={() => setActiveBay('doc')}
            className={`px-3 py-1.5 transition cursor-pointer ${
              activeBay === 'doc' ? 'bg-[#B76E45] text-[#F1EBDD] font-bold' : 'text-[#AAA99F]'
            }`}
          >
            {lang === 'ar' ? 'المستندات وMarkdown' : 'DOC & MARKDOWN'}
          </button>
          <button
            onClick={() => setActiveBay('checksum')}
            className={`px-3 py-1.5 transition cursor-pointer ${
              activeBay === 'checksum' ? 'bg-[#B76E45] text-[#F1EBDD] font-bold' : 'text-[#AAA99F]'
            }`}
          >
            {lang === 'ar' ? 'فحص SHA-256' : 'SHA-256 PROVER'}
          </button>
        </div>
      </div>

      {/* Bay 1: Data Milling (CSV to JSON) */}
      {activeBay === 'data' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleDispatchCsv} className="p-6 border border-[#454943] bg-[#292D2B] space-y-6">
              <h3 className="text-base font-bold font-mono text-[#F1EBDD] border-b border-[#454943] pb-3 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#B76E45]" />
                <span>{lang === 'ar' ? 'تحويل جدول CSV إلى قاعدة JSON منظمة' : 'CSV TO STRUCTURED JSON DATASET'}</span>
              </h3>

              <div>
                <label className="block text-xs font-mono uppercase text-[#AAA99F] mb-2">
                  {lang === 'ar' ? 'بيانات CSV المدخلة (الصق أو عدل البيانات أدناه):' : 'RAW CSV PAYLOAD:'}
                </label>
                <textarea
                  rows={8}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  className="w-full bg-[#202322] border border-[#454943] text-[#F1EBDD] p-4 text-xs font-mono focus:border-[#B76E45] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !csvContent.trim()}
                className="w-full py-4 bg-[#B76E45] hover:bg-[#A65F3C] disabled:opacity-50 text-[#F1EBDD] font-mono font-bold text-sm tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Flame className="w-4 h-4" />
                <span>
                  {isLoading
                    ? (lang === 'ar' ? 'جاري التحويل في العمال الـ5...' : 'PROCESSING IN WORKERS WRK-08..12...')
                    : (lang === 'ar' ? 'بدء تحويل الملف إلى JSON قابل للتنزيل' : 'DISPATCH CSV TO JSON')}
                </span>
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="p-6 border border-[#454943] bg-[#292D2B] space-y-3 font-mono text-xs">
              <h4 className="text-xs font-bold uppercase text-[#C69B70] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>DATA INTEGRITY GUARANTEE</span>
              </h4>
              <p className="text-[11px] text-[#AAA99F] leading-relaxed">
                Workers WRK-08 to WRK-12 execute atomic streaming parsing with numeric casting, header normalization, and physical storage write before generating the SHA-256 seal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bay 2: Doc & Markdown */}
      {activeBay === 'doc' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleDispatchMarkdown} className="p-6 border border-[#454943] bg-[#292D2B] space-y-6">
              <h3 className="text-base font-bold font-mono text-[#F1EBDD] border-b border-[#454943] pb-3 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#C69B70]" />
                <span>{lang === 'ar' ? 'تجميع مستند Markdown إلى PDF' : 'MARKDOWN DOCUMENT ARCHIVING'}</span>
              </h3>

              <div>
                <label className="block text-xs font-mono uppercase text-[#AAA99F] mb-2">
                  {lang === 'ar' ? 'نص Markdown المستهدف:' : 'MARKDOWN SOURCE TEXT:'}
                </label>
                <textarea
                  rows={8}
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  className="w-full bg-[#202322] border border-[#454943] text-[#F1EBDD] p-4 text-xs font-mono focus:border-[#C69B70] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !markdownContent.trim()}
                className="w-full py-4 bg-[#B76E45] hover:bg-[#A65F3C] disabled:opacity-50 text-[#F1EBDD] font-mono font-bold text-sm tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Flame className="w-4 h-4" />
                <span>
                  {isLoading
                    ? (lang === 'ar' ? 'جاري التجميع في العمال...' : 'GENERATING PDF ARTIFACT...')
                    : (lang === 'ar' ? 'بناء وتصدير PDF موثق' : 'BUILD SPEC-COMPLIANT PDF')}
                </span>
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="p-6 border border-[#454943] bg-[#292D2B] space-y-3 font-mono text-xs">
              <h4 className="text-xs font-bold uppercase text-[#C69B70]">ISO PDF 1.4 STANDARD</h4>
              <p className="text-[11px] text-[#AAA99F] leading-relaxed">
                Documents compiled follow official PDF 1.4 specs with embedded catalog, xref offset table, and uncompressed stream markers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bay 3: Checksum Prover */}
      {activeBay === 'checksum' && (
        <div className="p-6 border border-[#454943] bg-[#292D2B] space-y-6">
          <h3 className="text-base font-bold font-mono text-[#F1EBDD] border-b border-[#454943] pb-3 flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#B76E45]" />
            <span>{lang === 'ar' ? 'فاحص بصمة التشفير الفوري SHA-256' : 'CLIENT-SIDE SHA-256 VERIFICATION PROVER'}</span>
          </h3>

          <div>
            <label className="block text-xs font-mono uppercase text-[#AAA99F] mb-2">
              {lang === 'ar' ? 'أدخل أي نص أو بيانات لفحص البصمة الثنائية:' : 'INPUT STRING OR HEX STREAM:'}
            </label>
            <textarea
              rows={4}
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Paste any binary payload or text to verify cryptographic signature..."
              className="w-full bg-[#202322] border border-[#454943] text-[#F1EBDD] p-4 text-xs font-mono focus:border-[#B76E45] focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleComputeHash}
            className="px-6 py-2.5 bg-[#B76E45] hover:bg-[#A65F3C] text-[#F1EBDD] font-mono text-xs font-bold uppercase transition cursor-pointer"
          >
            {lang === 'ar' ? 'حساب البصمة التشفيرية' : 'CALCULATE SHA-256'}
          </button>

          {computedHash && (
            <div className="p-4 bg-[#202322] border border-emerald-500/30 text-xs font-mono space-y-2">
              <span className="text-emerald-400 font-bold block">VERIFIED HASH:</span>
              <div className="text-[#F1EBDD] break-all select-all">{computedHash}</div>
              <span className="text-[10px] text-[#AAA99F] block">Computed via Web Cryptography API SHA-256 engine</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
