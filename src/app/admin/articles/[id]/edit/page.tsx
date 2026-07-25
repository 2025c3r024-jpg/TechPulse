import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/supabase/queries";
import ArticleEditor from "../../ArticleEditor";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Article — Admin" };

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  // Auth + role enforced by admin/layout.tsx
  const supabase = createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("id, title, slug, excerpt, content, cover_image, category_id, published, featured, read_time")
    .eq("id", params.id)
    .single();

  if (!article) notFound();
  const categories = await getCategories();

  return <ArticleEditor categories={categories} article={article} />;
}
