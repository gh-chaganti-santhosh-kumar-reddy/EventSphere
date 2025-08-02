

"use client";
import Footer from "@/Components/footer/footer";
import IntroSection from "@/Components/sections/IntroSection";
import TrendingEvents from "@/Components/sections/TrendingEvents";
import UpcommingEvents from "@/Components/sections/upcommingEvents";
import Image from "next/image";
import Navbar from "../components/cards/Navbar";


export default function Home() {
  const handleSearch = (query: string) => {
    // TODO: Implement search logic
    alert(`Search for: ${query}`);
  };

  return (
    <>
      <Navbar isLoggedIn={false} onSearch={handleSearch} />
      <IntroSection />
      <UpcommingEvents />
      <TrendingEvents />
      <Footer />
    </>
  );
}