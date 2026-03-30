"use client";

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-stone-200 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-stone-200 rounded w-24" />
          <div className="h-3 bg-stone-100 rounded w-16" />
        </div>
      </div>
      {/* Content */}
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-stone-200 rounded w-full" />
        <div className="h-3 bg-stone-200 rounded w-5/6" />
        <div className="h-3 bg-stone-100 rounded w-4/6" />
      </div>
      {/* Reactions */}
      <div className="flex gap-2 pt-2 border-t border-stone-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-7 w-14 bg-stone-100 rounded-full" />
        ))}
      </div>
    </div>
  );
}
