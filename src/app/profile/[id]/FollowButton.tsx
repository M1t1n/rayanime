"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FollowButton({ userId, initialFollowing }: { userId: string; initialFollowing: boolean }) {
  const [following, setFollowing] = useState(initialFollowing);
  const router = useRouter();

  async function toggle() {
    const res = await fetch(`/api/users/${userId}/follow`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setFollowing(data.following);
      router.refresh();
    }
  }

  return (
    <button
      onClick={toggle}
      className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
        following
          ? "border border-accent-primary/30 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20"
          : "bg-accent-primary text-white hover:bg-accent-secondary"
      }`}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
