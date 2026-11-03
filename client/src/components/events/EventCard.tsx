"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IEvent } from "@/types/event";
import { MapPin, Calendar, Users, ArrowRight, Tag } from "lucide-react";

interface EventCardProps {
  event: IEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const [imageSrc, setImageSrc] = useState(
    event.thumbnail || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80"
  );

  // Format date readable
  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(event.eventDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const joinedCount = event.joinedUsers?.length || 0;

  return (
    <div className="card-elevation h-full flex flex-col overflow-hidden group">
      {/* Event Thumbnail */}
      <div className="relative w-full aspect-[16/10] bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <Image
          src={imageSrc}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized={imageSrc.startsWith("data:")}
          onError={() => {
            setImageSrc(
              "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80"
            );
          }}
        />

        {/* Event Type Chip */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-theme-primary border border-theme-border shadow-sm flex items-center gap-1.5">
          <Tag className="w-3 h-3 text-theme-primary" />
          <span>{event.eventType}</span>
        </div>

        {/* Participant Count Badge */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>{joinedCount} Joined</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs font-semibold text-theme-primary">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span suppressHydrationWarning>
              {formattedDate} • {formattedTime}
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-lg font-bold text-theme-heading line-clamp-1 group-hover:text-theme-primary transition-colors">
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-theme-body line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{event.location}</span>
          </div>

          {/* Description snippet */}
          <p className="text-xs leading-relaxed text-theme-body line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-theme-border">
          <Link
            href={`/events/${event._id}`}
            className="btn-primary w-full text-xs font-bold h-10 gap-1.5 group-hover:bg-theme-primary-hover"
          >
            <span>View Event</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
