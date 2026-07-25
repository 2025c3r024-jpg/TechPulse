import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Force all pages to be dynamically rendered at request time.
// This prevents Next.js from trying to pre-render pages that depend
// on runtime env vars (Supabase URL/key) during the build step.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "TechPulse", template: "%s | TechPulse" },
  description:
    "Your pulse on the latest in technology — new launches, reviews, and deep dives on phones, laptops, AI, gaming, and more.",
  keywords: ["tech", "technology", "gadgets", "phones", "laptops", "AI", "gaming"],
  openGraph: {
    siteName: "TechPulse",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent dark-mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (t === 'dark' || (!t && d)) document.documentElement.classList.add('dark');
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
