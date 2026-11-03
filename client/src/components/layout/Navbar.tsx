"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import {
  Sparkles,
  Menu,
  X,
  CalendarPlus,
  Settings,
  BookmarkCheck,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Upcoming Events", href: "/events" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-theme-border bg-theme-surface/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-theme-primary-action flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:bg-theme-primary transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-theme-heading leading-tight">
              Kindora<span className="text-theme-primary">.</span>
            </span>
            <span className="text-[10px] font-medium tracking-wide text-theme-body uppercase -mt-0.5">
              Small Acts. Big Changes
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors relative py-1 ${
                  isActive
                    ? "text-theme-primary"
                    : "text-theme-body hover:text-theme-heading"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-theme-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle + Auth Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {!mounted || loading ? (
            <div className="w-24 h-10 rounded-xl bg-theme-border/40 animate-pulse hidden sm:block" />
          ) : user ? (
            /* Logged-in State: Avatar with Hover Tooltip & Dropdown */
            <div className="relative" ref={dropdownRef}>
              <div
                className="relative inline-block"
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
              >
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 rounded-full border-2 border-theme-border hover:border-theme-primary transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User Profile"}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-theme-primary-soft text-theme-primary font-bold flex items-center justify-center text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-theme-body mr-1 hidden sm:block" />
                </button>

                {/* Tooltip on hover showing user's display name */}
                {tooltipVisible && !dropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-theme-heading text-theme-surface text-xs font-medium rounded-md shadow-lg pointer-events-none whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-150">
                    {user.name || "User"}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-solid border-b-theme-heading border-b-4 border-x-transparent border-x-4 border-t-0" />
                  </div>
                )}
              </div>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-theme-surface border border-theme-border shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2.5 border-b border-theme-border mb-1">
                    <p className="text-sm font-bold text-theme-heading truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-theme-body truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/create-event"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl text-theme-heading hover:bg-theme-primary-soft hover:text-theme-primary transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <CalendarPlus className="w-4 h-4 text-theme-primary" />
                      Create Event
                    </Link>

                    <Link
                      href="/manage-events"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl text-theme-heading hover:bg-theme-primary-soft hover:text-theme-primary transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-theme-primary" />
                      Manage Events
                    </Link>

                    <Link
                      href="/joined-events"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl text-theme-heading hover:bg-theme-primary-soft hover:text-theme-primary transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <BookmarkCheck className="w-4 h-4 text-theme-primary" />
                      Joined Events
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl text-theme-heading hover:bg-theme-primary-soft hover:text-theme-primary transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 text-theme-primary" />
                      My Profile
                    </Link>
                  </div>

                  <div className="border-t border-theme-border mt-1.5 pt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-out State: Login Button & Register Link */
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="btn-primary text-sm font-semibold h-10 px-4"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-secondary text-sm font-semibold h-10 px-4 hidden sm:inline-flex"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl text-theme-body hover:text-theme-heading hover:bg-theme-primary-soft transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-theme-border bg-theme-surface px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2.5 rounded-xl text-base font-semibold ${
                    isActive
                      ? "bg-theme-primary-soft text-theme-primary"
                      : "text-theme-heading hover:bg-theme-border/20"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {!user && (
            <div className="pt-2 border-t border-theme-border flex flex-col gap-2">
              <Link
                href="/login"
                className="btn-primary w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-secondary w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
