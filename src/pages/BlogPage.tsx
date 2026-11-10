import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const posts = [
    {
      title: 'How to Fix Critical Largest Contentful Paint (LCP) Delays in 2025',
      excerpt:
        'LCP marks the point when the main content of your webpage has likely rendered. Learn how preloading hero banners and removing render-blocking JS cuts load times in half.',
      date: 'May 12, 2025',
      readTime: '6 min read',
      tag: 'Performance',
    },
    {
      title: 'The Complete Guide to Heading Hierarchy (H1 through H6) for SEO',
      excerpt:
        'Why multiple H1 tags dilute keyword focus and how improper heading nesting violates accessibility standards and search crawler expectations.',
      date: 'April 28, 2025',
      readTime: '5 min read',
      tag: 'SEO Optimization',
    },
    {
      title: 'Mobile Viewport Horizontal Overflow: Why It Ruin Conversions',
      excerpt:
        'Fixed width tables and unconstrained images cause horizontal panning on 375px screens. Here is how to audit and fix responsive layout bugs.',
      date: 'April 15, 2025',
      readTime: '4 min read',
      tag: 'Mobile Usability',
    },
    {
      title: '5 Security Headers Every Web Developer Must Configure Today',
      excerpt:
        'HSTS, CSP, and X-Frame-Options prevent man-in-the-middle attacks and clickjacking. Learn how to configure these headers in Nginx and Apache.',
      date: 'March 22, 2025',
      readTime: '7 min read',
      tag: 'Security',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-400">Knowledge Hub</span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mt-2">
          Website Health & Technical SEO Guides
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          In-depth architectural breakdowns, Core Web Vitals optimization techniques, and on-page SEO best practices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post, idx) => (
          <article
            key={idx}
            className="p-8 rounded-3xl bg-[#0B132B] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center gap-3 text-xs mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                  {post.tag}
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3 hover:text-blue-400 transition cursor-pointer">
                {post.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">{post.excerpt}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>{post.date}</span>
              <span className="text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                Read Guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
