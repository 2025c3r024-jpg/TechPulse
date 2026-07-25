import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, User, Calendar } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { getUserBookmarks } from "@/lib/supabase/queries";
import ArticleCard from "@/components/ArticleCard";
import type { ArticleWithRelations } from "@/lib/supabase/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const bookmarkData = await getUserBookmarks(user.id);
  const bookmarkedArticles = bookmarkData
    .map((b: any) => b.articles)
    .filter(Boolean) as ArticleWithRelations[];

  const displayName = profile?.display_name ?? user.user_metadata?.display_name ?? user.email ?? "User";
  const joined = format(new Date(user.created_at), "MMMM yyyy");
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile header */}
      <div className="flex items-center gap-6 mb-10 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="w-20 h-20 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
          {profile?.bio && <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{profile.bio}</p>}
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
            <Calendar size={12} />
            <span>Joined {joined}</span>
          </div>
        </div>
        <div className="ml-auto">
          <Link
            href="/profile/edit"
            className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Bookmarks" value={bookmarkedArticles.length} icon={<Bookmark size={16} />} />
        <StatCard label="Member since" value={joined} icon={<Calendar size={16} />} />
      </div>

      {/* Bookmarks */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
          <Bookmark size={18} />
          Saved Articles
        </h2>
        {bookmarkedArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl">
            <Bookmark size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No bookmarks yet</p>
            <p className="text-sm text-gray-400 mt-1">Save articles to read later by clicking the bookmark button.</p>
            <Link
              href="/articles"
              className="mt-4 inline-block text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
            >
              Explore articles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
      <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-xl text-blue-600">{icon}</div>
      <div>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}
