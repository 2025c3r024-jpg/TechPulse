import { getArticles, getCategories } from "@/lib/supabase/queries";
import ArticleCard from "@/components/ArticleCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === params.slug);
  return { title: cat?.name ?? "Category" };
}

export default async function CategoryPage({ params }: Props) {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === params.slug);

  const { articles, count } = await getArticles({ categorySlug: params.slug, limit: 12 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {category?.name ?? params.slug}
        </h1>
        {category?.description && (
          <p className="text-gray-500 dark:text-gray-400 mt-2">{category.description}</p>
        )}
        <p className="text-gray-400 text-sm mt-1">{count} articles</p>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No articles in this category yet</p>
          <p className="text-sm mt-1">Check back soon for the latest {category?.name ?? "tech"} news.</p>
        </div>
      )}
    </div>
  );
}
