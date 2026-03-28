"use client";

import { useState } from "react";

interface Props {
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Rating({ value, onChange, readonly = false, size = "md" }: Props) {
  const [hover, setHover] = useState(0);
  const sizes = { sm: "text-sm", md: "text-xl", lg: "text-2xl" };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`star-hover ${sizes[size]} ${
            readonly ? "cursor-default" : "cursor-pointer"
          } ${
            star <= (hover || value)
              ? "text-yellow-400"
              : "text-text-muted/30"
          }`}
        >
          ★
        </button>
      ))}
      {(hover || value) > 0 && (
        <span className="ml-2 text-sm font-semibold text-text-secondary">
          {hover || value}/10
        </span>
      )}
    </div>
  );
}
