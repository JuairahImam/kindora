import Link from "next/link";
import { Sparkles, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-theme-bg">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-theme-primary-soft text-theme-primary flex items-center justify-center shadow-lg shadow-orange-500/10">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-theme-primary">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-theme-heading tracking-tight">
            Page Not Found
          </h1>
          <p className="text-theme-body text-sm leading-relaxed max-w-sm mx-auto">
            The page you are looking for might have been moved, removed, or never existed. Let&apos;s get you back to discovering causes that matter.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="btn-primary w-full sm:w-auto h-11 px-6 text-sm font-bold gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/events" className="btn-secondary w-full sm:w-auto h-11 px-6 text-sm font-bold gap-2">
            <Sparkles className="w-4 h-4 text-theme-primary" />
            Explore Events
          </Link>
        </div>
      </div>
    </main>
  );
}
