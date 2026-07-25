"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/supabase/types";

interface Props {
  categories: Category[];
  article?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image: string | null;
    category_id: string | null;
    published: boolean;
    featured: boolean;
    read_time: number | null;
  };
}

export default function ArticleEditor({ categories, article }: Props) {
  const isEdit = !!article;
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [coverImage, setCoverImage] = useState(article?.cover_image ?? "");
  const [categoryId, setCategoryId] = useState(article?.category_id ?? "");
  const [published, setPublished] = useState(article?.published ?? false);
  const [featured, setFeatured] = useState(article?.featured ?? false);
  const [readTime, setReadTime] = useState(article?.read_time ?? 5);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  function generateSlug(t: string) {
    return t
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setTitle(v);
    if (!isEdit) setSlug(generateSlug(v));
  }

  async function handleSave(publish: boolean) {
    setError(null);
    startTransition(async () => {
      const payload = {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        cover_image: coverImage || null,
        category_id: categoryId || null,
        published: publish,
        featured,
        read_time: readTime,
        published_at: publish ? new Date().toISOString() : null,
      };

      if (isEdit) {
        const { error } = await supabase.from("articles").update(payload).eq("id", article.id);
        if (error) { setError(error.message); return; }
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase.from("articles").insert({ ...payload, author_id: user?.id });
        if (error) { setError(error.message); return; }
      }
      router.push("/admin/articles");
      router.refresh();
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/articles" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? "Edit Article" : "New Article"}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-5">
          <Field label="Title">
            <input
              value={title}
              onChange={handleTitleChange}
              placeholder="Article title"
              className={inputClass}
            />
          </Field>
          <Field label="Slug (URL)">
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-url-slug"
              className={inputClass}
            />
          </Field>
          <Field label="Excerpt">
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short description (shown in cards and SEO)"
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </Field>
          <Field label="Content (Markdown)">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article in Markdown…"
              rows={24}
              className={`${inputClass} resize-y font-mono text-xs`}
            />
          </Field>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish actions */}
          <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Publish</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleSave(true)}
                disabled={isPending || !title || !content}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Eye size={15} />
                Publish
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={isPending || !title || !content}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                <Save size={15} />
                Save Draft
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
            <Field label="Category">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={inputClass}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Cover Image URL">
              <input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/…"
                className={inputClass}
              />
            </Field>
            <Field label="Read time (minutes)">
              <input
                type="number"
                min={1}
                max={120}
                value={readTime}
                onChange={(e) => setReadTime(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured article</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
