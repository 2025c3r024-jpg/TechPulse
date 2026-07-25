import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateComment } from "@/lib/validate";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  // Must be authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { article_id, comment_body } = body as Record<string, unknown>;

  // Validate article_id
  if (typeof article_id !== "string" || !article_id.trim()) {
    return NextResponse.json({ error: "article_id is required" }, { status: 400 });
  }

  // Validate comment body
  const validation = validateComment(comment_body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 422 });
  }

  const trimmedBody = (comment_body as string).trim();

  // Insert — DB trigger enforces rate limit (5 per 5 min)
  const { error } = await supabase.from("comments").insert({
    article_id: article_id.trim(),
    user_id: user.id,
    body: trimmedBody,
  });

  if (error) {
    // Friendly message for rate-limit trigger
    if (error.message.includes("Rate limit exceeded")) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
