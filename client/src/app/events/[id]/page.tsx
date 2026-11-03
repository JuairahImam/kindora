"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Users,
  ArrowLeft,
  CheckCircle2,
  Clock,
  User,
  Mail,
} from "lucide-react";
import { IEvent } from "@/types/event";
import { getEventById, getApiBaseUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { showSuccessAlert, showErrorAlert } from "@/lib/alerts";

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
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-theme-bg animate-pulse">
      <div className="h-72 bg-theme-border/40" />
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div className="h-8 bg-theme-border/40 rounded-xl w-3/4" />
        <div className="h-4 bg-theme-border/30 rounded-xl w-full" />
        <div className="h-4 bg-theme-border/30 rounded-xl w-5/6" />
        <div className="h-4 bg-theme-border/30 rounded-xl w-4/6" />
        <div className="h-12 bg-theme-border/40 rounded-xl w-48 mt-6" />
      </div>
    </div>
  );
}

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, token } = useAuth();

  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEventById(id as string).then((data) => {
      if (!data) setNotFound(true);
      else setEvent(data);
      setLoading(false);
    });
  }, [id]);

  const isPastEvent = event
    ? new Date(event.eventDate) < new Date()
    : false;

  const hasJoined = event?.joinedUsers?.some(
    (u) => u.email === user?.email
  );

  const isOwnEvent = event?.creatorEmail === user?.email;

  const handleJoin = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${id}`);
      return;
    }
    if (hasJoined || isPastEvent || isOwnEvent) return;

    setJoining(true);
    try {
      const baseUrl = getApiBaseUrl();
      const storedToken =
        token || localStorage.getItem("kindora_token") || sessionStorage.getItem("kindora_token");

      const res = await fetch(`${baseUrl}/api/events/${id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        await showErrorAlert(
          "Could Not Join",
          data?.message || "Something went wrong. Please try again."
        );
        return;
      }

      await showSuccessAlert(
        "You're In! 🎉",
        `You've successfully joined "${event?.title}". See you there!`
      );

      // Refresh event data
      const updated = await getEventById(id as string);
      if (updated) setEvent(updated);
    } catch (err) {
      await showErrorAlert(
        "Network Error",
        err instanceof Error ? err.message : "Could not connect. Please check your internet connection."
      );
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <Skeleton />;

  if (notFound) {
    return (
      <main className="min-h-screen bg-theme-bg flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-20 h-20 mx-auto rounded-full bg-theme-primary-soft flex items-center justify-center">
            <Calendar className="w-10 h-10 text-[#E4572E]" />
          </div>
          <h1 className="text-2xl font-extrabold text-theme-heading">
            Event Not Found
          </h1>
          <p className="text-theme-body text-sm">
            The event you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/events" className="btn-primary inline-flex mt-2">
            ← Back to Events
          </Link>
        </div>
      </main>
    );
  }

  if (!event) return null;

  const typeColor =
    EVENT_TYPE_COLORS[event.eventType] || EVENT_TYPE_COLORS["Other"];

  return (
    <main className="min-h-screen bg-theme-bg">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-[#1B2236] overflow-hidden">
        {event.thumbnail ? (
          <Image
            src={event.thumbnail}
            alt={event.title}
            fill
            className="object-cover opacity-80"
            sizes="100vw"
            priority
            unoptimized={event.thumbnail.startsWith("data:")}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#E4572E]/30 to-[#F2A93B]/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B2236]/80 via-[#1B2236]/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Events
          </Link>
        </div>

        {/* Type badge */}
        <div className="absolute bottom-6 left-4 sm:left-8">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${typeColor}`}>
            {event.eventType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-theme-heading tracking-tight leading-tight">
              {event.title}
            </h1>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-theme-surface border border-theme-border">
              <Calendar className="w-5 h-5 text-[#E4572E] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-theme-body uppercase tracking-wide">
                  Event Date
                </p>
                <p className="text-sm font-bold text-theme-heading">
                  {formatDate(event.eventDate)}
                </p>
                <p className="text-xs text-theme-body">
                  {formatTime(event.eventDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-theme-surface border border-theme-border">
              <MapPin className="w-5 h-5 text-[#E4572E] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-theme-body uppercase tracking-wide">
                  Location
                </p>
                <p className="text-sm font-bold text-theme-heading">
                  {event.location}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-theme-surface border border-theme-border">
              <Users className="w-5 h-5 text-[#E4572E] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-theme-body uppercase tracking-wide">
                  Volunteers
                </p>
                <p className="text-sm font-bold text-theme-heading">
                  {event.joinedUsers?.length || 0} joined
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-theme-surface border border-theme-border">
              <Mail className="w-5 h-5 text-[#E4572E] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-theme-body uppercase tracking-wide">
                  Organizer
                </p>
                <p className="text-sm font-bold text-theme-heading truncate max-w-[160px]">
                  {event.creatorEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-theme-heading">
              About This Event
            </h2>
            <p className="text-theme-body leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {/* Joined Users List */}
          {event.joinedUsers && event.joinedUsers.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-extrabold text-theme-heading flex items-center gap-2">
                <Users className="w-5 h-5 text-[#E4572E]" />
                Volunteers ({event.joinedUsers.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {event.joinedUsers.slice(0, 10).map((u) => (
                  <div
                    key={u.userId}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-theme-surface border border-theme-border"
                  >
                    <div className="w-8 h-8 rounded-full bg-theme-primary-soft text-[#E4572E] font-bold flex items-center justify-center text-sm shrink-0">
                      {u.name?.charAt(0)?.toUpperCase() || (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-theme-heading truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-theme-body truncate">{u.email}</p>
                    </div>
                  </div>
                ))}
                {event.joinedUsers.length > 10 && (
                  <p className="text-xs text-theme-body px-3 py-2">
                    +{event.joinedUsers.length - 10} more volunteers
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — Action Card */}
        <div className="lg:col-span-1">
          <div className="card-elevation rounded-2xl p-6 space-y-4 sticky top-24">
            {isPastEvent ? (
              <div className="text-center space-y-3 py-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-slate-400" />
                </div>
                <p className="font-bold text-theme-heading">Event Ended</p>
                <p className="text-theme-body text-sm">
                  This event has already passed.
                </p>
              </div>
            ) : isOwnEvent ? (
              <div className="text-center space-y-3 py-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-theme-primary-soft flex items-center justify-center">
                  <User className="w-6 h-6 text-[#E4572E]" />
                </div>
                <p className="font-bold text-theme-heading">Your Event</p>
                <p className="text-theme-body text-sm">
                  You are the organizer of this event.
                </p>
                <Link
                  href="/manage-events"
                  className="btn-secondary w-full text-center text-sm inline-flex justify-center"
                >
                  Manage Event
                </Link>
              </div>
            ) : hasJoined ? (
              <div className="text-center space-y-3 py-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-bold text-theme-heading">
                  You&apos;re Registered!
                </p>
                <p className="text-theme-body text-sm">
                  You&apos;ve already joined this event. We&apos;ll see you there!
                </p>
              </div>
            ) : (
              <>
                <div className="text-center space-y-1">
                  <p className="text-xs font-semibold text-theme-body uppercase tracking-wide">
                    Make a Difference
                  </p>
                  <p className="text-lg font-extrabold text-theme-heading">
                    Join This Event
                  </p>
                </div>

                <div className="space-y-2 text-sm text-theme-body">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Free to participate
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Community-driven initiative
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Verified by Kindora
                  </div>
                </div>

                {user ? (
                  <button
                    onClick={handleJoin}
                    disabled={joining}
                    className="btn-primary w-full text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {joining ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join This Event →"
                    )}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href={`/login?redirect=/events/${id}`}
                      className="btn-primary w-full text-center text-sm inline-flex justify-center"
                    >
                      Login to Join
                    </Link>
                    <p className="text-xs text-center text-theme-body">
                      Don&apos;t have an account?{" "}
                      <Link
                        href="/register"
                        className="text-[#C23B13] font-semibold hover:underline"
                      >
                        Register free
                      </Link>
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="pt-3 border-t border-theme-border text-xs text-theme-body text-center">
              Share this event with your community
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
