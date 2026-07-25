import Link from "next/link";
import { Zap, Twitter, Github, Rss } from "lucide-react";

const FOOTER_LINKS = {
  Content: [
    { href: "/articles", label: "All Articles" },
    { href: "/category/phones", label: "Phones" },
    { href: "/category/laptops", label: "Laptops" },
    { href: "/category/ai", label: "AI" },
    { href: "/category/gaming", label: "Gaming" },
    { href: "/category/wearables", label: "Wearables" },
  ],
  Account: [
    { href: "/auth/login", label: "Log In" },
    { href: "/auth/signup", label: "Sign Up" },
    { href: "/profile", label: "Profile" },
    { href: "/profile/bookmarks", label: "Bookmarks" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/advertise", label: "Advertise" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400 mb-3">
              <Zap size={20} fill="currentColor" />
              TechPulse
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Your pulse on the latest in technology — launches, reviews, and deep dives.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                <Twitter size={15} className="text-gray-600 dark:text-gray-400" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                <Github size={15} className="text-gray-600 dark:text-gray-400" />
              </a>
              <a href="/rss.xml"
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors">
                <Rss size={15} className="text-orange-500" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} TechPulse. All rights reserved.</p>
          <p>Built for tech enthusiasts, by tech enthusiasts.</p>
        </div>
      </div>
    </footer>
  );
}
