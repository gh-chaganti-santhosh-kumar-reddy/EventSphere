"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  "/images/card-top.jpg",
  "/images/card-top2.jpg",
  "/images/card-top3.jpg",
  "/images/card-top.jpg",
  "/images/card-top2.jpg",
];

export default function EventCard() {
  const [location] = useState("Rajahmundry");
  const [type] = useState("paid");
  const [current, setCurrent] = useState(0);
  const [registrations] = useState<number>(256); // Static value, no API calls

  // Carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const shareUrl = "https://eventsphere.com/event/1";
  const shareText = encodeURIComponent(
    "Check out this event: Great AppSec Hackathon 2025!"
  );

  return (
    <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl overflow-hidden max-w-xl mx-auto p-4 mb-2">
      {/* Glow ring effect */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl opacity-60 z-0"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl opacity-50 z-0"></div>

      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* Carousel Image */}
        <div className="relative w-96 h-45 rounded-2xl overflow-hidden">
          <Image
            src={images[current]}
            alt={`Event Image ${current + 1}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>
        <div className="flex items-center mt-2">
          <div className="flex text-xs font-sans items-center">
            <Image src="/icons/location.png" alt="Location" width={13} height={13} />
            <span className="ml-1">{location}</span>
          </div>
          <div className="mx-2">|</div>
          <div className="flex text-sm font-sans items-center">
            <Image src="/icons/save-money.png" alt="Type" width={13} height={13} />
            <span className="ml-1">{type}</span>
          </div>
        </div>

        <h4 className="text-xl font-semibold mb-2">
          Great AppSec Hackathon 2025
        </h4>

        <div className="flex justify-between items-center text-xs mb-1">
          <div className="flex gap-2 items-center font-bold">
            <Image src="/icons/calendar.png" alt="Date" width={20} height={20} />
            May 08, 2025
          </div>
          <Image
            className="hover:scale-110 transition-transform"
            src="/icons/love.png"
            alt="Ribbon"
            width={16}
            height={15}
          />
        </div>

        {/* Registration count and LIVE badge */}
        <div className="text-sm  flex items-center gap-2 mb-1">
          <span className="text-blue-600 text-xs font-bold">{registrations}</span> <span className="text-xs">registrations</span>
          <span
            className="inline-flex items-center px-0.5 py-0.5 bg-red-500 text-xs rounded animate-pulse"
            style={{ color: "white", fontWeight: "bold" }}
            title="Live registration count"
          >
            <span className="w-1 h-1 bg-white rounded-full mr-1"></span>LIVE
          </span>
        </div>

        <div className="flex justify-between items-center text-sm mb-4">
          <div className="flex gap-2  text-xs items-center">
            <Image src="/icons/businessman.png" alt="Audience" width={20} height={20} />
            Professional
          </div>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}&text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
            aria-label="Share event on Twitter"
          >
            <Image src="/icons/send.png" alt="Share" width={16} height={20} />
          </a>
        </div>

        <div className="flex justify-center">
          <button
            className="bg-gradient-to-r text-sm from-purple-500 to-blue-500 py-2 px-4 rounded-full shadow-md hover:from-purple-600 hover:to-blue-600 transition"
            aria-label="Register for event"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}