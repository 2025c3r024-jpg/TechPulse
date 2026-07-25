"use client";

import { useState, useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  articleId: string;
  userId: string | null;
  initialBookmarked: boolean;
}

export default function BookmarkButton({ articleId, userId, initialBookmarked }: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  async function toggle() {
    if (!userId) {
      window.location.href = "/auth/login";
      return;
    }
    startTransition(async () => {
      if (bookmarked) {
        await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", userId)
          .eq("article_id", articleId);
        setBookmarked(false);
      } else {
        await supabase
          .from("bookmarks")
          .insert({ user_id: userId, article_id: articleId });
        setBookmarked(true);
      }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
        bookmarked
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600"
      }`}
    >
      {bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}
