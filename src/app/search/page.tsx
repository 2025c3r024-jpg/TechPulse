import type { Metadata } from "next";
import { Search } from "lucide-react";
import { getArticles } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = { title: "Search" };

interface Props { searchParams: { q?: string } }

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q?.trim() ?? "";

  const { articles, count } = query
    ? await getArticles({ search: query, limit: 20 })
    : { articles: [], count: 0 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Search size={24} />
          Search
        </h1>
        <SearchForm defaultValue={query} />
      </div>

      {query && (
        <div>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {count > 0 ? (
              <>Found <strong>{count}</strong> result{count !== 1 ? "s" : ""} for &ldquo;<strong>{query}</strong>&rdquo;</>
            ) : (
              <>No results for &ldquo;<strong>{query}</strong>&rdquo; — try different keywords.</>
            )}
          </p>
          {articles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">Start typing to search articles</p>
        </div>
      )}
    </div>
  );
}

function SearchForm({ defaultValue }: { defaultValue: string }) {
  return (
    <form method="GET" action="/search" className="flex gap-3">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          name="q"
          defaultValue={defaultValue}
          type="search"
          placeholder="Search articles, topics, categories…"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
