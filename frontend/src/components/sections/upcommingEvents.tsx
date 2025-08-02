"use client";
import { useRef, useEffect, useState } from "react";
import EventCard from "../cards/eventCard";

export default function UpcommingEvents() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAmount = 200;
  const scrollInterval = 3000;

  const [isPaused, setIsPaused] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Auto-scroll in circular fashion
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && scrollRef.current) {
        const container = scrollRef.current;

        // If we reach the duplicated end, reset scrollLeft instantly
        if (
          container.scrollLeft >=
          container.scrollWidth / 2
        ) {
          container.scrollLeft = 0;
        } else {
          container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Scroll progress tracking (normalized to first half)
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const progress =
          (container.scrollLeft /
            ((container.scrollWidth / 2) - container.offsetWidth)) *
          100;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const eventCards = Array(6).fill(null); // original cards

  return (
    <div className="mx-10">
      <div className="mt-10 mb-2">
        <h1 className="text-3xl mt-2 mb-3 font-sans font-bold">
          Upcoming Events:
        </h1>

        <div className="relative pl-3 w-full">
          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth rounded-lg no-scrollbar px-8"
            style={{ scrollbarWidth: "none" }}
          >
            {[...eventCards, ...eventCards].map((_, index) => (
              <div
                className="flex-shrink-0"
                key={index}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <EventCard />
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-1 w-full bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
