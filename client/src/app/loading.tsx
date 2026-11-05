// Global loading UI shown by Next.js App Router during page transitions
export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-theme-bg flex flex-col items-center justify-center gap-6">
      {/* Animated logo mark */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-theme-border animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-[#E4572E] border-t-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full bg-[#E4572E]/10 flex items-center justify-center">
          <span className="text-[#E4572E] font-black text-lg">K</span>
        </div>
      </div>

      {/* Label */}
      <div className="space-y-2 text-center">
        <p className="text-theme-heading font-semibold text-sm tracking-widest uppercase">
          Loading
        </p>
        {/* Animated dots */}
        <div className="flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#E4572E] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
