"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Send, Trash2, ThumbsUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface CommentRow {
  id: string;
  body: string;
  likes: number;
  created_at: string;
  profiles: { id: string; display_name: string | null; avatar_url: string | null } | null;
}

interface Props {
  articleId: string;
  userId: string | null;
}

export default function CommentSection({ articleId, userId }: Props) {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [body, setBody] = useState("");
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  useEffect(() => {
    fetchComments();

    // Realtime subscription
    const channel = supabase
      .channel(`comments:${articleId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments", filter: `article_id=eq.${articleId}` },
        () => fetchComments()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [articleId]);

  async function fetchComments() {
    const { data } = await supabase
      .from("comments")
      .select("*, profiles(id, display_name, avatar_url)")
      .eq("article_id", articleId)
      .is("parent_id", null)
      .order("created_at", { ascending: true });
    setComments((data as CommentRow[]) ?? []);
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || !userId) return;
    startTransition(async () => {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: articleId, comment_body: trimmed }),
      });
      if (res.ok) {
        setBody("");
      } else {
        const data = await res.json().catch(() => ({}));
        console.error("[comment] error:", data.error ?? res.status);
      }
    });
  }

  async function deleteComment(id: string) {
    await supabase.from("comments").delete().eq("id", id).eq("user_id", userId!);
  }

  async function likeComment(id: string, currentLikes: number) {
    await supabase.from("comments").update({ likes: currentLikes + 1 }).eq("id", id);
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
        <MessageSquare size={20} />
        Comments ({comments.length})
      </h2>

      {/* Comment form */}
      {userId ? (
        <form onSubmit={submitComment} className="mb-8">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your thoughts…"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!body.trim() || isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Send size={14} />
              Post comment
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-center">
          <p className="text-sm text-gray-500">
            <a href="/auth/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Log in
            </a>{" "}
            to join the discussion.
          </p>
        </div>
      )}

      {/* Comment list */}
      {comments.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">Be the first to comment!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => {
            const initials = (c.profiles?.display_name ?? "?").charAt(0).toUpperCase();
            return (
              <div key={c.id} className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  {initials}
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {c.profiles?.display_name ?? "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{c.body}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => likeComment(c.id, c.likes)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp size={12} />
                      {c.likes > 0 && <span>{c.likes}</span>}
                    </button>
                    {userId === c.profiles?.id && (
                      <button
                        onClick={() => deleteComment(c.id)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
