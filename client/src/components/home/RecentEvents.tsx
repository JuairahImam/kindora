"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IEvent } from "@/types/event";
import { getRecentUpcomingEvents } from "@/lib/api";
import EventCard from "@/components/events/EventCard";
import { ArrowRight, Sparkles, CalendarDays } from "lucide-react";

export default function RecentEvents() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentEvents() {
      try {
        setLoading(true);
        const data = await getRecentUpcomingEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error loading recent upcoming events:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRecentEvents();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-theme-surface border-y border-theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-theme-primary mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upcoming Initiatives</span>
            </div>
            <h2 className="section-title">Recent Upcoming Events</h2>
            <p className="section-subtitle">
              Join active community service events happening soon across your
              neighborhood. Every hand counts toward positive change.
            </p>
          </div>

          <Link
            href="/events"
            className="btn-secondary h-11 px-5 text-sm font-bold gap-2 shrink-0 self-start md:self-auto"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic Events Grid */}
        {loading ? (
          /* Skeletons while loading */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="card-elevation h-96 rounded-2xl overflow-hidden flex flex-col animate-pulse"
              >
                <div className="w-full aspect-[16/10] bg-theme-border/40" />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="h-4 bg-theme-border/50 rounded w-1/3" />
                    <div className="h-5 bg-theme-border/60 rounded w-3/4" />
                    <div className="h-4 bg-theme-border/40 rounded w-1/2" />
                  </div>
                  <div className="h-10 bg-theme-border/40 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          /* 3-Column Equal Height Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 card-elevation rounded-2xl max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-theme-primary-soft text-theme-primary mx-auto flex items-center justify-center mb-4">
              <CalendarDays className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-theme-heading mb-2">
              No Upcoming Events Scheduled Yet
            </h3>
            <p className="text-sm text-theme-body mb-6 leading-relaxed">
              Be the first community organizer to start a social development
              event in your locality.
            </p>
            <Link href="/create-event" className="btn-primary text-sm font-bold">
              Create an Event Now
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
