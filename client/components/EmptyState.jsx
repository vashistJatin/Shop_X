import Link from "next/link";

export default function EmptyState({ icon, title, desc, action, href }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl mb-5">{icon}</div>
      <h2 className="font-display font-bold text-xl text-ink mb-2">{title}</h2>
      <p className="text-ink-muted text-sm mb-7 max-w-xs">{desc}</p>
      {action && href && (
        <Link href={href} className="btn-blue px-6 py-3 rounded-xl font-display font-bold text-sm">
          {action}
        </Link>
      )}
    </div>
  );
}
