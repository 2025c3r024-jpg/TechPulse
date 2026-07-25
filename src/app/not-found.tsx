import Link from "next/link";
import { FileQuestion } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found — TechPulse" };

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center mx-auto mb-6">
          <FileQuestion size={28} className="text-gray-400" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Page not found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/articles"
            className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Browse articles
          </Link>
        </div>
      </div>
    </div>
  );
}
