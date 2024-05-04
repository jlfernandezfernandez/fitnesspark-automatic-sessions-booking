import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/providers/UserContext";
import { Analytics } from "@vercel/analytics/react";

const plusJakartaSNS = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Autobooking for Fitness Park",
  description: "Reserva tus sesiones de manera automática",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSNS.className} bg-white text-black`}>
        <UserProvider>
          {children}
          <Analytics />
        </UserProvider>
      </body>
    </html>
  );
}
