import type { Metadata } from "next";
// Removed unused font imports
import "./globals.css";


import Navbar from "../components/cards/Navbar";




export const metadata: Metadata = {
  title: "EventSphere",
  description: "A Digital Event Management Platform",
};






export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Placeholder: Replace with real authentication logic
  const isLoggedIn = true; // Set to true if user is logged in

  return (
    <html lang="en">
      <body>
        <Navbar isLoggedIn={isLoggedIn} />
        <div className="pt-24 sm:pt-16">{children}</div>
      </body>
    </html>
  );
}
