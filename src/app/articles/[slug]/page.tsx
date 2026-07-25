import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { Clock, Eye, Calendar, ArrowLeft, Tag } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticleBySlug, getArticles, isBookmarked } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import BookmarkButton from "@/components/BookmarkButton";
import CommentSection from "@/components/CommentSection";
import NewsletterForm from "@/components/NewsletterForm";
import ArticleCard from "@/components/ArticleCard";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.cover_image ? [article.cover_image] : [],
      type: "article",
      publishedTime: article.published_at ?? undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const bookmarked = user ? await isBookmarked(user.id, article.id) : false;

  const { articles: related } = await getArticles({
    categorySlug: article.categories?.slug,
    limit: 3,
  });
  const relatedFiltered = related.filter((a) => a.id !== article.id).slice(0, 3);

  const tags = article.article_tags?.map((at) => at.tags) ?? [];
  const published = article.published_at
    ? format(new Date(article.published_at), "MMMM d, yyyy")
    : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={15} />
          Back to articles
        </Link>

        {/* Category + Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.categories && (
            <Link
              href={`/category/${article.categories.slug}`}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
            >
              {article.categories.name}
            </Link>
          )}
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center gap-1"
            >
              <Tag size={10} />
              {tag.name}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          {article.profiles && (
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {article.profiles.display_name}
            </span>
          )}
          {published && (
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              {published}
            </span>
          )}
          {article.read_time && (
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {article.read_time} min read
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye size={13} />
            {article.view_count.toLocaleString()} views
          </span>
        </div>

        {/* Bookmark */}
        <div className="mb-8">
          <BookmarkButton
            articleId={article.id}
            userId={user?.id ?? null}
            initialBookmarked={bookmarked}
          />
        </div>

        {/* Cover image */}
        {article.cover_image && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10">
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article content */}
        <article className="prose prose-gray dark:prose-dark max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </article>

        {/* Newsletter CTA */}
        <div className="mt-12">
          <NewsletterForm compact />
        </div>

        {/* Comments */}
        <div className="mt-12">
          <CommentSection articleId={article.id} userId={user?.id ?? null} />
        </div>
      </div>

      {/* Related articles */}
      {relatedFiltered.length > 0 && (
        <div className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedFiltered.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
