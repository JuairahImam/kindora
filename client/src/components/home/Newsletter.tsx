"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section className="py-16 md:py-20 bg-theme-primary-soft/50 border-t border-theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1B2236] via-[#212940] to-[#171E33] text-white p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl border border-slate-700/60">
          {/* Background Decorative Circles */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-[#E4572E]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-[#F2A93B]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-bold tracking-wide backdrop-blur-md">
              <Mail className="w-3.5 h-3.5" />
              <span>Stay In The Loop</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Get Notified About Upcoming Drives
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Subscribe to our weekly digest. Be the first to know about local
              tree plantation schedules, emergency winter relief, and
              community-building projects in your district.
            </p>

            {subscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 flex items-center justify-center gap-2.5 text-sm font-semibold animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Thank you! You are now subscribed to Kindora updates.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
              >
                <div className="relative w-full">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#E4572E] focus:bg-white/15 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto h-12 px-6 text-sm font-bold gap-2 whitespace-nowrap shadow-lg shadow-orange-950/40"
                >
                  <span>Subscribe</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

            <p className="text-[12px] text-slate-400">
              We respect your privacy. No spam, ever. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
