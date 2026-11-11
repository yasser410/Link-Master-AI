import crypto from 'crypto';

export interface FileConversionResult {
  filename: string;
  buffer: Buffer;
  mimeType: string;
  sha256: string;
  size: number;
}

/**
 * Converts text or markdown to valid PDF document
 */
export function convertTextToPdf(text: string, title = 'مستند محول'): FileConversionResult {
  const sanitize = (str: string) => str.replace(/[()\\]/g, ' ').replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ');
  const cleanTitle = sanitize(title.slice(0, 80));
  const dateStr = sanitize(new Date().toUTCString());

  const lines = text.split('\n').slice(0, 45);

  let streamText = `BT\n/F1 16 Tf\n50 780 Td\n(${cleanTitle}) Tj\nET\n`;
  streamText += `BT\n/F2 9 Tf\n50 762 Td\n(Exported by YASSER UNIVERSAL BUILDER - ${dateStr}) Tj\nET\n`;

  let currentY = 720;
  for (const rawLine of lines) {
    const clean = sanitize(rawLine.trim().slice(0, 100));
    if (clean.length > 0) {
      streamText += `BT\n/F2 10 Tf\n50 ${currentY} Td\n(${clean}) Tj\nET\n`;
    }
    currentY -= 14;
    if (currentY < 50) break;
  }

  const streamLength = Buffer.byteLength(streamText, 'utf-8');

  const pdfBody = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 595 842]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
      /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
    >>
  >>
>>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamText}
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000340 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
${420 + streamLength}
%%EOF`;

  const buffer = Buffer.from(pdfBody, 'utf-8');
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

  return {
    filename: `${title.replace(/\s+/g, '_')}_converted.pdf`,
    buffer,
    mimeType: 'application/pdf',
    sha256,
    size: buffer.length,
  };
}

/**
 * Converts CSV to JSON and JSON to CSV
 */
export function convertCsvToJson(csvText: string): FileConversionResult {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length === 0) {
    throw new Error('الملف فارغ ولا يحتوي على أسطر CSV صالحة');
  }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
    if (values.length === headers.length) {
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx];
      });
      rows.push(obj);
    }
  }

  const jsonStr = JSON.stringify(rows, null, 2);
  const buffer = Buffer.from(jsonStr, 'utf-8');
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

  return {
    filename: 'converted_dataset.json',
    buffer,
    mimeType: 'application/json',
    sha256,
    size: buffer.length,
  };
}

export function convertJsonToCsv(jsonText: string): FileConversionResult {
  const parsed = JSON.parse(jsonText);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('يجب أن يحتوي ملف JSON على مصفوفة من العناصر ليتم تحويله إلى CSV');
  }

  const headers = Object.keys(parsed[0]);
  let csv = headers.join(',') + '\n';

  for (const item of parsed) {
    const row = headers.map((h) => {
      const val = item[h] !== undefined ? String(item[h]).replace(/"/g, '""') : '';
      return `"${val}"`;
    });
    csv += row.join(',') + '\n';
  }

  const buffer = Buffer.from(csv, 'utf-8');
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

  return {
    filename: 'converted_table.csv',
    buffer,
    mimeType: 'text/csv',
    sha256,
    size: buffer.length,
  };
}

/**
 * Converts Markdown to Clean Standalone HTML
 */
export function convertMarkdownToHtml(mdText: string, title = 'مستند محول'): FileConversionResult {
  let htmlBody = mdText
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-amber-400 mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-amber-500 mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold text-white mb-4 border-b border-slate-700 pb-2">$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-amber-400 hover:underline" target="_blank">$1</a>')
    .replace(/^\s*-\s+(.*)$/gim, '<li class="mr-4 list-disc">$1</li>')
    .replace(/\n$/gim, '<br />');

  const fullHtml = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | Yasser Universal Builder</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen py-10 px-4 sm:px-8">
  <div class="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
    <div class="flex items-center justify-between text-xs text-slate-400 mb-6 border-b border-slate-800 pb-3">
      <span>Yasser Universal Builder</span>
      <span>${new Date().toLocaleDateString('ar-EG')}</span>
    </div>
    <div class="prose prose-invert max-w-none">
      ${htmlBody}
    </div>
  </div>
</body>
</html>`;

  const buffer = Buffer.from(fullHtml, 'utf-8');
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

  return {
    filename: `${title.replace(/\s+/g, '_')}.html`,
    buffer,
    mimeType: 'text/html',
    sha256,
    size: buffer.length,
  };
}

/**
 * Creates a valid RIFF WAV audio buffer with standard 44.1kHz stereo/mono headers
 */
export function generateValidWavBuffer(seconds = 3, frequency = 440): Buffer {
  const sampleRate = 44100;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = sampleRate * seconds;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = numSamples * blockAlign;
  const chunkSize = 36 + dataSize;

  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(chunkSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate gentle pleasant sine chime with decay
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-1.5 * t); // smooth decay
    const sample = Math.sin(2 * Math.PI * frequency * t) * envelope;
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  return buffer;
}
