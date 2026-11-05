"use client";

import { useEffect, useRef, useState } from "react";
import { Users, CalendarCheck, MapPin, Heart } from "lucide-react";

interface Stat {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const STATS: Stat[] = [
  {
    icon: <CalendarCheck className="w-6 h-6" />,
    value: 120,
    suffix: "+",
    label: "Events Organised",
    color: "text-[#E4572E]",
  },
  {
    icon: <Users className="w-6 h-6" />,
    value: 3500,
    suffix: "+",
    label: "Volunteers Joined",
    color: "text-[#F2A93B]",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    value: 28,
    suffix: "",
    label: "Cities Covered",
    color: "text-emerald-500",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    value: 15000,
    suffix: "+",
    label: "Lives Impacted",
    color: "text-pink-500",
  },
];

function useCountUp(target: number, duration = 1800, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);

  return count;
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.value, 1800, active);

  return (
    <div className="card-elevation rounded-2xl p-6 text-center flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform duration-200">
      <span className={`${stat.color} bg-current/10 p-3 rounded-xl`}>
        <span className={stat.color}>{stat.icon}</span>
      </span>
      <p className={`text-4xl font-black ${stat.color}`}>
        {count.toLocaleString()}
        {stat.suffix}
      </p>
      <p className="text-theme-body text-sm font-medium">{stat.label}</p>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 px-4 bg-theme-surface">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="section-title">Our Impact in Numbers</h2>
          <p className="text-theme-body max-w-xl mx-auto text-sm">
            Every event, every volunteer, every act of kindness adds up. Here's
            what the Kindora community has achieved together.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
