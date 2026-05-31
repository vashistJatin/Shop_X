import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display font-bold text-[120px] text-ink/5 leading-none select-none">
          404
        </div>
        <h1 className="font-display font-bold text-3xl text-ink -mt-4 mb-3">
          Page not found
        </h1>
        <p className="text-ink-muted mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn-blue px-8 py-3 rounded-xl font-display font-bold">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
