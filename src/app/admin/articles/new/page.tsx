import { getCategories } from "@/lib/supabase/queries";
import ArticleEditor from "../ArticleEditor";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New Article — Admin" };

export default async function NewArticlePage() {
  // Auth + role enforced by admin/layout.tsx
  const categories = await getCategories();
  return <ArticleEditor categories={categories} />;
}
