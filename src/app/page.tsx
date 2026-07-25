import Link from "next/link";
import { ArrowRight, TrendingUp, Cpu, Smartphone, Monitor, Brain, Gamepad2, Watch } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import { getArticles, getCategories } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  phones: Smartphone,
  laptops: Monitor,
  ai: Brain,
  gaming: Gamepad2,
  wearables: Watch,
  processors: Cpu,
};

const CATEGORY_COLORS: Record<string, string> = {
  phones: "from-blue-500 to-cyan-500",
  laptops: "from-violet-500 to-purple-500",
  ai: "from-orange-500 to-amber-500",
  gaming: "from-green-500 to-emerald-500",
  wearables: "from-pink-500 to-rose-500",
  processors: "from-slate-500 to-gray-600",
};

export default async function HomePage() {
  const [{ articles: featured }, { articles: latest }, categories] = await Promise.all([
    getArticles({ featured: true, limit: 4 }),
    getArticles({ limit: 6 }),
    getCategories(),
  ]);

  const heroArticle = featured[0] ?? null;
  const sideArticles = featured.slice(1, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">

      {/* ── Hero Section ── */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main featured */}
          <div className="lg:col-span-3">
            {heroArticle ? (
              <ArticleCard article={heroArticle} featured />
            ) : (
              <HeroPlaceholder />
            )}
          </div>

          {/* Side featured */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {sideArticles.length > 0 ? (
              sideArticles.map((a) => <ArticleCard key={a.id} article={a} horizontal />)
            ) : (
              <>
                <SidePlaceholder />
                <SidePlaceholder />
                <SidePlaceholder />
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse by Category</h2>
          <Link
            href="/articles"
            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.length > 0 ? (
            categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] ?? Cpu;
              const gradient = CATEGORY_COLORS[cat.slug] ?? "from-blue-500 to-violet-500";
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {cat.name}
                  </span>
                </Link>
              );
            })
          ) : (
            DEFAULT_CATEGORIES.map(({ slug, name, gradient }) => {
              const Icon = CATEGORY_ICONS[slug] ?? Cpu;
              return (
                <Link
                  key={slug}
                  href={`/category/${slug}`}
                  className="group flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{name}</span>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* ── Latest Articles ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp size={22} className="text-blue-600" />
            Latest & Trending
          </h2>
          <Link href="/articles" className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        {latest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        ) : (
          <EmptyArticlesPlaceholder />
        )}
      </section>

      {/* ── Newsletter ── */}
      <section>
        <NewsletterForm />
      </section>
    </div>
  );
}

// ── Placeholders (shown before real data is seeded) ────────────────────────

function HeroPlaceholder() {
  return (
    <div className="relative overflow-hidden rounded-2xl aspect-[16/9] bg-gradient-to-br from-blue-600 via-violet-600 to-blue-800 flex flex-col items-center justify-center text-center p-8">
      <span className="text-5xl mb-4">⚡</span>
      <h1 className="text-white text-3xl font-bold leading-tight mb-2">Welcome to TechPulse</h1>
      <p className="text-blue-100 text-sm max-w-sm">
        The freshest tech news, launches and reviews — all in one place. Start by seeding some articles!
      </p>
    </div>
  );
}

function SidePlaceholder() {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 animate-pulse">
      <div className="w-24 h-24 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
      <div className="flex flex-col justify-center gap-2 flex-1">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>
    </div>
  );
}

function EmptyArticlesPlaceholder() {
  return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-lg font-medium">No articles yet</p>
      <p className="text-sm mt-1">Head to the admin panel to create your first article.</p>
      <Link href="/admin" className="mt-4 inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
        Go to Admin <ArrowRight size={14} />
      </Link>
    </div>
  );
}

const DEFAULT_CATEGORIES = [
  { slug: "phones", name: "Phones", gradient: "from-blue-500 to-cyan-500" },
  { slug: "laptops", name: "Laptops", gradient: "from-violet-500 to-purple-500" },
  { slug: "ai", name: "AI", gradient: "from-orange-500 to-amber-500" },
  { slug: "gaming", name: "Gaming", gradient: "from-green-500 to-emerald-500" },
  { slug: "wearables", name: "Wearables", gradient: "from-pink-500 to-rose-500" },
  { slug: "processors", name: "Processors", gradient: "from-slate-500 to-gray-600" },
];
