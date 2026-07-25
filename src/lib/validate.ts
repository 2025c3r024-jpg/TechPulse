/**
 * Lightweight input validation utilities — no external dependencies.
 * Used for server-side validation of user inputs before DB writes.
 */

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

/** Validate a comment body */
export function validateComment(body: unknown): ValidationResult {
  if (typeof body !== "string") return { ok: false, error: "Comment must be a string." };
  const trimmed = body.trim();
  if (trimmed.length === 0) return { ok: false, error: "Comment cannot be empty." };
  if (trimmed.length < 2) return { ok: false, error: "Comment is too short." };
  if (trimmed.length > 2000) return { ok: false, error: "Comment must be 2000 characters or fewer." };
  // Reject obvious spam patterns
  if (/(.)\1{20,}/.test(trimmed)) return { ok: false, error: "Comment contains invalid repeated characters." };
  return { ok: true };
}

/** Validate an email address */
export function validateEmail(email: unknown): ValidationResult {
  if (typeof email !== "string") return { ok: false, error: "Email must be a string." };
  const trimmed = email.trim().toLowerCase();
  if (trimmed.length === 0) return { ok: false, error: "Email cannot be empty." };
  if (trimmed.length > 254) return { ok: false, error: "Email is too long." };
  // RFC 5322 simplified pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmed)) return { ok: false, error: "Please enter a valid email address." };
  return { ok: true };
}

/** Validate an article title */
export function validateArticleTitle(title: unknown): ValidationResult {
  if (typeof title !== "string") return { ok: false, error: "Title must be a string." };
  const trimmed = title.trim();
  if (trimmed.length === 0) return { ok: false, error: "Title cannot be empty." };
  if (trimmed.length < 5) return { ok: false, error: "Title must be at least 5 characters." };
  if (trimmed.length > 200) return { ok: false, error: "Title must be 200 characters or fewer." };
  return { ok: true };
}

/** Validate article content */
export function validateArticleContent(content: unknown): ValidationResult {
  if (typeof content !== "string") return { ok: false, error: "Content must be a string." };
  const trimmed = content.trim();
  if (trimmed.length === 0) return { ok: false, error: "Content cannot be empty." };
  if (trimmed.length < 10) return { ok: false, error: "Content is too short." };
  if (trimmed.length > 500_000) return { ok: false, error: "Content is too long (max 500,000 characters)." };
  return { ok: true };
}

/** Validate a URL slug */
export function validateSlug(slug: unknown): ValidationResult {
  if (typeof slug !== "string") return { ok: false, error: "Slug must be a string." };
  const trimmed = slug.trim();
  if (trimmed.length === 0) return { ok: false, error: "Slug cannot be empty." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
    return { ok: false, error: "Slug must contain only lowercase letters, numbers, and hyphens." };
  }
  if (trimmed.length > 100) return { ok: false, error: "Slug must be 100 characters or fewer." };
  return { ok: true };
}
