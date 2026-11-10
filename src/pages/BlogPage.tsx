import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';

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
      title: 'Mobile Viewport Horizontal Overflow: Why It Destroys Conversion Rates',
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
    <div className="bg-white py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 uppercase tracking-wide">
            Knowledge Hub
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-3">
            Website Health & Technical SEO Guides
          </h1>
          <p className="mt-4 text-base text-slate-500">
            In-depth architectural breakdowns, Core Web Vitals optimization techniques, and on-page SEO best practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, idx) => (
            <article
              key={idx}
              className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                    {post.tag}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-2.5 hover:text-blue-600 transition cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">{post.excerpt}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{post.date}</span>
                <span className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
