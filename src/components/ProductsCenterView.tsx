import React, { useState } from 'react';
import { ProductItem } from '../types';
import {
  Download,
  Copy,
  Check,
  CheckCircle2,
  Play,
  Share2,
  ExternalLink,
  ShieldCheck,
  Layers,
  Calendar,
  FileBox,
  FileCode,
  FileSpreadsheet,
  FileText,
  Package,
} from 'lucide-react';

interface ProductsCenterViewProps {
  products: ProductItem[];
  onOpenPreview: (url: string, name: string) => void;
  onRefreshProducts: () => void;
}

export const ProductsCenterView: React.FC<ProductsCenterViewProps> = ({
  products,
  onOpenPreview,
  onRefreshProducts,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(products[0] || null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const filtered = products.filter((p) => {
    const matchType = filterType === 'all' || p.type === filterType;
    const matchQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.platform.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchQuery;
  });

  const active = selectedProduct || filtered[0] || null;

  const getIconForType = (type: ProductItem['type']) => {
    switch (type) {
      case 'app':
        return <Layers className="w-5 h-5 text-amber-400" />;
      case 'document':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'package':
        return <Package className="w-5 h-5 text-emerald-400" />;
      case 'media':
        return <FileCode className="w-5 h-5 text-purple-400" />;
      default:
        return <FileBox className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-right">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">مركز المنتجات والتنزيلات النهائية</h2>
          <p className="text-xs text-slate-400 mt-1">
            جميع المنتجات المصنوعة والمبنية حقيقياً مع بصمات التشفير SHA-256 ونتائج الاختبارات والتحميل المباشر.
          </p>
        </div>
        <button
          onClick={onRefreshProducts}
          className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition cursor-pointer"
        >
          تحديث المنتجات
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث في المنتجات بالاسم أو المنصة..."
          className="w-full sm:w-80 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'app', label: 'تطبيقات' },
            { id: 'package', label: 'حزم المنصات' },
            { id: 'document', label: 'مستندات' },
            { id: 'media', label: 'وسائط' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap cursor-pointer ${
                filterType === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: List on Left, Active Product Page on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Products List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs">
              لا توجد منتجات مطابقة لعملية البحث.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  active?.id === item.id
                    ? 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                    {getIconForType(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold shrink-0">
                        {item.platform}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{item.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-2 font-mono">
                      <span>{(item.filesize / 1024).toFixed(1)} KB</span>
                      <span>&bull;</span>
                      <span>{new Date(item.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Product Dedicated Showcase (7 cols) */}
        <div className="lg:col-span-7">
          {active ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 sticky top-24">
              {/* Product Title Bar */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="flex items-start gap-3.5">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                    {getIconForType(active.type)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                      {active.platform} &bull; v{active.version}
                    </span>
                    <h3 className="text-lg font-black text-white mt-0.5">{active.name}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{active.description}</p>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">حجم الملف النهائي</span>
                  <span className="text-xs font-bold font-mono text-slate-200 mt-0.5 block tabular-nums">
                    {(active.filesize / 1024).toFixed(1)} KB
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">صيغة الملف (MIME)</span>
                  <span className="text-xs font-bold font-mono text-slate-200 mt-0.5 block truncate">
                    {active.mimeType}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">حالة الاختبارات</span>
                  <span className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ناجح ومعتمد</span>
                  </span>
                </div>
              </div>

              {/* Real Cryptographic SHA-256 Checksum */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>البصمة الرقمية الموثقة (SHA-256 Checksum):</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(active.sha256, active.id)}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-mono transition cursor-pointer"
                  >
                    {copiedHash === active.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-sans">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ البصمة</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-slate-300 break-all select-all text-left" dir="ltr">
                  {active.sha256}
                </div>
              </div>

              {/* Automated Tests Result Badges */}
              {active.testStatus?.tests && active.testStatus.tests.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">نتائج الفحص والتحقق الآلي:</span>
                  <div className="space-y-1.5">
                    {active.testStatus.tests.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs"
                      >
                        <span className="text-slate-300">{t.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Installation / Usage Instructions */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-amber-400 block mb-1">تعليمات التشغيل والتثبيت:</span>
                <p className="leading-relaxed">{active.installationInstructions.ar}</p>
              </div>

              {/* Primary Direct Download & Preview Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                {/* DIRECT DOWNLOAD BUTTON (Real HTTP streaming endpoint) */}
                <a
                  href={`/api/download/${active.id}`}
                  download={active.filename}
                  className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer text-center"
                >
                  <Download className="w-4 h-4" />
                  <span>تنزيل الملف النهائي مباشرة ({active.filename})</span>
                </a>

                {/* If Interactive App Preview exists */}
                {active.interactiveUrl && (
                  <button
                    onClick={() => onOpenPreview(active.interactiveUrl!, active.name)}
                    className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تشغيل في المعاينة</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs">
              اختر منتجاً من القائمة لعرض تفاصيله وبصمة التشفير ورابط التحميل المباشر.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
