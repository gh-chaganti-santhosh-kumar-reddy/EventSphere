import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

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
        <nav className="fixed top-0 left-0 w-full z-50">
          <div className="flex justify-between items-center px-8 pt-2 bg-white bg-opacity-50">
             <h1
            className={`text-4xl font-bold ${dancingScript.className}`}
            style={{
              color: "#c20078ff",
              letterSpacing: "2px",
              fontWeight: 700,
              textShadow: "0 2px 8px #fff6, 0 1px 0 #fff"
            }}
          >
            EventSphere
          </h1>
            <ul className="flex gap-6 text-black">
            
            </ul>
           
          </div>        <hr className="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        </nav>
        <div className="pt-12">{children}</div>
      </>
  );
}
