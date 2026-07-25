import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import { getArticles, getCategories } from "@/lib/supabase/queries";
import clsx from "clsx";

export const metadata: Metadata = { title: "All Articles" };

interface SearchParams { page?: string; category?: string }

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Number(searchParams.page ?? 1);
  const categorySlug = searchParams.category;
  const LIMIT = 12;

  const [{ articles, count }, categories] = await Promise.all([
    getArticles({ page, limit: LIMIT, categorySlug }),
    getCategories(),
  ]);

  const totalPages = Math.ceil(count / LIMIT);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {categorySlug
            ? categories.find((c) => c.slug === categorySlug)?.name ?? "Articles"
            : "All Articles"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {count} article{count !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
        <FilterTab href="/articles" active={!categorySlug} label="All" />
        {categories.map((cat) => (
          <FilterTab
            key={cat.id}
            href={`/articles?category=${cat.slug}`}
            active={categorySlug === cat.slug}
            label={cat.name}
          />
        ))}
      </div>

      {/* Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No articles found</p>
          <p className="text-sm mt-1">Try a different category or check back soon.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          {page > 1 && (
            <PaginationLink
              href={buildHref(categorySlug, page - 1)}
              icon={<ChevronLeft size={16} />}
              label="Previous"
            />
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationLink
              key={p}
              href={buildHref(categorySlug, p)}
              label={String(p)}
              active={p === page}
            />
          ))}
          {page < totalPages && (
            <PaginationLink
              href={buildHref(categorySlug, page + 1)}
              icon={<ChevronRight size={16} />}
              label="Next"
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterTab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={clsx(
        "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400"
      )}
    >
      {label}
    </Link>
  );
}

function PaginationLink({
  href,
  label,
  active,
  icon,
}: {
  href: string;
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors",
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600"
      )}
    >
      {icon}
      {icon ? null : label}
    </Link>
  );
}

function buildHref(categorySlug: string | undefined, page: number) {
  const params = new URLSearchParams();
  if (categorySlug) params.set("category", categorySlug);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/articles${qs ? `?${qs}` : ""}`;
}
