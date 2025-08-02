import type { Metadata } from "next";

import Navbar from "../../../components/cards/Navbar";

export const metadata: Metadata = {
  title: "EventSphere",
  description: "A Digital Event Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar isLoggedIn={false} showSignup={false} showCreateEvent={false} />
      <div className="pt-12">{children}</div>
    </>
  );
}
