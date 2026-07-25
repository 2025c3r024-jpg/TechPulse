export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          color: string | null;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
        };
      };
      tags: {
        Row: { id: string; name: string; slug: string };
        Insert: { name: string; slug: string };
        Update: { name?: string; slug?: string };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_image: string | null;
          category_id: string | null;
          author_id: string | null;
          published: boolean;
          featured: boolean;
          view_count: number;
          read_time: number | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          cover_image?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          published: boolean;
          featured: boolean;
          read_time?: number | null;
          published_at?: string | null;
        };
        Update: {
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          cover_image?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          published?: boolean;
          featured?: boolean;
          read_time?: number | null;
          published_at?: string | null;
        };
      };
      article_tags: {
        Row: { article_id: string; tag_id: string };
        Insert: { article_id: string; tag_id: string };
        Update: { article_id?: string; tag_id?: string };
      };
      bookmarks: {
        Row: { user_id: string; article_id: string; created_at: string };
        Insert: { user_id: string; article_id: string };
        Update: { user_id?: string; article_id?: string };
      };
      comments: {
        Row: {
          id: string;
          article_id: string;
          user_id: string;
          parent_id: string | null;
          body: string;
          likes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          article_id: string;
          user_id: string;
          parent_id?: string | null;
          body: string;
        };
        Update: {
          body?: string;
          likes?: number;
        };
      };
      newsletter_subscribers: {
        Row: { id: string; email: string; subscribed_at: string };
        Insert: { email: string };
        Update: { email?: string };
      };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];

export type ArticleWithRelations = Article & {
  categories: Category | null;
  profiles: Pick<Profile, "id" | "display_name" | "avatar_url"> | null;
  article_tags: { tags: Tag }[];
};
