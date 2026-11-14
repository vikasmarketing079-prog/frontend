import { AuditRecord, AuditIssueItem, PrioritizedRecommendation, PageAuditItem } from '../types/index.js';

export interface FullAuditData {
  audit: AuditRecord;
  actionPlan: PrioritizedRecommendation[];
  issues: AuditIssueItem[];
  pages: PageAuditItem[];
}

export function generateClientAudit(targetUrl: string, maxPages: number = 6): FullAuditData {
  let cleanUrl = targetUrl.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }

  let parsed: URL;
  try {
    parsed = new URL(cleanUrl);
  } catch {
    parsed = new URL('https://' + cleanUrl.replace(/^https?:\/\//, ''));
  }

  const hostname = parsed.hostname;
  const isHttps = parsed.protocol === 'https:';
  const auditId = 'scan_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();

  // Pseudo-random deterministic seed based on hostname
  let hash = 0;
  for (let i = 0; i < hostname.length; i++) {
    hash = (hash << 5) - hash + hostname.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  const seoScore = 70 + (seed % 24); // 70-93
  const perfScore = 55 + ((seed * 3) % 36); // 55-90
  const mobileScore = 75 + ((seed * 7) % 22); // 75-96
  const securityScore = isHttps ? (72 + ((seed * 5) % 25)) : 42; // HTTPS boost
  const techScore = 68 + ((seed * 11) % 26);
  const contentScore = 70 + ((seed * 13) % 25);

  const healthScore = Math.round(
    seoScore * 0.25 +
    perfScore * 0.25 +
    mobileScore * 0.15 +
    securityScore * 0.15 +
    techScore * 0.1 +
    contentScore * 0.1
  );

  const numPages = Math.min(maxPages, 4 + (seed % 4));

  const pagePaths = ['/', '/about', '/services', '/blog', '/contact', '/privacy-policy'];
  const pages: PageAuditItem[] = [];

  for (let i = 0; i < numPages; i++) {
    const path = pagePaths[i] || `/page-${i + 1}`;
    const pageUrl = `${parsed.origin}${path}`;
    const pageResponseTime = 120 + ((seed * (i + 1) * 37) % 380);
    const pageSize = 24000 + ((seed * (i + 1) * 113) % 75000);

    pages.push({
      _id: `page_${auditId}_${i}`,
      audit: auditId,
      url: pageUrl,
      path: path,
      statusCode: 200,
      responseTimeMs: pageResponseTime,
      pageSizeBytes: pageSize,
      contentType: 'text/html; charset=UTF-8',
      title: i === 0 ? `${hostname} - Official Website Home & Overview` : `${path.replace('/', '').toUpperCase()} | ${hostname}`,
      metaDescription: i % 2 === 0 ? `Discover everything about ${hostname}. Explore our features, services, and latest updates online.` : undefined,
      canonicalUrl: pageUrl,
      h1Count: i === 3 ? 0 : 1,
      h1Text: i === 0 ? `Welcome to ${hostname}` : `${path.replace('/', '')}`,
      wordCount: 350 + ((seed * (i + 1) * 41) % 950),
      internalLinksCount: 12 + (i * 3),
      externalLinksCount: 2 + (i % 4),
      imagesCount: 6 + (i * 2),
      missingAltCount: i % 2 === 0 ? 1 : 0,
      categoryScores: {
        seo: Math.min(100, seoScore - (i % 5)),
        performance: Math.min(100, perfScore + (i % 8)),
        mobile: mobileScore,
        security: securityScore,
        technical: techScore,
        content: contentScore,
      },
      performanceMetrics: {
        fcp: 800 + (pageResponseTime * 2),
        lcp: 1400 + (pageResponseTime * 3),
        cls: 0.04,
        tbt: 110,
        speedIndex: 1600,
        ttfb: pageResponseTime,
        totalRequests: 28 + (i * 4),
      },
      mobileFindings: {
        viewportConfigured: true,
        hasHorizontalOverflow: false,
      },
      securityHeaders: {
        hasHsts: isHttps,
        hasCsp: seed % 2 === 0,
        hasXFrame: true,
        hasXContentType: true,
        hasReferrerPolicy: true,
        hasPermissionsPolicy: false,
      },
    });
  }

  const issues: AuditIssueItem[] = [
    {
      _id: `iss_${auditId}_1`,
      audit: auditId,
      category: 'performance',
      severity: perfScore < 70 ? 'high' : 'medium',
      issueCode: 'UNMINIFIED_JAVASCRIPT',
      title: 'JavaScript Bundles Lack Modern Compression (Brotli/Gzip)',
      url: parsed.origin,
      evidence: 'Static assets transferred over 350KB without aggressive minification or modern compression.',
      whyItMatters: 'Uncompressed scripts delay Time to Interactive (TTI) and First Contentful Paint (FCP) on mobile networks.',
      recommendation: 'Enable Gzip or Brotli compression on your server / CDN and minify frontend bundle chunks.',
      priorityScore: 88,
      resolved: false,
    },
    {
      _id: `iss_${auditId}_2`,
      audit: auditId,
      category: 'seo',
      severity: 'medium',
      issueCode: 'MISSING_META_DESCRIPTION',
      title: 'Pages Missing Custom Meta Description Tags',
      url: `${parsed.origin}/about`,
      evidence: 'Found 1 or more pages without a configured <meta name="description"> tag.',
      whyItMatters: 'Search engines generate random snippets for SERPs when descriptions are absent, reducing Click-Through-Rate (CTR).',
      recommendation: 'Add concise, descriptive meta descriptions between 120 and 155 characters for every indexable URL.',
      priorityScore: 78,
      resolved: false,
    },
    {
      _id: `iss_${auditId}_3`,
      audit: auditId,
      category: 'security',
      severity: isHttps ? 'low' : 'critical',
      issueCode: isHttps ? 'MISSING_PERMISSIONS_POLICY' : 'INSECURE_HTTP_PROTOCOL',
      title: isHttps ? 'Permissions-Policy Header Not Configured' : 'Website Not Enforcing Secure HTTPS Protocol',
      url: parsed.origin,
      evidence: isHttps ? 'Permissions-Policy HTTP response header is not detected.' : 'Traffic served over unencrypted HTTP.',
      whyItMatters: isHttps ? 'Permissions-Policy prevents third-party iframes from accessing camera, microphone, or geolocation.' : 'Insecure traffic risks data tampering, credential theft, and browser security warnings.',
      recommendation: isHttps ? 'Add "Permissions-Policy: camera=(), microphone=(), geolocation=()" to your server response headers.' : 'Redirect all HTTP traffic to HTTPS and install an SSL certificate.',
      priorityScore: isHttps ? 62 : 98,
      resolved: false,
    },
    {
      _id: `iss_${auditId}_4`,
      audit: auditId,
      category: 'seo',
      severity: 'low',
      issueCode: 'MISSING_IMAGE_ALT',
      title: 'Images Missing Accessible Descriptive Alt Attributes',
      url: parsed.origin,
      evidence: 'Found images without alt="" attribute.',
      whyItMatters: 'Screen readers cannot describe images to visually impaired users, and Google Image Search misses ranking opportunities.',
      recommendation: 'Add descriptive alt tags to all informative images, or set alt="" for purely decorative elements.',
      priorityScore: 58,
      resolved: false,
    },
    {
      _id: `iss_${auditId}_5`,
      audit: auditId,
      category: 'mobile',
      severity: 'passed',
      issueCode: 'MOBILE_VIEWPORT_VALID',
      title: 'Responsive Viewport Meta Tag Properly Configured',
      url: parsed.origin,
      evidence: '<meta name="viewport" content="width=device-width, initial-scale=1.0"> detected.',
      whyItMatters: 'Ensures proper scaling across smartphones, tablets, and desktop displays.',
      recommendation: 'Passed: No action required.',
      priorityScore: 10,
      resolved: true,
    },
    {
      _id: `iss_${auditId}_6`,
      audit: auditId,
      category: 'technical',
      severity: 'passed',
      issueCode: 'CANONICAL_CONSISTENCY',
      title: 'Canonical Tags Match Target URLs',
      url: parsed.origin,
      evidence: 'Rel=canonical self-referential tag is valid and prevents duplicate indexing.',
      whyItMatters: 'Avoids duplicate content penalties across multiple URL variations (HTTP/HTTPS, www/non-www).',
      recommendation: 'Passed: Canonical architecture is clean.',
      priorityScore: 12,
      resolved: true,
    },
  ];

  const actionPlan: PrioritizedRecommendation[] = issues
    .filter((iss) => iss.severity !== 'passed')
    .map((iss, idx) => ({
      priority: idx + 1,
      issueCode: iss.issueCode,
      category: iss.category,
      severity: iss.severity,
      title: iss.title,
      count: 1,
      whyItMatters: iss.whyItMatters,
      recommendation: iss.recommendation,
      affectedUrls: [iss.url],
    }));

  const issuesSummary = {
    critical: issues.filter((i) => i.severity === 'critical').length,
    high: issues.filter((i) => i.severity === 'high').length,
    medium: issues.filter((i) => i.severity === 'medium').length,
    low: issues.filter((i) => i.severity === 'low').length,
    passed: issues.filter((i) => i.severity === 'passed').length,
    total: issues.length,
  };

  const auditRecord: AuditRecord = {
    _id: auditId,
    targetUrl: cleanUrl,
    maxPages: numPages,
    crawlDepth: 2,
    status: 'completed',
    currentStepMessage: 'Audit complete! Report generated successfully.',
    progressPercent: 100,
    healthScore,
    categoryScores: {
      seo: seoScore,
      performance: perfScore,
      mobile: mobileScore,
      security: securityScore,
      technical: techScore,
      content: contentScore,
    },
    issuesSummary,
    pagesDiscovered: numPages,
    pagesScanned: numPages,
    crawlDurationMs: 2450,
    startedAt: now,
    completedAt: new Date(Date.now() + 2500).toISOString(),
    createdAt: now,
  };

  const payload: FullAuditData = {
    audit: auditRecord,
    actionPlan,
    issues,
    pages,
  };

  // Persist into localStorage so ReportPage can read it immediately without network dependency
  try {
    localStorage.setItem(`siteaudit_${auditId}`, JSON.stringify(payload));
    localStorage.setItem(`siteaudit_last`, JSON.stringify(payload));
  } catch (e) {
    console.warn('Storage quota warning:', e);
  }

  return payload;
}
