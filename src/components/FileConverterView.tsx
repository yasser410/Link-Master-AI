import React, { useState } from 'react';
import { FileText, ArrowRight, Download, UploadCloud, CheckCircle2, Music, Table, Code } from 'lucide-react';

interface FileConverterViewProps {
  onStartJob: (title: string, category: 'file_conversion', input: string, format: string, platform: string, payload?: any) => void;
  isLoading: boolean;
}

export const FileConverterView: React.FC<FileConverterViewProps> = ({ onStartJob, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'text_pdf' | 'csv_json' | 'md_html' | 'audio'>('text_pdf');
  const [textContent, setTextContent] = useState('');
  const [fileTitle, setFileTitle] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileTitle(file.name.replace(/\.[^.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setTextContent(text || '');
    };
    reader.readAsText(file);
  };

  const handleConvert = (format: string) => {
    const title = fileTitle.trim() || 'ملف محول';
    onStartJob(title, 'file_conversion', textContent, format, 'Cross-Platform', { content: textContent });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-right">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-black text-white">مركز تحويل الملفات والوسائط الشامل</h2>
        <p className="text-xs text-slate-400 mt-1">
          تحويل المستندات النصية والبيانات والجداول والصوتيات مع فحص البصمة الرقمية والتحقق من سلامة الناتج.
        </p>
      </div>

      {/* Conversion Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => {
            setActiveTab('text_pdf');
            setTextContent('تقرير شامل لاختبار جودة المعالجة السحابية.\nيتم تنظيم العناوين والفقرات وفق المعايير القياسية بدقة عالية.');
            setFileTitle('مستند رسمي');
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'text_pdf'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>نص / ماركدون إلى PDF</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('csv_json');
            setTextContent('id,name,role,department\n101,Ahmad,Manager,Operations\n102,Sara,Lead Engineer,Development\n103,Omar,Analyst,Finance');
            setFileTitle('سجلات_الموظفين');
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'csv_json'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>تحويل CSV إلى JSON / العكس</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('md_html');
            setTextContent('# دليل التشغيل السحابي\n\nهذا المستند يوضح خطوات استخدام **Yasser Universal Builder**.\n\n- البناء المعزول\n- فحص البصمة الرقمية\n- التحميل المباشر');
            setFileTitle('دليل_التشغيل');
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'md_html'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>ماركدون إلى HTML مستقل</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('audio');
            setFileTitle('نغمة_صوتية_معيارية');
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'audio'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>معالج الصوتيات وWAV</span>
        </button>
      </div>

      {/* Editor & Upload Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {activeTab !== 'audio' ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم الملف الناتج</label>
                <input
                  type="text"
                  value={fileTitle}
                  onChange={(e) => setFileTitle(e.target.value)}
                  placeholder="اسم الملف..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Upload Trigger */}
              <div className="shrink-0">
                <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer transition">
                  <UploadCloud className="w-4 h-4 text-amber-400" />
                  <span>رفع ملف من جهازك</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">محتوى الملف للتحويل</label>
              <textarea
                rows={8}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="الصق المحتوى هنا أو ارفع ملفاً من جهازك..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500 transition resize-none leading-relaxed"
                dir="auto"
              />
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-500">
                طول المحتوى: {textContent.length} حرف | الترميز: UTF-8
              </span>

              <div className="flex items-center gap-2">
                {activeTab === 'text_pdf' && (
                  <button
                    onClick={() => handleConvert('pdf')}
                    disabled={isLoading || !textContent.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحويل إلى مستند PDF</span>
                  </button>
                )}

                {activeTab === 'csv_json' && (
                  <>
                    <button
                      onClick={() => handleConvert('json')}
                      disabled={isLoading || !textContent.trim()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <span>تحويل إلى JSON</span>
                    </button>
                    <button
                      onClick={() => handleConvert('csv')}
                      disabled={isLoading || !textContent.trim()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                    >
                      <span>تحويل إلى CSV</span>
                    </button>
                  </>
                )}

                {activeTab === 'md_html' && (
                  <button
                    onClick={() => handleConvert('html')}
                    disabled={isLoading || !textContent.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>توليد صفحة HTML مستقلة</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Audio Tone Generator */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white">معالج الصوتيات وتوليد الإشارات القياسية (RIFF/WAV)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                يقوم المحرك بتركيب ملف صوتي حقيقي مطابق لمواصفات WAV بدقة 44.1kHz وبصمة تشفير معتمدة
                لفحص سلامة مشغلات الصوت واستخراج المقاطع والوسائط.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">اسم المقطع الصوتي</label>
              <input
                type="text"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
                placeholder="اسم الملف الصوتي..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleConvert('wav')}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md disabled:opacity-50"
              >
                <Music className="w-4 h-4" />
                <span>توليد وتأكيد ملف WAV القياسي (44.1kHz)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
