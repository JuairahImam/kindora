"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, HeartHandshake, ShieldCheck, Users } from "lucide-react";

export default function Hero() {
  const [heroImage, setHeroImage] = useState(
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80"
  );

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-theme-bg via-theme-bg to-theme-surface border-b border-theme-border">
      {/* Subtle warm decorative background blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-orange-400/10 via-amber-400/10 to-rose-400/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-primary-soft text-theme-primary text-xs font-bold tracking-wide border border-theme-border shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Small Actions. Big Changes.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-theme-heading leading-[1.12]">
              Make a Difference, <br />
              <span className="text-theme-primary underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-8">
                One Event
              </span>{" "}
              at a Time.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-theme-body leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Kindora connects passionate local citizens with grassroots social
              initiatives across Dhaka and beyond. Discover tree plantation
              drives, winter clothes distributions, educational workshops, and
              community cleanups in your neighborhood.
            </p>

            {/* Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                href="/events"
                className="btn-primary w-full sm:w-auto h-12 px-7 text-sm font-bold gap-2 shadow-lg shadow-orange-500/20"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/create-event"
                className="btn-secondary w-full sm:w-auto h-12 px-7 text-sm font-bold"
              >
                Create an Event
              </Link>
            </div>

            {/* Trust and community indicators */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-theme-border/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-theme-primary shrink-0" />
                <span className="text-xs font-medium text-theme-body">
                  100% Grassroots
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs font-medium text-theme-body">
                  Verified Causes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-medium text-theme-body">
                  Local Volunteers
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Real Community Service Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative coral border shape */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#E4572E] via-[#F2A93B] to-[#FFEDE5] dark:to-slate-800 rounded-3xl opacity-70 blur-xs -rotate-2 -z-10" />

              {/* Main Photo Card */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-theme-border shadow-2xl bg-theme-surface aspect-[4/3] w-full min-h-[300px]">
                <Image
                  src={heroImage}
                  alt="Community volunteers packing food and winter aid for families in need"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  onError={() => {
                    setHeroImage(
                      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
                    );
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#E4572E] text-[11px] font-bold uppercase tracking-wider mb-1">
                    Featured Drive
                  </span>
                  <p className="font-bold text-sm sm:text-base">
                    Blanket & Winter Clothes Aid — Mohammadpur, Dhaka
                  </p>
                </div>
              </div>

              {/* Floating pill badge */}
              <div className="absolute -bottom-5 -left-4 bg-theme-surface border border-theme-border p-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold text-base">
                  🌱
                </div>
                <div>
                  <p className="text-xs font-extrabold text-theme-heading">
                    Green Dhaka Initiative
                  </p>
                  <p className="text-[11px] text-theme-body">
                    Over 500+ Saplings Planted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
