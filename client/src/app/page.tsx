import React from "react";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import RecentEvents from "@/components/home/RecentEvents";
import Gallery from "@/components/home/Gallery";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Banner / Hero Section */}
      <Hero />

      {/* 2. Feature Section */}
      <Features />

      {/* 3. Recent Upcoming Events Section (Dynamic 6 items using .limit(6)) */}
      <RecentEvents />

      {/* 4. Gallery Section (Photographs of community services) */}
      <Gallery />

      {/* 5. Newsletter Subscription Section */}
      <Newsletter />
    </div>
  );
}
