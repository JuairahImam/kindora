"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { showSuccessAlert, showErrorAlert } from "@/lib/alerts";
import {
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ImageIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import ImageUploader from "@/components/shared/ImageUploader";

function GitHubLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

interface PasswordRule {
  label: string;
  test: (p: string) => boolean;
}

const passwordRules: PasswordRule[] = [
  { label: "At least 6 characters", test: (p) => p.length >= 6 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithEmail, loginWithGitHub } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });

  const validateURL = (url: string) => {
    if (!url) return true;
    if (url.startsWith("data:image/")) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    const newErrors = { name: "", email: "", photoURL: "", password: "" };
    let valid = true;

    if (!name.trim()) {
      newErrors.name = "Full name is required";
      valid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    if (photoURL && !validateURL(photoURL)) {
      newErrors.photoURL = "Please enter a valid URL (including https://)";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
      valid = false;
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await registerWithEmail(
        name.trim(),
        email.trim(),
        password,
        photoURL.trim() || undefined
      );
      if (result.success) {
        await showSuccessAlert(
          "Welcome to Kindora! 🎉",
          "Your account has been created. Let's start making a difference!"
        );
        router.push("/events");
      } else {
        await showErrorAlert(
          "Registration Failed",
          result.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    setGithubLoading(true);
    loginWithGitHub();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Brand Visual */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#1B2236] relative flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E4572E]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F2A93B]/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#E4572E] flex items-center justify-center shadow-xl shadow-orange-950/40">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="font-extrabold text-3xl text-white tracking-tight">
              Kindora<span className="text-[#E4572E]">.</span>
            </span>
          </div>

          {/* Community Image */}
          <div className="relative w-72 h-60 mx-auto rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
              alt="Community volunteers working together"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B2236]/90 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-bold text-sm">
                Be the change your community needs
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold text-white">
              Start Your Journey
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
              Sign up to create events, join causes, and connect with fellow
              volunteers in your neighborhood.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-col gap-2.5 items-start w-fit mx-auto">
            {[
              "Free to join — always",
              "100% grassroots community",
              "Verified social events",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F2A93B] shrink-0" />
                <span className="text-sm text-slate-300">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-theme-bg overflow-y-auto">
        <div className="w-full max-w-md space-y-6 py-6">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-2.5 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-[#C23B13] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl text-theme-heading">
              Kindora<span className="text-[#E4572E]">.</span>
            </span>
          </div>

          {/* Heading */}
          <div className="text-center lg:text-left space-y-1">
            <h1 className="text-3xl font-extrabold text-theme-heading tracking-tight">
              Create your account
            </h1>
            <p className="text-theme-body text-sm">
              Join thousands of volunteers making a real difference.
            </p>
          </div>

          {/* GitHub Register */}
          <button
            type="button"
            onClick={handleGitHubLogin}
            disabled={githubLoading || loading}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border-2 border-theme-border bg-theme-surface text-theme-heading font-semibold text-sm hover:border-theme-primary hover:bg-theme-primary-soft transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {githubLoading ? (
              <span className="w-5 h-5 border-2 border-theme-body/30 border-t-theme-body rounded-full animate-spin" />
            ) : (
              <GitHubLogo className="w-5 h-5" />
            )}
            {githubLoading ? "Redirecting..." : "Continue with GitHub"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-theme-border" />
            <span className="text-xs text-theme-body font-medium uppercase tracking-wider">
              or sign up with email
            </span>
            <div className="flex-1 h-px bg-theme-border" />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-semibold text-theme-heading"
                htmlFor="name"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-body pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                  }}
                  placeholder="Your full name"
                  className={`w-full h-12 pl-10 pr-4 rounded-xl border-2 bg-theme-surface text-theme-heading placeholder-theme-body/60 text-sm outline-none transition-all
                    ${
                      errors.name
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-theme-border focus:border-[#C23B13] focus:ring-2 focus:ring-[#C23B13]/20"
                    }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs font-medium flex items-center gap-1.5">
                  <span>⚠</span> {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-semibold text-theme-heading"
                htmlFor="reg-email"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-body pointer-events-none" />
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder="you@example.com"
                  className={`w-full h-12 pl-10 pr-4 rounded-xl border-2 bg-theme-surface text-theme-heading placeholder-theme-body/60 text-sm outline-none transition-all
                    ${
                      errors.email
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-theme-border focus:border-[#C23B13] focus:ring-2 focus:ring-[#C23B13]/20"
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs font-medium flex items-center gap-1.5">
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* Profile Photo Uploader */}
            <ImageUploader
              label="Profile Photo (optional)"
              value={photoURL}
              onChange={(val) => {
                setPhotoURL(val);
                if (errors.photoURL) setErrors((p) => ({ ...p, photoURL: "" }));
              }}
              aspect="square"
              error={errors.photoURL}
            />

            {/* Password */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-semibold text-theme-heading"
                htmlFor="reg-password"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-body pointer-events-none" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((p) => ({ ...p, password: "" }));
                    if (!showRules && e.target.value) setShowRules(true);
                  }}
                  placeholder="Create a strong password"
                  className={`w-full h-12 pl-10 pr-12 rounded-xl border-2 bg-theme-surface text-theme-heading placeholder-theme-body/60 text-sm outline-none transition-all
                    ${
                      errors.password
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-theme-border focus:border-[#C23B13] focus:ring-2 focus:ring-[#C23B13]/20"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-theme-body hover:text-theme-heading transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-medium flex items-center gap-1.5">
                  <span>⚠</span> {errors.password}
                </p>
              )}

              {/* Password Rules Checker */}
              {showRules && password && (
                <div className="bg-theme-surface border border-theme-border rounded-xl p-3 space-y-1.5 mt-1">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <div
                        key={rule.label}
                        className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                          passed ? "text-green-600" : "text-theme-body"
                        }`}
                      >
                        {passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-theme-border shrink-0" />
                        )}
                        {rule.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || githubLoading}
              className="btn-primary w-full h-12 text-sm font-bold gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create My Account →"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-theme-body">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#C23B13] hover:text-[#E4572E] transition-colors underline-offset-2 hover:underline"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
