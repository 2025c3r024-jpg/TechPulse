import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PenSquare, Eye, Plus, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Articles — Admin" };

export default async function AdminArticlesPage() {
  const supabase = createClient();
  // Auth + role enforced by admin/layout.tsx
  const { data: articles } = await supabase
    .from("articles")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Articles</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{articles?.length ?? 0} total articles</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          New Article
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Title</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Category</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Date</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {articles?.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-5 py-3.5">
                  <span className="font-medium text-gray-900 dark:text-white line-clamp-1">{article.title}</span>
                </td>
                <td className="px-5 py-3.5 hidden sm:table-cell text-gray-500">
                  {article.categories?.name ?? "—"}
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell text-gray-500">
                  {article.created_at ? format(new Date(article.created_at), "MMM d, yyyy") : "—"}
                </td>
                <td className="px-5 py-3.5">
                  {article.published ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full">
                      <CheckCircle size={11} /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      <XCircle size={11} /> Draft
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-blue-600"
                      title="View"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-green-600"
                      title="Edit"
                    >
                      <PenSquare size={15} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!articles || articles.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">No articles yet</p>
            <Link href="/admin/articles/new" className="mt-2 inline-block text-blue-600 text-sm hover:underline">
              Create your first article
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
