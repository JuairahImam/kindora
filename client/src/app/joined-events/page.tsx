"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, ArrowRight, BookmarkCheck, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getApiBaseUrl } from "@/lib/api";
import { IEvent } from "@/types/event";

const EVENT_TYPE_COLORS: Record<string, string> = {
  Cleanup: "bg-green-100 text-green-800",
  Plantation: "bg-emerald-100 text-emerald-800",
  Donation: "bg-orange-100 text-orange-800",
  Education: "bg-blue-100 text-blue-800",
  Healthcare: "bg-pink-100 text-pink-800",
  "Food Distribution": "bg-yellow-100 text-yellow-800",
  Other: "bg-slate-100 text-slate-700",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function PrivateGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/joined-events");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-theme-border border-t-[#E4572E] rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return null;
  return <>{children}</>;
}

function EventCardSkeleton() {
  return (
    <div className="card-elevation rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 bg-theme-border/40" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-theme-border/60 rounded-full" />
        <div className="h-5 bg-theme-border/60 rounded-xl w-3/4" />
        <div className="h-4 bg-theme-border/40 rounded-xl w-full" />
        <div className="h-4 bg-theme-border/40 rounded-xl w-2/3" />
        <div className="h-10 bg-theme-border/40 rounded-xl mt-4" />
      </div>
    </div>
  );
}

function JoinedEventsContent() {
  const { token } = useAuth();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJoined = useCallback(async () => {
    const baseUrl = getApiBaseUrl();
    const storedToken =
      token ||
      localStorage.getItem("kindora_token") ||
      sessionStorage.getItem("kindora_token");
    try {
      const res = await fetch(`${baseUrl}/api/events/joined-events`, {
        headers: {
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setEvents(data.data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchJoined();
  }, [fetchJoined]);

  return (
    <main className="min-h-screen bg-theme-bg">
      {/* Header */}
      <section className="bg-[#1B2236] relative overflow-hidden py-14 px-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E4572E]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E4572E]/20 text-[#F2A93B] text-sm font-semibold rounded-full border border-[#E4572E]/30">
            <BookmarkCheck className="w-3.5 h-3.5" />
            My Volunteering History
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Events I&apos;ve Joined
          </h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Every event you join is a step toward a better community. Keep making a difference!
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-theme-primary-soft flex items-center justify-center">
              <BookmarkCheck className="w-10 h-10 text-[#E4572E]" />
            </div>
            <h3 className="text-xl font-bold text-theme-heading">
              You haven&apos;t joined any events yet
            </h3>
            <p className="text-theme-body text-sm max-w-sm mx-auto">
              Discover upcoming events in your area and start making a difference — one initiative at a time.
            </p>
            <Link href="/events" className="btn-primary mt-2 inline-flex items-center gap-2">
              Explore Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <p className="text-theme-body text-sm mb-6">
              You&apos;ve joined{" "}
              <span className="font-bold text-theme-heading">{events.length}</span> event
              {events.length !== 1 ? "s" : ""} — thank you for your commitment!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const isPast = new Date(event.eventDate) < new Date();
                const typeColor =
                  EVENT_TYPE_COLORS[event.eventType] || EVENT_TYPE_COLORS["Other"];
                return (
                  <article
                    key={event._id}
                    className="card-elevation rounded-2xl overflow-hidden flex flex-col h-full group hover:-translate-y-1 transition-transform duration-200"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-44 overflow-hidden bg-theme-border/20">
                      {event.thumbnail ? (
                        <Image
                          src={event.thumbnail}
                          alt={event.title}
                          fill
                          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${isPast ? "grayscale opacity-70" : ""}`}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#E4572E]/15 to-[#F2A93B]/15 flex items-center justify-center">
                          <Calendar className="w-10 h-10 text-[#E4572E]/40" />
                        </div>
                      )}
                      <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${typeColor}`}>
                        {event.eventType}
                      </span>
                      {isPast && (
                        <div className="absolute top-3 right-3 bg-slate-700 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          Completed
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-theme-heading text-base leading-snug line-clamp-2 mb-3">
                        {event.title}
                      </h3>
                      <div className="space-y-2 text-sm text-theme-body flex-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#E4572E] shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#E4572E] shrink-0" />
                          <span>{formatDate(event.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-[#E4572E] shrink-0" />
                          <span>{event.joinedUsers?.length || 0} volunteers joined</span>
                        </div>
                      </div>
                      <Link
                        href={`/events/${event._id}`}
                        className="mt-4 btn-secondary w-full text-center text-sm flex items-center justify-center gap-2"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default function JoinedEventsPage() {
  return (
    <PrivateGuard>
      <JoinedEventsContent />
    </PrivateGuard>
  );
}
