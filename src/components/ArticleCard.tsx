import Link from "next/link";
import Image from "next/image";
import { Clock, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ArticleWithRelations } from "@/lib/supabase/types";
import clsx from "clsx";

interface Props {
  article: ArticleWithRelations;
  featured?: boolean;
  horizontal?: boolean;
}

export default function ArticleCard({ article, featured = false, horizontal = false }: Props) {
  const published = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true })
    : "";

  if (featured) {
    return (
      <Link href={`/articles/${article.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl aspect-[16/9]">
          {article.cover_image ? (
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-violet-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {article.categories && (
              <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500 text-white mb-3">
                {article.categories.name}
              </span>
            )}
            <h2 className="text-white text-xl sm:text-2xl font-bold leading-tight line-clamp-2 group-hover:text-blue-300 transition-colors">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="text-gray-300 text-sm mt-1.5 line-clamp-2">{article.excerpt}</p>
            )}
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
              <span>{article.profiles?.display_name ?? "TechPulse Staff"}</span>
              <span>·</span>
              <span>{published}</span>
              {article.read_time && (
                <>
                  <span>·</span>
                  <Clock size={12} />
                  <span>{article.read_time} min read</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (horizontal) {
    return (
      <Link href={`/articles/${article.slug}`} className="group flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
          {article.cover_image ? (
            <Image src={article.cover_image} alt={article.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-violet-500" />
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0">
          {article.categories && (
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
              {article.categories.name}
            </span>
          )}
          <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{published}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-200">
        <div className="relative aspect-[16/10] overflow-hidden">
          {article.cover_image ? (
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-violet-600" />
          )}
        </div>
        <div className="p-4">
          {article.categories && (
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {article.categories.name}
            </span>
          )}
          <h3 className="mt-1.5 font-bold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {article.excerpt}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span>{article.profiles?.display_name ?? "Staff"}</span>
              <span>·</span>
              <span>{published}</span>
            </div>
            <div className="flex items-center gap-3">
              {article.read_time && (
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {article.read_time}m
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye size={11} />
                {article.view_count.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
