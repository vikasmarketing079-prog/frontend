export interface CodeFixSolution {
  title: string;
  summary: string;
  tabs: {
    label: string;
    language: string;
    filename: string;
    code: string;
  }[];
}

export function getCodeFixForIssue(issueCode: string, contextUrl?: string): CodeFixSolution {
  const domain = contextUrl ? new URL(contextUrl).hostname : 'example.com';

  switch (issueCode) {
    case 'SEC_MISSING_HSTS':
    case 'SEC_NO_HTTPS':
      return {
        title: 'Enable HTTP Strict Transport Security (HSTS)',
        summary: 'Enforces HTTPS on all visitor connections and prevents SSL stripping attacks.',
        tabs: [
          {
            label: 'Nginx',
            language: 'nginx',
            filename: '/etc/nginx/conf.d/ssl.conf',
            code: `# Add Strict-Transport-Security header (max-age: 2 years)\nadd_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;`,
          },
          {
            label: 'Apache (.htaccess)',
            language: 'apache',
            filename: '.htaccess',
            code: `<IfModule mod_headers.c>\n  Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"\n</IfModule>`,
          },
          {
            label: 'WordPress (functions.php)',
            language: 'php',
            filename: 'wp-content/themes/your-theme/functions.php',
            code: `add_action('send_headers', function() {\n    header("Strict-Transport-Security: max-age=63072000; includeSubDomains; preload");\n});`,
          },
          {
            label: 'Vercel (vercel.json)',
            language: 'json',
            filename: 'vercel.json',
            code: `{\n  "headers": [\n    {\n      "source": "/(.*)",\n      "headers": [\n        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }\n      ]\n    }\n  ]\n}`,
          },
        ],
      };

    case 'SEC_MISSING_X_FRAME':
      return {
        title: 'Add X-Frame-Options (Clickjacking Protection)',
        summary: 'Prevents other malicious websites from embedding your site inside an iframe.',
        tabs: [
          {
            label: 'Nginx',
            language: 'nginx',
            filename: '/etc/nginx/nginx.conf',
            code: `add_header X-Frame-Options "SAMEORIGIN" always;\nadd_header X-Content-Type-Options "nosniff" always;`,
          },
          {
            label: 'Apache (.htaccess)',
            language: 'apache',
            filename: '.htaccess',
            code: `<IfModule mod_headers.c>\n  Header always set X-Frame-Options "SAMEORIGIN"\n  Header always set X-Content-Type-Options "nosniff"\n</IfModule>`,
          },
          {
            label: 'Next.js (next.config.js)',
            language: 'javascript',
            filename: 'next.config.js',
            code: `module.exports = {\n  async headers() {\n    return [\n      {\n        source: '/:path*',\n        headers: [\n          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },\n          { key: 'X-Content-Type-Options', value: 'nosniff' }\n        ],\n      },\n    ];\n  },\n};`,
          },
        ],
      };

    case 'SEC_MISSING_CSP':
      return {
        title: 'Configure Content-Security-Policy (CSP)',
        summary: 'Protects visitors from cross-site scripting (XSS) and unauthorized data injection.',
        tabs: [
          {
            label: 'HTML (<head>)',
            language: 'html',
            filename: 'index.html',
            code: `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://trustedscripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;">`,
          },
          {
            label: 'Nginx',
            language: 'nginx',
            filename: 'nginx.conf',
            code: `add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:;" always;`,
          },
        ],
      };

    case 'SEO_MISSING_TITLE':
    case 'SEO_TITLE_TOO_SHORT':
    case 'SEO_TITLE_TOO_LONG':
      return {
        title: 'Optimize Title Tag (<title>)',
        summary: 'Sets an optimal 50-60 character page title with primary search intent.',
        tabs: [
          {
            label: 'HTML (<head>)',
            language: 'html',
            filename: 'index.html',
            code: `<!-- Place inside your <head> tag -->\n<title>Your Brand Name - Primary Product & Service Solution (55 chars)</title>`,
          },
          {
            label: 'Next.js App Router',
            language: 'typescript',
            filename: 'app/layout.tsx',
            code: `export const metadata = {\n  title: 'Your Brand Name - Fast, Scalable Modern Web Platform',\n  description: 'Discover how our platform accelerates workflow and boosts efficiency.',\n};`,
          },
          {
            label: 'WordPress (header.php)',
            language: 'php',
            filename: 'header.php',
            code: `<title><?php wp_title('|', true, 'right'); ?> <?php bloginfo('name'); ?></title>`,
          },
        ],
      };

    case 'SEO_MISSING_META_DESCRIPTION':
    case 'SEO_META_DESCRIPTION_TOO_SHORT':
    case 'SEO_META_DESCRIPTION_TOO_LONG':
      return {
        title: 'Add Compelling Meta Description',
        summary: 'Write a high-converting 140-160 character snippet that maximizes Google SERP click-throughs.',
        tabs: [
          {
            label: 'HTML (<head>)',
            language: 'html',
            filename: 'index.html',
            code: `<meta name="description" content="Explore our high-performance solutions designed to scale your business. Get actionable insights, expert support, and fast setup today. (152 chars)">`,
          },
          {
            label: 'Next.js Metadata',
            language: 'typescript',
            filename: 'app/page.tsx',
            code: `export const metadata = {\n  description: 'Explore our high-performance solutions designed to scale your business. Get actionable insights, expert support, and fast setup today.',\n};`,
          },
        ],
      };

    case 'SEO_MISSING_CANONICAL':
      return {
        title: 'Add Self-Referencing Canonical Tag',
        summary: 'Prevents duplicate content penalties by designating the authoritative URL for search engines.',
        tabs: [
          {
            label: 'HTML (<head>)',
            language: 'html',
            filename: 'index.html',
            code: `<link rel="canonical" href="https://${domain}/" />`,
          },
          {
            label: 'Next.js App Router',
            language: 'typescript',
            filename: 'app/layout.tsx',
            code: `export const metadata = {\n  alternates: {\n    canonical: 'https://${domain}/',\n  },\n};`,
          },
          {
            label: 'WordPress (functions.php)',
            language: 'php',
            filename: 'functions.php',
            code: `add_action('wp_head', function() {\n    if (is_singular()) {\n        echo '<link rel="canonical" href="' . esc_url(get_permalink()) . '" />' . "\n";\n    }\n});`,
          },
        ],
      };

    case 'SEO_MISSING_H1':
    case 'SEO_MULTIPLE_H1':
      return {
        title: 'Fix H1 Heading Hierarchy',
        summary: 'Ensure each page has exactly one singular <h1> tag representing the primary subject.',
        tabs: [
          {
            label: 'HTML Structure',
            language: 'html',
            filename: 'page.html',
            code: `<!-- Exactly ONE H1 tag per page -->\n<h1>The Primary Value Proposition of This Page</h1>\n\n<!-- Subheadings must use H2 through H6 sequentially -->\n<h2>Key Feature Overview</h2>\n<h3>Technical Architecture Specifications</h3>`,
          },
          {
            label: 'React / JSX',
            language: 'jsx',
            filename: 'Component.tsx',
            code: `<main>\n  <h1 className="text-3xl font-extrabold text-slate-900">\n    Your Main Page Headline\n  </h1>\n  <h2 className="text-xl font-bold mt-4">Secondary Subheading</h2>\n</main>`,
          },
        ],
      };

    case 'PERF_SLOW_SERVER_RESPONSE':
    case 'PERF_BROWSER_CACHING':
      return {
        title: 'Enable Static Caching & Compression',
        summary: 'Dramatically reduce TTFB response times and bandwidth with gzip and browser cache headers.',
        tabs: [
          {
            label: 'Nginx (Fast Cache & Gzip)',
            language: 'nginx',
            filename: 'nginx.conf',
            code: `# Enable Gzip compression\ngzip on;\ngzip_types text/plain text/css application/json application/javascript text/xml application/xml+rss text/javascript image/svg+xml;\n\n# Cache static assets for 1 year\nlocation ~* \\.(jpg|jpeg|png|gif|ico|css|js|webp|avif|woff2)$ {\n    expires 365d;\n    add_header Cache-Control "public, no-transform, max-age=31536000, immutable";\n}`,
          },
          {
            label: 'Apache (.htaccess)',
            language: 'apache',
            filename: '.htaccess',
            code: `<IfModule mod_expires.c>\n  ExpiresActive On\n  ExpiresByType image/webp "access plus 1 year"\n  ExpiresByType text/css "access plus 1 month"\n  ExpiresByType application/javascript "access plus 1 month"\n</IfModule>`,
          },
        ],
      };

    default:
      return {
        title: 'Recommended Code Fix',
        summary: 'Apply the standard optimization pattern to remediate this finding.',
        tabs: [
          {
            label: 'HTML / JS',
            language: 'html',
            filename: 'snippet.html',
            code: `<!-- Recommended fix for ${issueCode} -->\n<!-- Review affected element on ${contextUrl || 'your website'} and apply changes -->`,
          },
        ],
      };
  }
}

