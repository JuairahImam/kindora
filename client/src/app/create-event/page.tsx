"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  FileText,
  Image as ImageIcon,
  Tag,
  CheckCircle2,
} from "lucide-react";
import ImageUploader from "@/components/shared/ImageUploader";
import { useAuth } from "@/context/AuthContext";
import { showSuccessAlert, showErrorAlert } from "@/lib/alerts";
import { getApiBaseUrl } from "@/lib/api";
import { EventCategory } from "@/types/event";

const EVENT_TYPES: EventCategory[] = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Healthcare",
  "Food Distribution",
  "Other",
];

// Get tomorrow's date in YYYY-MM-DD format for min date
function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function PrivateGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/create-event");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-theme-border border-t-[#E4572E] rounded-full animate-spin mx-auto" />
          <p className="text-theme-body text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

function CreateEventForm() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "" as EventCategory | "",
    thumbnail: "",
    location: "",
    eventDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) newErrors.title = "Event title is required";
    else if (form.title.trim().length < 5)
      newErrors.title = "Title must be at least 5 characters";

    if (!form.description.trim())
      newErrors.description = "Description is required";
    else if (form.description.trim().length < 20)
      newErrors.description = "Description must be at least 20 characters";

    if (!form.eventType) newErrors.eventType = "Please select an event type";

    if (form.thumbnail.trim()) {
      if (!form.thumbnail.startsWith("data:image/") && !/^https?:\/\//i.test(form.thumbnail)) {
        newErrors.thumbnail = "Please upload an image or enter a valid URL";
      }
    }

    if (!form.location.trim()) newErrors.location = "Location is required";

    if (!form.eventDate) {
      newErrors.eventDate = "Event date is required";
    } else {
      const selectedDate = new Date(form.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        newErrors.eventDate = "Event date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const baseUrl = getApiBaseUrl();
      const storedToken =
        token ||
        localStorage.getItem("kindora_token") ||
        sessionStorage.getItem("kindora_token");

      const res = await fetch(`${baseUrl}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          eventType: form.eventType,
          thumbnail: form.thumbnail.trim() || undefined,
          location: form.location.trim(),
          eventDate: new Date(form.eventDate).toISOString(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        await showErrorAlert(
          "Failed to Create Event",
          data?.message || "Something went wrong. Please try again."
        );
        return;
      }

      await showSuccessAlert(
        "Event Created! 🎉",
        `"${form.title}" is now live. Share it with your community!`
      );
      router.push("/events");
    } catch (err) {
      await showErrorAlert(
        "Network Error",
        err instanceof Error ? err.message : "Could not connect to server."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-theme-bg py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-theme-primary-soft text-[#E4572E] text-sm font-semibold rounded-full border border-[#E4572E]/20">
            <Calendar className="w-3.5 h-3.5" />
            Create Event
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-theme-heading tracking-tight">
            Organize a Community Event
          </h1>
          <p className="text-theme-body text-sm max-w-md mx-auto">
            Fill in the details below to create a social initiative and inspire
            volunteers to join your cause.
          </p>
        </div>

        {/* Form Card */}
        <div className="card-elevation rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Title */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-semibold text-theme-heading flex items-center gap-1.5"
                htmlFor="title"
              >
                <FileText className="w-4 h-4 text-[#E4572E]" />
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Winter Clothes Distribution — Mirpur 10"
                maxLength={120}
                className={`w-full h-12 px-4 rounded-xl border-2 bg-theme-surface text-theme-heading placeholder-theme-body/60 text-sm outline-none transition-all ${
                  errors.title
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-theme-border focus:border-[#C23B13] focus:ring-2 focus:ring-[#C23B13]/20"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs font-medium">
                  ⚠ {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-semibold text-theme-heading flex items-center gap-1.5"
                htmlFor="description"
              >
                <FileText className="w-4 h-4 text-[#E4572E]" />
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your event — what will volunteers do, who will it help, what to bring..."
                className={`w-full px-4 py-3 rounded-xl border-2 bg-theme-surface text-theme-heading placeholder-theme-body/60 text-sm outline-none transition-all resize-none ${
                  errors.description
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-theme-border focus:border-[#C23B13] focus:ring-2 focus:ring-[#C23B13]/20"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs font-medium">
                  ⚠ {errors.description}
                </p>
              )}
            </div>

            {/* Event Type */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-semibold text-theme-heading flex items-center gap-1.5"
                htmlFor="eventType"
              >
                <Tag className="w-4 h-4 text-[#E4572E]" />
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                id="eventType"
                value={form.eventType}
                onChange={(e) => updateField("eventType", e.target.value)}
                className={`w-full h-12 px-4 rounded-xl border-2 bg-theme-surface text-theme-heading text-sm outline-none transition-all cursor-pointer ${
                  errors.eventType
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-theme-border focus:border-[#C23B13] focus:ring-2 focus:ring-[#C23B13]/20"
                } ${!form.eventType ? "text-theme-body/60" : ""}`}
              >
                <option value="" disabled>
                  Select event type...
                </option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.eventType && (
                <p className="text-red-500 text-xs font-medium">
                  ⚠ {errors.eventType}
                </p>
              )}
            </div>

            {/* Thumbnail Uploader */}
            <ImageUploader
              label="Event Thumbnail Image"
              value={form.thumbnail}
              onChange={(val) => updateField("thumbnail", val)}
              aspect="banner"
              error={errors.thumbnail}
            />

            {/* Location */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-semibold text-theme-heading flex items-center gap-1.5"
                htmlFor="location"
              >
                <MapPin className="w-4 h-4 text-[#E4572E]" />
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="e.g. Mohammadpur, Dhaka"
                className={`w-full h-12 px-4 rounded-xl border-2 bg-theme-surface text-theme-heading placeholder-theme-body/60 text-sm outline-none transition-all ${
                  errors.location
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-theme-border focus:border-[#C23B13] focus:ring-2 focus:ring-[#C23B13]/20"
                }`}
              />
              {errors.location && (
                <p className="text-red-500 text-xs font-medium">
                  ⚠ {errors.location}
                </p>
              )}
            </div>

            {/* Event Date */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-semibold text-theme-heading flex items-center gap-1.5"
                htmlFor="eventDate"
              >
                <Calendar className="w-4 h-4 text-[#E4572E]" />
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                id="eventDate"
                type="date"
                value={form.eventDate}
                min={getTomorrowDate()}
                onChange={(e) => updateField("eventDate", e.target.value)}
                className={`w-full h-12 px-4 rounded-xl border-2 bg-theme-surface text-theme-heading text-sm outline-none transition-all cursor-pointer ${
                  errors.eventDate
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-theme-border focus:border-[#C23B13] focus:ring-2 focus:ring-[#C23B13]/20"
                }`}
              />
              {errors.eventDate && (
                <p className="text-red-500 text-xs font-medium">
                  ⚠ {errors.eventDate}
                </p>
              )}
              <p className="text-xs text-theme-body">
                Only future dates are allowed.
              </p>
            </div>

            {/* Organizer Info (readonly) */}
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-theme-primary-soft border border-[#E4572E]/20">
              <CheckCircle2 className="w-4 h-4 text-[#E4572E] shrink-0" />
              <p className="text-sm text-[#C23B13] font-medium">
                Organizing as:{" "}
                <span className="font-bold">{user?.name}</span>{" "}
                <span className="text-[#E4572E]/70">({user?.email})</span>
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full h-12 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Event...
                </>
              ) : (
                "Publish Event →"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function CreateEventPage() {
  return (
    <PrivateGuard>
      <CreateEventForm />
    </PrivateGuard>
  );
}
