import React, { useState } from 'react';
import {
  Archive,
  Download,
  Play,
  CheckCircle2,
  ShieldCheck,
  Search,
  Filter,
  Copy,
  Check,
  FileText,
  ExternalLink,
  HardDrive,
  Info,
  Hash,
} from 'lucide-react';
import { ProductItem } from '../types';

interface ProductsVaultViewProps {
  products: ProductItem[];
  onOpenPreview: (url: string, title: string) => void;
  onRefreshProducts: () => void;
  lang: 'ar' | 'en';
}

export const ProductsVaultView: React.FC<ProductsVaultViewProps> = ({
  products,
  onOpenPreview,
  onRefreshProducts,
  lang,
}) => {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.filename.toLowerCase().includes(search.toLowerCase()) ||
      p.sha256.toLowerCase().includes(search.toLowerCase());

    const matchesPlatform = platformFilter === 'ALL' || p.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* Vault Title Header */}
      <div className="border-b border-[#454943] pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#B76E45] text-[#F1EBDD] font-mono text-[10px] font-bold">
              VAULT PERSISTENCE: ON-DISK DIRECTORY /storage/files
            </span>
            <span className="text-xs font-mono text-emerald-400">100% VERIFIED AUTHENTIC ARTIFACTS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-mono uppercase text-[#F1EBDD]">
            {lang === 'ar' ? 'خزينة المنتجات الرقمية المصنّعة' : 'DIGITAL PRODUCT VAULT'}
          </h1>
          <p className="text-xs sm:text-sm text-[#AAA99F] font-mono mt-1">
            {lang === 'ar'
              ? 'جميع الملفات والبرمجيات مخزنة فيزيائياً مع بصمات SHA-256 قابلة للتحقق، وروابط تنزيل مباشرة بدون وسيط.'
              : 'Physical artifacts stored with verified SHA-256 cryptographic signatures and direct streaming download.'}
          </p>
        </div>

        <button
          onClick={onRefreshProducts}
          className="px-4 py-2 border border-[#454943] hover:border-[#C69B70] text-[#F1EBDD] font-mono text-xs font-bold uppercase transition cursor-pointer"
        >
          {lang === 'ar' ? 'تحديث الخزينة' : 'REFRESH VAULT'}
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#AAA99F] absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث بالاسم، الملف، أو بصمة SHA-256...' : 'Search by name, file, or SHA-256...'}
            className="w-full bg-[#292D2B] border border-[#454943] text-[#F1EBDD] pr-10 pl-4 py-2.5 text-xs font-mono focus:border-[#B76E45] focus:outline-none placeholder-[#6E7067]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {['ALL', 'Web', 'PWA', 'Android', 'Cross-Platform'].map((plt) => (
            <button
              key={plt}
              onClick={() => setPlatformFilter(plt)}
              className={`px-3 py-1.5 border transition cursor-pointer whitespace-nowrap ${
                platformFilter === plt
                  ? 'border-[#B76E45] bg-[#B76E45] text-[#F1EBDD] font-bold'
                  : 'border-[#454943] bg-[#292D2B] text-[#AAA99F] hover:text-[#F1EBDD]'
              }`}
            >
              {plt}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 border border-[#454943] bg-[#292D2B] text-center space-y-2 font-mono text-xs text-[#AAA99F]">
          <Archive className="w-8 h-8 text-[#6E7067] mx-auto mb-2" />
          <p>{lang === 'ar' ? 'لا توجد منتجات تطابق معايير البحث الحالية.' : 'No manufactured products match current criteria.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prod) => (
            <div
              key={prod.id}
              className="p-5 border border-[#454943] bg-[#292D2B] hover:border-[#6E7067] transition flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Platform, Classification & Size */}
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="px-2 py-0.5 bg-[#202322] border border-[#B76E45]/40 text-[#C69B70] font-bold">
                    {prod.platform}
                  </span>
                  <span className="text-[#AAA99F]">
                    {(prod.filesize / 1024).toFixed(1)} KB
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#F1EBDD] font-mono line-clamp-1">{prod.name}</h3>
                <p className="text-xs text-[#AAA99F] mt-1.5 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>

                {/* Classification badge if present */}
                {prod.classification && (
                  <div className="mt-2 text-[10px] font-mono text-emerald-400">
                    TYPE: {prod.classification}
                  </div>
                )}

                {/* SHA-256 Box with Copy */}
                <div className="mt-3 p-2.5 bg-[#202322] border border-[#454943] flex items-center justify-between gap-2 text-[10px] font-mono text-[#AAA99F]">
                  <div className="truncate flex-1">
                    <span className="text-[#C69B70]">SHA256: </span>
                    {prod.sha256}
                  </div>
                  <button
                    onClick={() => handleCopyHash(prod.sha256)}
                    className="hover:text-[#F1EBDD] transition cursor-pointer p-1"
                    title="Copy SHA-256 Hash"
                  >
                    {copiedHash === prod.sha256 ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Actions Bottom Bar */}
              <div className="pt-4 border-t border-[#454943] flex items-center justify-between gap-2">
                <a
                  href={`/api/download/${prod.id}`}
                  download={prod.filename}
                  className="px-4 py-2 bg-[#B76E45] hover:bg-[#A65F3C] text-[#F1EBDD] font-mono font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تنزيل مباشر' : 'DOWNLOAD'}</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedProduct(prod)}
                    className="p-2 border border-[#454943] hover:border-[#AAA99F] text-[#AAA99F] hover:text-[#F1EBDD] transition cursor-pointer"
                    title="عرض التفاصيل والمواصفات"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  {prod.interactiveUrl && (
                    <button
                      onClick={() => onOpenPreview(prod.interactiveUrl!, prod.name)}
                      className="px-3 py-2 border border-[#454943] hover:border-[#C69B70] text-[#F1EBDD] font-mono text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-[#C69B70]" />
                      <span>{lang === 'ar' ? 'تشغيل' : 'LAUNCH'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspector Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#292D2B] border border-[#454943] p-6 space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#454943] pb-3">
              <h3 className="text-sm font-bold text-[#F1EBDD]">{selectedProduct.name}</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-[#AAA99F] hover:text-[#F1EBDD] text-sm cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-[#AAA99F]">
              <div>
                <strong className="text-[#F1EBDD]">Filename:</strong> {selectedProduct.filename}
              </div>
              <div>
                <strong className="text-[#F1EBDD]">Size:</strong> {selectedProduct.filesize} bytes (
                {(selectedProduct.filesize / 1024).toFixed(2)} KB)
              </div>
              <div>
                <strong className="text-[#F1EBDD]">MIME Type:</strong> {selectedProduct.mimeType}
              </div>
              <div>
                <strong className="text-[#F1EBDD]">SHA-256:</strong>{' '}
                <span className="text-[#C69B70] break-all">{selectedProduct.sha256}</span>
              </div>
              <div>
                <strong className="text-[#F1EBDD]">Installation Instructions:</strong>
                <p className="mt-1 p-3 bg-[#202322] border border-[#454943] text-[11px] leading-relaxed whitespace-pre-line text-[#F1EBDD]">
                  {lang === 'ar'
                    ? selectedProduct.installationInstructions?.ar
                    : selectedProduct.installationInstructions?.en}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#454943] flex justify-end gap-3">
              <a
                href={`/api/download/${selectedProduct.id}`}
                download={selectedProduct.filename}
                className="px-4 py-2 bg-[#B76E45] text-[#F1EBDD] font-bold cursor-pointer"
              >
                {lang === 'ar' ? 'تنزيل الملف الآن' : 'DOWNLOAD ARTIFACT'}
              </a>
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 border border-[#454943] text-[#AAA99F] hover:text-[#F1EBDD] cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'CLOSE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
