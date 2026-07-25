import { getCategories } from "@/lib/supabase/queries";
import CategoryManager from "./CategoryManager";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Categories — Admin" };

export default async function AdminCategoriesPage() {
  // Auth + role enforced by admin/layout.tsx
  const categories = await getCategories();
  return <CategoryManager initialCategories={categories} />;
}
