import Link from "next/link";
import { ShieldOff } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Access denied — TechPulse" };

export default function ForbiddenPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950 flex items-center justify-center mx-auto mb-6">
          <ShieldOff size={28} className="text-red-500" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">403</h1>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Access denied
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          You don&apos;t have permission to view this page. Admin access is required.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
