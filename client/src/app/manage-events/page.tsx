"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  Pencil,
  Trash2,
  X,
  FileText,
  ImageIcon,
  Tag,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import ImageUploader from "@/components/shared/ImageUploader";
import { useAuth } from "@/context/AuthContext";
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from "@/lib/alerts";
import { getApiBaseUrl } from "@/lib/api";
import { IEvent, EventCategory } from "@/types/event";

const EVENT_TYPES: EventCategory[] = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Healthcare",
  "Food Distribution",
  "Other",
];

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PrivateGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/manage-events");
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

// ---- Edit Modal ----
interface EditModalProps {
  event: IEvent;
  token: string | null;
  onClose: () => void;
  onSaved: (updated: IEvent) => void;
}

function EditModal({ event, token, onClose, onSaved }: EditModalProps) {
  const [form, setForm] = useState({
    title: event.title,
    description: event.description,
    eventType: event.eventType as EventCategory,
    thumbnail: event.thumbnail || "",
    location: event.location,
    eventDate: event.eventDate.split("T")[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key: string, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim() || form.description.trim().length < 20)
      e.description = "Description must be at least 20 characters";
    if (!form.eventType) e.eventType = "Please select an event type";
    if (form.thumbnail) {
      if (!form.thumbnail.startsWith("data:image/") && !/^https?:\/\//i.test(form.thumbnail)) {
        e.thumbnail = "Please upload an image or enter a valid URL";
      }
    }
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.eventDate) {
      e.eventDate = "Date is required";
    } else {
      const d = new Date(form.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d <= today) e.eventDate = "Date must be in the future";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const baseUrl = getApiBaseUrl();
      const storedToken =
        token ||
        localStorage.getItem("kindora_token") ||
        sessionStorage.getItem("kindora_token");
      const res = await fetch(`${baseUrl}/api/events/${event._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          eventDate: new Date(form.eventDate).toISOString(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        await showErrorAlert("Update Failed", data?.message || "Please try again.");
        return;
      }
      await showSuccessAlert("Event Updated!", `"${form.title}" has been updated.`);
      onSaved(data.data || { ...event, ...form });
      onClose();
    } catch (err) {
      await showErrorAlert("Error", err instanceof Error ? err.message : "Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-theme-surface rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-theme-border">
          <h2 className="text-xl font-extrabold text-theme-heading">Edit Event</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-theme-body hover:text-theme-heading hover:bg-theme-border/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4" noValidate>
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-theme-heading" htmlFor="edit-title">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className={`w-full h-11 px-4 rounded-xl border-2 bg-theme-bg text-theme-heading text-sm outline-none transition-all ${errors.title ? "border-red-500" : "border-theme-border focus:border-[#C23B13]"}`}
            />
            {errors.title && <p className="text-red-500 text-xs">⚠ {errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-theme-heading" htmlFor="edit-desc">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="edit-desc"
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-theme-bg text-theme-heading text-sm outline-none transition-all resize-none ${errors.description ? "border-red-500" : "border-theme-border focus:border-[#C23B13]"}`}
            />
            {errors.description && <p className="text-red-500 text-xs">⚠ {errors.description}</p>}
          </div>

          {/* Event Type */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-theme-heading" htmlFor="edit-type">
              Event Type <span className="text-red-500">*</span>
            </label>
            <select
              id="edit-type"
              value={form.eventType}
              onChange={(e) => update("eventType", e.target.value)}
              className={`w-full h-11 px-4 rounded-xl border-2 bg-theme-bg text-theme-heading text-sm outline-none transition-all cursor-pointer ${errors.eventType ? "border-red-500" : "border-theme-border focus:border-[#C23B13]"}`}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.eventType && <p className="text-red-500 text-xs">⚠ {errors.eventType}</p>}
          </div>

          {/* Thumbnail Uploader */}
          <ImageUploader
            label="Thumbnail Image"
            value={form.thumbnail}
            onChange={(val) => update("thumbnail", val)}
            aspect="banner"
            error={errors.thumbnail}
          />

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-theme-heading" htmlFor="edit-location">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-location"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className={`w-full h-11 px-4 rounded-xl border-2 bg-theme-bg text-theme-heading text-sm outline-none transition-all ${errors.location ? "border-red-500" : "border-theme-border focus:border-[#C23B13]"}`}
            />
            {errors.location && <p className="text-red-500 text-xs">⚠ {errors.location}</p>}
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-theme-heading" htmlFor="edit-date">
              Event Date <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-date"
              type="date"
              value={form.eventDate}
              min={getTomorrowDate()}
              onChange={(e) => update("eventDate", e.target.value)}
              className={`w-full h-11 px-4 rounded-xl border-2 bg-theme-bg text-theme-heading text-sm outline-none transition-all cursor-pointer ${errors.eventDate ? "border-red-500" : "border-theme-border focus:border-[#C23B13]"}`}
            />
            {errors.eventDate && <p className="text-red-500 text-xs">⚠ {errors.eventDate}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary h-11 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn-primary h-11 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Main Page ----
function ManageEventsContent() {
  const { user, token } = useAuth();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMyEvents = useCallback(async () => {
    const baseUrl = getApiBaseUrl();
    const storedToken =
      token ||
      localStorage.getItem("kindora_token") ||
      sessionStorage.getItem("kindora_token");
    try {
      const res = await fetch(`${baseUrl}/api/events/my-events`, {
        headers: {
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setEvents(data.data || []);
    } catch {
      // silent fail — show empty state
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const handleDelete = async (event: IEvent) => {
    const confirmed = await showConfirmAlert(
      "Delete Event?",
      `Are you sure you want to delete "${event.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(event._id);
    try {
      const baseUrl = getApiBaseUrl();
      const storedToken =
        token ||
        localStorage.getItem("kindora_token") ||
        sessionStorage.getItem("kindora_token");
      const res = await fetch(`${baseUrl}/api/events/${event._id}`, {
        method: "DELETE",
        headers: {
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        await showErrorAlert("Delete Failed", data?.message || "Please try again.");
        return;
      }
      await showSuccessAlert("Event Deleted", `"${event.title}" has been removed.`);
      setEvents((prev) => prev.filter((e) => e._id !== event._id));
    } catch (err) {
      await showErrorAlert("Error", err instanceof Error ? err.message : "Network error.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEventSaved = (updated: IEvent) => {
    setEvents((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
  };

  const skeletons = Array.from({ length: 3 });

  return (
    <main className="min-h-screen bg-theme-bg py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-theme-heading tracking-tight">
              Manage My Events
            </h1>
            <p className="text-theme-body text-sm mt-1">
              View, edit, or delete the events you&apos;ve created.
            </p>
          </div>
          <Link href="/create-event" className="btn-primary inline-flex items-center gap-2 text-sm shrink-0">
            <PlusCircle className="w-4 h-4" />
            Create New Event
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {skeletons.map((_, i) => (
              <div key={i} className="card-elevation rounded-2xl h-32 animate-pulse bg-theme-surface" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-theme-primary-soft flex items-center justify-center">
              <Calendar className="w-10 h-10 text-[#E4572E]" />
            </div>
            <h3 className="text-xl font-bold text-theme-heading">
              No events created yet
            </h3>
            <p className="text-theme-body text-sm max-w-xs mx-auto">
              Start making a difference — create your first community event!
            </p>
            <Link href="/create-event" className="btn-primary mt-2 inline-flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Create an Event
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const isPast = new Date(event.eventDate) < new Date();
              return (
                <article
                  key={event._id}
                  className="card-elevation rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden shrink-0 bg-theme-border/20">
                    {event.thumbnail ? (
                      <Image
                        src={event.thumbnail}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="144px"
                        unoptimized={event.thumbnail?.startsWith("data:")}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#E4572E]/15 to-[#F2A93B]/15 flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-[#E4572E]/40" />
                      </div>
                    )}
                    {isPast && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-xs font-bold text-white bg-slate-700 px-2 py-0.5 rounded-full">
                          Past
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-theme-primary-soft text-[#C23B13]">
                        {event.eventType}
                      </span>
                      {isPast && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Ended
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-theme-heading line-clamp-1 text-base">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-theme-body">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#E4572E]" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#E4572E]" />
                        {formatDate(event.eventDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#E4572E]" />
                        {event.joinedUsers?.length || 0} joined
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => setEditingEvent(event)}
                      disabled={deletingId === event._id}
                      className="flex-1 sm:flex-none btn-secondary h-9 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event)}
                      disabled={deletingId === event._id}
                      className="flex-1 sm:flex-none h-9 px-4 text-xs font-bold rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {deletingId === event._id ? (
                        <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingEvent && (
        <EditModal
          event={editingEvent}
          token={token}
          onClose={() => setEditingEvent(null)}
          onSaved={handleEventSaved}
        />
      )}
    </main>
  );
}

export default function ManageEventsPage() {
  return (
    <PrivateGuard>
      <ManageEventsContent />
    </PrivateGuard>
  );
}
