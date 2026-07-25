"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/supabase/types";

interface Props { initialCategories: Category[] }

export default function CategoryManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  async function refresh() {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data ?? []);
  }

  function genSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    startTransition(async () => {
      await supabase.from("categories").insert({
        name: newName.trim(),
        slug: newSlug.trim() || genSlug(newName.trim()),
        description: newDesc.trim() || null,
      });
      setNewName(""); setNewSlug(""); setNewDesc("");
      await refresh();
    });
  }

  async function saveEdit(id: string) {
    await supabase.from("categories").update({ name: editName }).eq("id", id);
    setEditId(null);
    await refresh();
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category?")) return;
    await supabase.from("categories").delete().eq("id", id);
    await refresh();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Categories</h1>

      {/* Add form */}
      <form onSubmit={addCategory} className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 mb-8 space-y-3">
        <h2 className="font-semibold text-gray-900 dark:text-white">Add category</h2>
        <div className="grid grid-cols-2 gap-3">
          <input
            value={newName}
            onChange={(e) => { setNewName(e.target.value); if (!newSlug) setNewSlug(genSlug(e.target.value)); }}
            placeholder="Name (e.g. Phones)"
            required
            className={inputClass}
          />
          <input
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            placeholder="Slug (e.g. phones)"
            className={inputClass}
          />
        </div>
        <input
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="Description (optional)"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Plus size={15} /> Add Category
        </button>
      </form>

      {/* List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No categories yet</div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-3 px-5 py-3.5">
                {editId === cat.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={`${inputClass} flex-1`}
                      autoFocus
                    />
                    <button onClick={() => saveEdit(cat.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                      <Check size={15} />
                    </button>
                    <button onClick={() => setEditId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                      <X size={15} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 dark:text-white">{cat.name}</span>
                      <span className="ml-2 text-xs text-gray-400 font-mono">/{cat.slug}</span>
                    </div>
                    <button
                      onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const inputClass = "px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full";
