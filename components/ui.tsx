export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function SectionTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      {eyebrow ? (
        <div className="mb-3 inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {eyebrow}
        </div>
      ) : null}
      <h1 className="text-4xl font-bold tracking-normal text-slate-950">{title}</h1>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}

export function StatusBadge({
  tone = "blue",
  children
}: {
  tone?: "blue" | "green" | "pink" | "purple" | "slate";
  children: React.ReactNode;
}) {
  const tones = {
    blue: "border-blue-200 bg-blue-50 text-blue-600",
    green: "border-emerald-200 bg-emerald-50 text-emerald-600",
    pink: "border-pink-200 bg-pink-50 text-pink-600",
    purple: "border-violet-200 bg-violet-50 text-violet-600",
    slate: "border-slate-200 bg-slate-50 text-slate-500"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}
