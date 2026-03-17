"use client";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-[10px] tracking-[0.35em] text-stone-400 uppercase mb-3">
        {label}
      </p>
      <h2 className="text-xl md:text-2xl font-light text-gray-900 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-stone-400 mt-2 font-light">{subtitle}</p>
      )}
    </div>
  );
}
