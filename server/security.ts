import net from 'net';
import dns from 'dns';
import { promisify } from 'util';

const lookupAsync = promisify(dns.lookup);

/**
 * Validates URLs and checks against SSRF (Server-Side Request Forgery) attacks.
 * Blocks access to private subnets, loopbacks, link-local and cloud metadata addresses.
 */
export async function validateSafeUrl(rawUrl: string): Promise<{ safe: boolean; error?: string; url?: URL }> {
  try {
    const parsed = new URL(rawUrl);

    // Only allow http and https
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, error: 'بروتوكول غير مدعوم. يُسمح فقط بـ http و https' };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block standard local hostnames
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname === 'metadata.google.internal' ||
      hostname === 'instance-data'
    ) {
      return { safe: false, error: 'ممنوع: محاولة الوصول إلى نطاق محلي أو خاص (SSRF Protection)' };
    }

    // Resolve IP address
    let ip = hostname;
    if (!net.isIP(hostname)) {
      try {
        const res = await lookupAsync(hostname);
        ip = res.address;
      } catch (err: any) {
        return { safe: false, error: `تعذر الوصول إلى النطاق: ${err.message || 'DNS lookup failed'}` };
      }
    }

    // Check if IP is private or restricted
    if (isPrivateOrRestrictedIP(ip)) {
      return {
        safe: false,
        error: `ممنوع أمنياً: عنوان IP (${ip}) ينتمي إلى شبكة خاصة أو نطاق خوادم محظور (SSRF Blocked)`,
      };
    }

    return { safe: true, url: parsed };
  } catch (err: any) {
    return { safe: false, error: 'رابط غير صالح: تأكد من كتابة الرابط بشكل صحيح مع http:// أو https://' };
  }
}

/**
 * Checks if an IP is within private ranges:
 * - 127.0.0.0/8 (Loopback)
 * - 10.0.0.0/8 (Private)
 * - 172.16.0.0/12 (Private)
 * - 192.168.0.0/16 (Private)
 * - 169.254.0.0/16 (Link-local & AWS/GCP/Azure Metadata: 169.254.169.254)
 * - 0.0.0.0/8
 * - IPv6 ::1, fe80::/10, fc00::/7
 */
export function isPrivateOrRestrictedIP(ip: string): boolean {
  if (ip === '::1' || ip === '0:0:0:0:0:0:0:1') return true;

  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map((p) => parseInt(p, 10));
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return true; // Malformed IPv4
    }

    const [a, b] = parts;

    // 0.0.0.0/8
    if (a === 0) return true;
    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;
    // 10.0.0.0/8 (Private class A)
    if (a === 10) return true;
    // 172.16.0.0/12 (Private class B)
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.168.0.0/16 (Private class C)
    if (a === 192 && b === 168) return true;
    // 169.254.0.0/16 (Link-local & Cloud Metadata)
    if (a === 169 && b === 254) return true;
    // 100.64.0.0/10 (Carrier-grade NAT)
    if (a === 100 && b >= 64 && b <= 127) return true;
  } else if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower.startsWith('fe80:') || lower.startsWith('fc') || lower.startsWith('fd')) {
      return true;
    }
  }

  return false;
}

/**
 * Unshorten a URL safely following redirects step by step
 */
export async function safeUnshorten(initialUrl: string, maxRedirects = 5): Promise<{
  finalUrl: string;
  chain: string[];
  isSafe: boolean;
  error?: string;
}> {
  let current = initialUrl;
  const chain: string[] = [initialUrl];

  for (let i = 0; i < maxRedirects; i++) {
    const check = await validateSafeUrl(current);
    if (!check.safe) {
      return { finalUrl: current, chain, isSafe: false, error: check.error };
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(current, {
        method: 'HEAD',
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          'User-Agent': 'YasserUniversalBuilder-Bot/1.0 (+https://yasserbuilder.local)',
        },
      });
      clearTimeout(timeout);

      const location = res.headers.get('location');
      if (res.status >= 300 && res.status < 400 && location) {
        const nextUrl = new URL(location, current).href;
        chain.push(nextUrl);
        current = nextUrl;
      } else {
        break; // Reached final destination
      }
    } catch {
      break;
    }
  }

  const finalCheck = await validateSafeUrl(current);
  return {
    finalUrl: current,
    chain,
    isSafe: finalCheck.safe,
    error: finalCheck.error,
  };
}
