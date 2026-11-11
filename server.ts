import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  getAllProducts,
  getProduct,
  getAllJobs,
  getJob,
  getEngines,
  toggleEngine,
  getAiProviders,
  getStorageStats,
  recordDownload,
  getPhysicalFilePath,
  getAllWorkers,
  resetWorker,
  getSecurityLogs,
} from './server/storage.js';
import { submitJob, cancelJob, retryJob } from './server/jobQueue.js';
import { analyzeUrl } from './server/urlConverter.js';
import { generateAppFromIdea, modifyAppWithPrompt } from './server/appBuilder.js';
import { safeUnshorten, validateSafeUrl } from './server/security.js';
import { runAutomatedSystemSuite } from './server/testRunner.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// 1. Job Queue APIs
app.get('/api/jobs', (req, res) => {
  const jobs = getAllJobs();
  res.json({ success: true, jobs });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, error: 'المهمة غير موجودة' });
  }
  res.json({ success: true, job });
});

app.post('/api/jobs', async (req, res) => {
  try {
    const { title, category, input, outputFormat, targetPlatform, payload } = req.body;
    if (!input) {
      return res.status(400).json({ success: false, error: 'يجب تقديم المدخلات المطلوبة' });
    }

    const job = await submitJob(
      title || 'مهمة بناء جديدة',
      category || 'url_conversion',
      input,
      outputFormat || 'pdf',
      targetPlatform || 'Web',
      payload
    );

    res.json({ success: true, job });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/jobs/:id/cancel', (req, res) => {
  const success = cancelJob(req.params.id);
  res.json({ success });
});

app.post('/api/jobs/:id/retry', (req, res) => {
  const job = retryJob(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, error: 'تعذر إعادة المحاولة' });
  }
  res.json({ success: true, job });
});

// 2. URL Analysis & Unshorten
app.post('/api/convert/url/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, error: 'الرابط مطلوب' });

    const analysis = await analyzeUrl(url);
    res.json({ success: true, analysis });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/tools/unshorten', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, error: 'الرابط مطلوب' });

    const result = await safeUnshorten(url);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 3. AI App Builder
app.post('/api/app/build', async (req, res) => {
  try {
    const { idea, appName, platform } = req.body;
    if (!idea) return res.status(400).json({ success: false, error: 'وصف الفكرة مطلوب' });

    const job = await submitJob(
      appName || 'تطبيق جديد من فكرة',
      'app_generation',
      idea,
      'app',
      platform || 'Web'
    );

    res.json({ success: true, job });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/app/modify', async (req, res) => {
  try {
    const { html, instruction, appName } = req.body;
    if (!html || !instruction) {
      return res.status(400).json({ success: false, error: 'الكود والتعليمات مطلوبة' });
    }

    const updated = await modifyAppWithPrompt(html, instruction, appName || 'تطبيق');
    res.json({ success: true, updatedHtml: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Products & Real Direct Download
app.get('/api/products', (req, res) => {
  const products = getAllProducts();
  res.json({ success: true, products });
});

app.get('/api/products/:id', (req, res) => {
  const product = getProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'المنتج غير موجود' });
  }
  res.json({ success: true, product });
});

// REAL STREAMING DOWNLOAD (Strict rule: verify file exists on disk)
app.get('/api/download/:id', (req, res) => {
  const product = getProduct(req.params.id);
  if (!product) {
    return res.status(404).send('المنتج المطلوب غير موجود');
  }

  const filepath = getPhysicalFilePath(product.filename);
  if (!filepath || !fs.existsSync(filepath)) {
    return res.status(404).send('ملف المنتج غير متوفر في التخزين السحابي');
  }

  recordDownload(product.id);

  // Set real headers with RFC 5987 Unicode filename support
  const safeAscii = product.filename.replace(/[^\x20-\x7E]/g, '_');
  const encodedName = encodeURIComponent(product.filename);
  res.setHeader('Content-Disposition', `attachment; filename="${safeAscii}"; filename*=UTF-8''${encodedName}`);
  res.setHeader('Content-Type', product.mimeType || 'application/octet-stream');
  res.setHeader('X-Checksum-Sha256', product.sha256);

  const stream = fs.createReadStream(filepath);
  stream.pipe(res);
});

// Serve interactive app preview
app.get('/api/apps/preview/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filepath = getPhysicalFilePath(filename);
  if (!filepath || !fs.existsSync(filepath)) {
    return res.status(404).send('التطبيق غير موجود');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  fs.createReadStream(filepath).pipe(res);
});

// 5. Admin & Systems Dashboard
app.get('/api/admin/stats', (req, res) => {
  const engines = getEngines();
  const aiProviders = getAiProviders();
  const storage = getStorageStats();
  const allJobs = getAllJobs();
  const allProducts = getAllProducts();
  const workers = getAllWorkers();

  res.json({
    success: true,
    supervisor: 'الحاج ياسر - El Hag Yasser',
    platform: 'Yasser Universal Builder',
    brand: 'THE DIGITAL FOUNDRY',
    activeWorkersTotal: workers.filter((w) => w.status === 'IDLE' || w.status === 'BUSY').length,
    queueCount: allJobs.filter((j) => j.status === 'Queued' || j.status === 'Analyzing' || j.status === 'Building').length,
    completedJobs: allJobs.filter((j) => j.status === 'Ready').length,
    failedJobs: allJobs.filter((j) => j.status === 'Failed').length,
    totalProducts: allProducts.length,
    engines,
    aiProviders,
    workers,
    storage,
  });
});

app.get('/api/workers', (req, res) => {
  res.json({ success: true, workers: getAllWorkers() });
});

app.post('/api/workers/:id/reset', (req, res) => {
  const reset = resetWorker(req.params.id);
  if (!reset) return res.status(404).json({ success: false, error: 'العامل غير موجود' });
  res.json({ success: true, worker: reset });
});

app.get('/api/security/logs', (req, res) => {
  res.json({ success: true, logs: getSecurityLogs() });
});

app.get('/api/packaging/specs', (req, res) => {
  const specs = [
    {
      id: 'spec-pwa',
      platform: 'PWA',
      classification: 'Final Executable',
      buildEnvironment: 'Web Standards / Chromium & WebKit',
      signingStatus: 'Pre-Signed',
      artifactFormat: 'Web App Manifest & Service Worker Bundle (.zip)',
      requirements: 'HTTPS Hosting & Modern Browser',
      available: true,
    },
    {
      id: 'spec-android-proj',
      platform: 'Android APK',
      classification: 'Source Project',
      buildEnvironment: 'Android SDK 34 / Gradle 8.x / Java 17',
      signingStatus: 'Self-Signed Keystore',
      artifactFormat: 'Complete Android Capacitor/Cordova Project (.zip)',
      requirements: 'Android Studio or ./gradlew assembleRelease',
      available: true,
    },
    {
      id: 'spec-windows',
      platform: 'Windows EXE',
      classification: 'Intermediate Package',
      buildEnvironment: 'Microsoft Edge WebView2 / PowerShell Host',
      signingStatus: 'Not Signed',
      artifactFormat: 'Windows Desktop Launcher Script & Shell (.zip)',
      requirements: 'Windows 10 / 11 with Edge WebView2',
      available: true,
    },
    {
      id: 'spec-linux',
      platform: 'Linux AppImage',
      classification: 'Intermediate Package',
      buildEnvironment: 'X11 / Wayland Chromium Webview Wrapper',
      signingStatus: 'Not Signed',
      artifactFormat: 'Linux Desktop Shell & .desktop Launcher (.zip)',
      requirements: 'Linux Kernel 5.x+ with xdg-open or Chromium',
      available: true,
    },
    {
      id: 'spec-macos',
      platform: 'macOS DMG',
      classification: 'Intermediate Package',
      buildEnvironment: 'macOS WebKit Native Shell',
      signingStatus: 'Apple Developer ID Required',
      artifactFormat: 'macOS Command Script & App Wrapper (.zip)',
      requirements: 'macOS 12+ (Full DMG notarization requires Apple Developer Certificate)',
      available: true,
    },
  ];
  res.json({ success: true, specs });
});

app.post('/api/admin/engines/:id/toggle', (req, res) => {
  const { enabled } = req.body;
  const updated = toggleEngine(req.params.id, Boolean(enabled));
  if (!updated) {
    return res.status(404).json({ success: false, error: 'المحرك غير موجود' });
  }
  res.json({ success: true, engine: updated });
});

app.get('/api/admin/ai-providers', (req, res) => {
  res.json({ success: true, providers: getAiProviders() });
});

// 6. Automated Acceptance Test Suite
app.post('/api/system/tests/run', async (req, res) => {
  try {
    const report = await runAutomatedSystemSuite();
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Storage Metrics
app.get('/api/storage/stats', (req, res) => {
  res.json({ success: true, stats: getStorageStats() });
});

// -------------------------------------------------------------
// FRONTEND SERVER / VITE INTEGRATION
// -------------------------------------------------------------
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`  YASSER UNIVERSAL BUILDER (El Hag Yasser)`);
    console.log(`  Server running on http://0.0.0.0:${PORT}`);
    console.log(`====================================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal: Failed to start server:', err);
  process.exit(1);
});
