import React from "react";
import { Search, CalendarPlus, UserCheck, BarChart3 } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Search,
      title: "Discover Nearby Causes",
      description:
        "Filter and browse verified social welfare initiatives by event category, neighborhood location, and upcoming dates in real-time.",
      badge: "Explore",
    },
    {
      icon: CalendarPlus,
      title: "Create Events in Minutes",
      description:
        "Easily publish your community cleanup, blanket distribution, or tree plantation campaign with custom dates, details, and guidelines.",
      badge: "Organize",
    },
    {
      icon: UserCheck,
      title: "Join with a Single Click",
      description:
        "Enlist as an active volunteer with instant confirmation, automatic duplicate protection, and direct coordination with organizers.",
      badge: "Participate",
    },
    {
      icon: BarChart3,
      title: "Manage & Track Impact",
      description:
        "View all your organized initiatives in one place, update event details, and review your chronologically sorted joined events anytime.",
      badge: "Track",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-theme-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-theme-primary mb-2 block">
            Why Kindora
          </span>
          <h2 className="section-title">
            Empowering Citizens to Drive Grassroots Change
          </h2>
          <p className="section-subtitle mx-auto">
            Everything you need to organize, find, and join meaningful social
            development projects in your city.
          </p>
        </div>

        {/* 4-Card Equal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="card-elevation p-6 rounded-2xl flex flex-col justify-between h-full group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-theme-primary-soft text-theme-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-theme-body/80 bg-theme-border/40 px-2.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-theme-heading group-hover:text-theme-primary transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-theme-body">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
