"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Camera,
  Pencil,
  CheckCircle2,
  X,
} from "lucide-react";
import ImageUploader from "@/components/shared/ImageUploader";
import { useAuth } from "@/context/AuthContext";
import { showSuccessAlert, showErrorAlert } from "@/lib/alerts";
import { getApiBaseUrl } from "@/lib/api";

function PrivateGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
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

function ProfileContent() {
  const { user, token, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [photoURL, setPhotoURL] = useState(user?.image || "");
  const [errors, setErrors] = useState({ name: "", photoURL: "" });
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = { name: "", photoURL: "" };
    let valid = true;
    if (!name.trim() || name.trim().length < 2) {
      e.name = "Name must be at least 2 characters";
      valid = false;
    }
    if (photoURL.trim()) {
      if (!photoURL.startsWith("data:image/") && !/^https?:\/\//i.test(photoURL)) {
        e.photoURL = "Please upload an image or enter a valid URL";
        valid = false;
      }
    }
    setErrors(e);
    return valid;
  };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const baseUrl = getApiBaseUrl();
      const storedToken =
        token ||
        localStorage.getItem("kindora_token") ||
        sessionStorage.getItem("kindora_token");

      const res = await fetch(`${baseUrl}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          image: photoURL.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        await showErrorAlert("Update Failed", data?.message || "Please try again.");
        return;
      }

      updateUser({
        name: name.trim(),
        image: photoURL.trim() || user?.image,
      });

      await showSuccessAlert("Profile Updated!", "Your profile has been saved.");
      setEditing(false);
    } catch (err) {
      await showErrorAlert("Error", err instanceof Error ? err.message : "Network error.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setName(user?.name || "");
    setPhotoURL(user?.image || "");
    setErrors({ name: "", photoURL: "" });
    setEditing(false);
  };

  return (
    <main className="min-h-screen bg-theme-bg py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-theme-primary-soft text-[#E4572E] text-sm font-semibold rounded-full border border-[#E4572E]/20">
            <User className="w-3.5 h-3.5" />
            My Profile
          </div>
          <h1 className="text-3xl font-extrabold text-theme-heading tracking-tight">
            Your Account
          </h1>
          <p className="text-theme-body text-sm">
            View and update your personal information.
          </p>
        </div>

        <div className="card-elevation rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {(editing ? photoURL : user?.image) ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-theme-border shadow-lg">
                  <Image
                    src={(editing ? photoURL : user?.image) as string}
                    alt="Profile photo"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    unoptimized
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-theme-primary-soft flex items-center justify-center border-4 border-theme-border shadow-lg">
                  <span className="text-4xl font-extrabold text-[#E4572E]">
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
              )}
              {editing && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#E4572E] flex items-center justify-center shadow-md">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {!editing && (
              <div className="text-center">
                <p className="text-xl font-extrabold text-theme-heading">
                  {user?.name}
                </p>
                <p className="text-theme-body text-sm">{user?.email}</p>
              </div>
            )}
          </div>

          {/* Info Cards (view mode) */}
          {!editing && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-theme-bg border border-theme-border">
                <User className="w-5 h-5 text-[#E4572E] shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-theme-body uppercase tracking-wide">
                    Display Name
                  </p>
                  <p className="text-sm font-bold text-theme-heading">
                    {user?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-theme-bg border border-theme-border">
                <Mail className="w-5 h-5 text-[#E4572E] shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-theme-body uppercase tracking-wide">
                    Email Address
                  </p>
                  <p className="text-sm font-bold text-theme-heading">
                    {user?.email}
                  </p>
                </div>
              </div>

              {user?.image && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-theme-bg border border-theme-border">
                  <Camera className="w-5 h-5 text-[#E4572E] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-theme-body uppercase tracking-wide">
                      Profile Photo
                    </p>
                    <p className="text-sm text-theme-body truncate">{user.image}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setEditing(true)}
                className="btn-primary w-full h-11 text-sm font-bold flex items-center justify-center gap-2 mt-2"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          )}

          {/* Edit Form */}
          {editing && (
            <form onSubmit={handleSave} className="space-y-4" noValidate>
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-theme-heading flex items-center gap-1.5" htmlFor="profile-name">
                  <User className="w-4 h-4 text-[#E4572E]" />
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                  }}
                  placeholder="Your full name"
                  className={`w-full h-12 px-4 rounded-xl border-2 bg-theme-bg text-theme-heading placeholder-theme-body/60 text-sm outline-none transition-all ${errors.name ? "border-red-500" : "border-theme-border focus:border-[#C23B13] focus:ring-2 focus:ring-[#C23B13]/20"}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs font-medium">⚠ {errors.name}</p>
                )}
              </div>

              {/* Email (readonly) */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-theme-heading flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#E4572E]" />
                  Email Address{" "}
                  <span className="text-theme-body font-normal text-xs">(cannot change)</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full h-12 px-4 rounded-xl border-2 border-theme-border bg-theme-border/10 text-theme-body text-sm cursor-not-allowed"
                />
              </div>

              {/* Profile Photo Uploader */}
              <ImageUploader
                label="Profile Picture"
                value={photoURL}
                onChange={(val) => {
                  setPhotoURL(val);
                  if (errors.photoURL) setErrors((p) => ({ ...p, photoURL: "" }));
                }}
                aspect="square"
                error={errors.photoURL}
              />

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 btn-secondary h-11 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary h-11 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <PrivateGuard>
      <ProfileContent />
    </PrivateGuard>
  );
}
