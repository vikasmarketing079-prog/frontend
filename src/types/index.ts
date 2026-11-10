export interface CategoryScores {
  seo: number;
  performance: number;
  mobile: number;
  security: number;
  technical: number;
  content: number;
}

export interface IssuesSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  passed: number;
  total: number;
}

export interface AuditRecord {
  _id: string;
  targetUrl: string;
  maxPages: number;
  crawlDepth: number;
  status: 'pending' | 'crawling' | 'analyzing' | 'completed' | 'failed';
  currentStepMessage?: string;
  progressPercent: number;
  healthScore: number;
  categoryScores: CategoryScores;
  issuesSummary: IssuesSummary;
  pagesDiscovered: number;
  pagesScanned: number;
  crawlDurationMs: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
  pdfReportPath?: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface AuditIssueItem {
  _id: string;
  audit: string;
  pageAudit?: string;
  category: 'seo' | 'performance' | 'mobile' | 'security' | 'broken_link' | 'content' | 'technical';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'passed';
  issueCode: string;
  title: string;
  url: string;
  evidence: string;
  whyItMatters: string;
  recommendation: string;
  priorityScore: number;
  resolved: boolean;
}

export interface PrioritizedRecommendation {
  priority: number;
  issueCode: string;
  category: string;
  severity: string;
  title: string;
  count: number;
  whyItMatters: string;
  recommendation: string;
  affectedUrls: string[];
}

export interface PageAuditItem {
  _id: string;
  audit: string;
  url: string;
  path: string;
  statusCode: number;
  responseTimeMs: number;
  pageSizeBytes: number;
  contentType: string;
  title?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  h1Count: number;
  wordCount: number;
  internalLinksCount: number;
  externalLinksCount: number;
  imagesCount: number;
  missingAltCount: number;
  categoryScores: CategoryScores;
  performanceMetrics?: {
    fcp?: number;
    lcp?: number;
    cls?: number;
    tbt?: number;
    speedIndex?: number;
    ttfb?: number;
    totalRequests?: number;
  };
  mobileFindings?: {
    viewportConfigured: boolean;
    hasHorizontalOverflow: boolean;
    overflowDetails?: string[];
  };
  securityHeaders?: {
    hasHsts: boolean;
    hasCsp: boolean;
    hasXFrame: boolean;
    hasXContentType: boolean;
    hasReferrerPolicy: boolean;
    hasPermissionsPolicy: boolean;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'agency';
  plan: 'free' | 'pro' | 'agency';
  companyName?: string;
  whiteLabelSettings?: {
    logoUrl?: string;
    brandColor?: string;
    reportFooterText?: string;
  };
}

export interface WebsiteItem {
  _id: string;
  domain: string;
  name: string;
  url: string;
  defaultMaxPages: number;
  lastAuditId?: string;
  lastAuditDate?: string;
  healthScore?: number;
  status: 'active' | 'archived';
  createdAt: string;
}

export interface PlanConfig {
  id: string;
  name: string;
  priceUsd: number;
  priceInr: number;
  interval: string;
  maxPagesPerScan: number;
  maxWebsites: number;
  features: string[];
  popular: boolean;
}

