"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EditProfilePage() {
  const { data: session, update: updateSession, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
    }
  }, [session]);

  // Also load current bio from API
  useEffect(() => {
    const userId = (session?.user as any)?.id;
    if (!userId) return;
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then((d) => { if (d.bio) setBio(d.bio); });
  }, [(session?.user as any)?.id]);

  if (status === "loading") return null;
  if (!session) {
    router.push("/login");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    setError("");
    setSuccess(false);

    const userId = (session!.user as any).id;
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), bio: bio.trim() }),
    });

    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Failed to save");
      setSaving(false);
      return;
    }

    // Update the NextAuth session so the navbar name refreshes
    await updateSession({ name: name.trim() });
    setSuccess(true);
    setSaving(false);

    setTimeout(() => router.push(`/profile/${userId}`), 800);
  }

  const userId = (session.user as any)?.id;

  return (
    <div className="mx-auto max-w-md pt-8 animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Edit Profile</h1>
        <Link
          href={`/profile/${userId}`}
          className="text-sm text-text-muted hover:text-text-primary transition"
        >
          ← Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar preview */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-accent-primary/20 flex items-center justify-center text-2xl font-bold text-accent-primary">
            {name?.[0]?.toUpperCase() || "?"}
          </div>
          <p className="text-xs text-text-muted">Avatar is your initial — full upload coming soon</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-2 text-sm text-green-400">
            ✓ Profile saved! Redirecting…
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm text-text-secondary">Display name</label>
          <input
            type="text"
            required
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent-primary/50"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-text-secondary">Bio</label>
          <textarea
            rows={4}
            maxLength={200}
            placeholder="Tell people a bit about yourself…"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition focus:border-accent-primary/50 resize-none"
          />
          <p className="mt-1 text-right text-xs text-text-muted">{bio.length}/200</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-accent-primary py-2.5 text-sm font-medium text-white transition hover:bg-accent-secondary disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
