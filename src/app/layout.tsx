import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineGeo — Georgian Cinema Experience",
  description: "Book movie tickets at Georgia's premier cinema chain. Premium screenings, VIP seating, and the best of Georgian and international cinema.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
