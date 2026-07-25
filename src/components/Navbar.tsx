import Link from "next/link";
import { Zap } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import NavSearch from "@/components/NavSearch";
import UserMenu from "@/components/UserMenu";

const NAV_LINKS = [
  { href: "/articles", label: "Articles" },
  { href: "/category/phones", label: "Phones" },
  { href: "/category/laptops", label: "Laptops" },
  { href: "/category/ai", label: "AI" },
  { href: "/category/gaming", label: "Gaming" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400 shrink-0"
        >
          <Zap size={22} fill="currentColor" />
          TechPulse
        </Link>

        {/* Nav links — hidden on mobile */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <NavSearch />
          <ThemeToggle />
          <UserMenu />
        </div>
      </nav>
    </header>
  );
}
