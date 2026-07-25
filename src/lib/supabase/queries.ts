import { createClient } from "@/lib/supabase/server";
import type { ArticleWithRelations, Category } from "@/lib/supabase/types";

const ARTICLE_SELECT = `
  *,
  categories(*),
  profiles(id, display_name, avatar_url),
  article_tags(tags(*))
`;

export async function getArticles({
  page = 1,
  limit = 10,
  categorySlug,
  featured,
  search,
}: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  featured?: boolean;
  search?: string;
} = {}): Promise<{ articles: ArticleWithRelations[]; count: number }> {
  const supabase = createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("articles")
    .select(ARTICLE_SELECT, { count: "exact" })
    .eq("published", true)
    .order("published_at", { ascending: false })
    .range(from, to);

  if (featured !== undefined) query = query.eq("featured", featured);
  if (search) query = query.textSearch("title", search, { type: "websearch" });
  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    if (category) query = query.eq("category_id", category.id);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { articles: (data as ArticleWithRelations[]) ?? [], count: count ?? 0 };
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithRelations | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (error) return null;
  return data as ArticleWithRelations;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return (data as Category[]) ?? [];
}

export async function getUserBookmarks(userId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("bookmarks")
    .select(`article_id, articles(${ARTICLE_SELECT})`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function isBookmarked(userId: string, articleId: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from("bookmarks")
    .select("user_id")
    .eq("user_id", userId)
    .eq("article_id", articleId)
    .single();
  return !!data;
}

export async function getComments(articleId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("comments")
    .select("*, profiles(id, display_name, avatar_url)")
    .eq("article_id", articleId)
    .is("parent_id", null)
    .order("created_at", { ascending: true });
  return data ?? [];
}
