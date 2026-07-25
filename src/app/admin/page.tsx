import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PenSquare, Tag, Layers, Users, Mail } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const supabase = createClient();

  // Fetch stats (auth + role already enforced by admin/layout.tsx)
  const [
    { count: articleCount },
    { count: categoryCount },
    { count: subscriberCount },
    { count: userCount },
  ] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage articles, categories, and content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <AdminStat label="Articles" value={articleCount ?? 0} icon={<PenSquare size={20} />} color="blue" />
        <AdminStat label="Categories" value={categoryCount ?? 0} icon={<Layers size={20} />} color="violet" />
        <AdminStat label="Subscribers" value={subscriberCount ?? 0} icon={<Mail size={20} />} color="green" />
        <AdminStat label="Users" value={userCount ?? 0} icon={<Users size={20} />} color="orange" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminCard
          href="/admin/articles/new"
          icon={<PenSquare size={22} />}
          title="New Article"
          description="Write and publish a new tech article"
          color="blue"
        />
        <AdminCard
          href="/admin/articles"
          icon={<PenSquare size={22} />}
          title="Manage Articles"
          description="Edit, delete or unpublish existing articles"
          color="gray"
        />
        <AdminCard
          href="/admin/categories"
          icon={<Layers size={22} />}
          title="Categories"
          description="Add and manage article categories"
          color="violet"
        />
        <AdminCard
          href="/admin/tags"
          icon={<Tag size={22} />}
          title="Tags"
          description="Manage article tags and labels"
          color="green"
        />
        <AdminCard
          href="/admin/subscribers"
          icon={<Mail size={22} />}
          title="Newsletter"
          description="View and manage email subscribers"
          color="orange"
        />
        <AdminCard
          href="/admin/users"
          icon={<Users size={22} />}
          title="Users"
          description="View registered user accounts"
          color="pink"
        />
      </div>
    </div>
  );
}

function AdminStat({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-600",
    violet: "bg-violet-50 dark:bg-violet-950 text-violet-600",
    green: "bg-green-50 dark:bg-green-950 text-green-600",
    orange: "bg-orange-50 dark:bg-orange-950 text-orange-600",
  };
  return (
    <div className="flex items-center gap-3 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
      <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function AdminCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-600",
    violet: "bg-violet-50 dark:bg-violet-950 text-violet-600",
    green: "bg-green-50 dark:bg-green-950 text-green-600",
    orange: "bg-orange-50 dark:bg-orange-950 text-orange-600",
    pink: "bg-pink-50 dark:bg-pink-950 text-pink-600",
    gray: "bg-gray-100 dark:bg-gray-800 text-gray-600",
  };
  return (
    <Link
      href={href}
      className="flex items-start gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all group"
    >
      <div className={`p-2.5 rounded-xl ${colorMap[color]} shrink-0`}>{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
    </Link>
  );
}
