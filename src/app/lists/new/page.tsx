"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewListPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  if (!session) {
    return (
      <p className="pt-16 text-center text-sm text-text-muted">
        Please <a href="/login" className="text-accent-primary">log in</a> to create lists.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);

    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), description: description.trim() || null }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/lists/${data.id}`);
    }
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-lg pt-8">
      <h1 className="text-2xl font-bold text-text-primary">Create a list</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-text-secondary">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Top 10 Romance Anime"
            className="w-full rounded-lg border border-white/10 bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-primary/50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-text-secondary">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-primary/50"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-secondary disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create list"}
        </button>
      </form>
    </div>
  );
}
