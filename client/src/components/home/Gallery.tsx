import React from "react";
import Image from "next/image";
import { Camera, MapPin } from "lucide-react";

export default function Gallery() {
  const photos = [
    {
      title: "Winter Clothes & Blanket Drive",
      location: "Mohammadpur, Dhaka",
      cause: "Donation",
      image:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Urban Tree Plantation & Care",
      location: "Dhanmondi Lake, Dhaka",
      cause: "Plantation",
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Community Clean Streets Campaign",
      location: "Mirpur 10, Dhaka",
      cause: "Cleanup",
      image:
        "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Warm Meal & Nutrition Distribution",
      location: "Kawran Bazar, Dhaka",
      cause: "Food Distribution",
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "After-School Youth Teaching Drive",
      location: "Rampura, Dhaka",
      cause: "Education",
      image:
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Free Community Eye & Health Checkup",
      location: "Uttara Sector 7, Dhaka",
      cause: "Healthcare",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-theme-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-theme-primary mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Moments of Impact</span>
          </div>
          <h2 className="section-title">Community Service Gallery</h2>
          <p className="section-subtitle mx-auto">
            Glimpses of real volunteers and change-makers creating lasting
            positive footprints in society.
          </p>
        </div>

        {/* Uniform Grid Layout with Equal Image Sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((item, index) => (
            <div
              key={index}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-theme-border bg-slate-900 shadow-md card-elevation"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-108 transition-transform duration-500"
              />

              {/* Gradient Shade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              {/* Tag / Chip */}
              <div className="absolute top-3.5 left-3.5">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-white/10">
                  {item.cause}
                </span>
              </div>

              {/* Caption Content */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E4572E]" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
