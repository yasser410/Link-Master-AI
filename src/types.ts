export interface ProductItem {
  id: string;
  name: string;
  description: string;
  type: 'app' | 'document' | 'package' | 'image' | 'archive' | 'media';
  platform: 'Web' | 'PWA' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Cross-Platform';
  classification?: 'Source Project' | 'Intermediate Package' | 'Final Executable' | 'Signed Release';
  version: string;
  filename: string;
  filesize: number;
  mimeType: string;
  sha256: string;
  createdAt: string;
  sourceUrl?: string;
  sourceIdea?: string;
  interactiveUrl?: string;
  testStatus: {
    passed: boolean;
    integrityVerified: boolean;
    tests: Array<{ name: string; status: 'PASS' | 'FAIL'; details?: string }>;
  };
  installationInstructions: {
    ar: string;
    en: string;
  };
}

export interface BuildJob {
  id: string;
  title: string;
  category: 'url_conversion' | 'app_generation' | 'file_conversion' | 'media_process' | 'packaging';
  status: 'Created' | 'Queued' | 'Analyzing' | 'Building' | 'Testing' | 'Packaging' | 'Ready' | 'Failed' | 'Cancelled';
  progress: number;
  input: string;
  outputFormat: string;
  targetPlatform: string;
  assignedWorkerId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  productId?: string;
  logs: Array<{ timestamp: string; phase: string; message: string; type: 'info' | 'warn' | 'error' | 'success' }>;
  error?: string;
}

export interface WorkerItem {
  id: string; // WRK-01 to WRK-17
  name: string;
  engineId: string;
  engineName: string;
  status: 'IDLE' | 'BUSY' | 'FAILED' | 'OFFLINE' | 'DISABLED';
  currentJobId: string | null;
  currentJobTitle: string | null;
  uptimeSeconds: number;
  cpuPercent: number;
  memoryMb: number;
  processedJobs: number;
  lastError: string | null;
}

export interface EngineSetting {
  id: string;
  name: string;
  code: string;
  description: string;
  enabled: boolean;
  activeWorkers: number;
  totalProcessed: number;
  successRate: number;
}

export interface AIProviderConfig {
  id: string;
  name: string;
  provider: 'gemini' | 'openai' | 'groq' | 'deepseek' | 'local';
  model: string;
  status: 'active' | 'configured' | 'offline';
  latencyMs: number;
  isDefault: boolean;
  pricingInfo: string;
}

export interface PackagingSpec {
  id: string;
  platform: 'PWA' | 'Android APK' | 'Android AAB' | 'Windows EXE' | 'macOS DMG' | 'Linux AppImage';
  classification: 'Source Project' | 'Intermediate Package' | 'Final Executable' | 'Signed Release';
  buildEnvironment: string;
  signingStatus: 'Pre-Signed' | 'Self-Signed Keystore' | 'Apple Developer ID Required' | 'Not Signed';
  artifactFormat: string;
  requirements: string;
  available: boolean;
}

export interface SecurityAuditItem {
  id: string;
  timestamp: string;
  event: string;
  target: string;
  action: 'BLOCKED' | 'FLAGGED' | 'ALLOWED';
  reason: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AdminStats {
  supervisor: string;
  platform: string;
  brand: string;
  activeWorkersTotal: number;
  queueCount: number;
  completedJobs: number;
  failedJobs: number;
  totalProducts: number;
  engines: EngineSetting[];
  aiProviders: AIProviderConfig[];
  workers: WorkerItem[];
  storage: {
    usedBytes: number;
    quotaBytes: number;
    totalDownloads: number;
  };
}

export interface SystemTestResult {
  id: string;
  category: 'Security' | 'URL Engine' | 'App Builder' | 'File Converter' | 'Integrity' | 'Workers' | 'Packaging' | 'Storage';
  name: string;
  status: 'PASS' | 'FAIL' | 'NOT_TESTED';
  durationMs: number;
  details: string;
}

export interface SystemTestReport {
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  results: SystemTestResult[];
}
