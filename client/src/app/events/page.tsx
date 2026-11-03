"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Users, ArrowRight, Tag } from "lucide-react";
import { IEvent } from "@/types/event";
import { getAllUpcomingEvents } from "@/lib/api";

const EVENT_TYPE_COLORS: Record<string, string> = {
  Cleanup: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Plantation: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Donation: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Education: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Healthcare: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  "Food Distribution": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Other: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
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

function EventCardSkeleton() {
  return (
    <div className="card-elevation rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-theme-border/40" />
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

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const eventTypes = [
    "All",
    "Cleanup",
    "Plantation",
    "Donation",
    "Education",
    "Healthcare",
    "Food Distribution",
    "Other",
  ];

  useEffect(() => {
    getAllUpcomingEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const filtered = events.filter((e) => {
    const matchesType = selectedType === "All" || e.eventType === selectedType;
    const matchesSearch =
      !searchTerm ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-theme-bg">
      {/* Hero Banner */}
      <section className="bg-[#1B2236] relative overflow-hidden py-16 px-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E4572E]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F2A93B]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E4572E]/20 text-[#F2A93B] text-sm font-semibold rounded-full border border-[#E4572E]/30">
            <Tag className="w-3.5 h-3.5" />
            All Upcoming Events
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Discover <span className="text-[#E4572E]">Events</span> Near You
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Browse community-driven events and find an opportunity to make a
            real difference in your neighborhood.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[72px] z-40 bg-theme-surface border-b border-theme-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-body pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search events or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-theme-border bg-theme-bg text-theme-heading text-sm placeholder-theme-body/60 outline-none focus:border-[#C23B13] transition-colors"
            />
          </div>

          {/* Type Filter Chips */}
          <div className="flex gap-2 flex-wrap">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                  selectedType === type
                    ? "bg-[#E4572E] text-white border-[#E4572E]"
                    : "bg-theme-surface text-theme-body border-theme-border hover:border-[#E4572E] hover:text-[#E4572E]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-theme-primary-soft flex items-center justify-center">
              <Calendar className="w-10 h-10 text-[#E4572E]" />
            </div>
            <h3 className="text-xl font-bold text-theme-heading">
              {searchTerm || selectedType !== "All"
                ? "No events match your filters"
                : "No upcoming events yet"}
            </h3>
            <p className="text-theme-body max-w-sm mx-auto text-sm">
              {searchTerm || selectedType !== "All"
                ? "Try adjusting your search or filter criteria."
                : "Be the first to create a community event and inspire others!"}
            </p>
            {!searchTerm && selectedType === "All" && (
              <Link href="/create-event" className="btn-primary mt-2 inline-flex">
                Create the First Event →
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-theme-body text-sm mb-6">
              Showing{" "}
              <span className="font-bold text-theme-heading">{filtered.length}</span>{" "}
              upcoming event{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function EventCard({ event }: { event: IEvent }) {
  const typeColor =
    EVENT_TYPE_COLORS[event.eventType] || EVENT_TYPE_COLORS["Other"];

  return (
    <article className="card-elevation rounded-2xl overflow-hidden flex flex-col h-full group hover:-translate-y-1 transition-transform duration-200">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-theme-border/20">
        {event.thumbnail ? (
          <Image
            src={event.thumbnail}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={event.thumbnail.startsWith("data:")}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#E4572E]/20 to-[#F2A93B]/20 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-[#E4572E]/50" />
          </div>
        )}
        {/* Type badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${typeColor}`}
        >
          {event.eventType}
        </span>
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
            <span>
              {event.joinedUsers?.length || 0} volunteer
              {(event.joinedUsers?.length || 0) !== 1 ? "s" : ""} joined
            </span>
          </div>
        </div>

        <Link
          href={`/events/${event._id}`}
          className="mt-4 btn-primary w-full text-center text-sm flex items-center justify-center gap-2"
        >
          View Event
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
