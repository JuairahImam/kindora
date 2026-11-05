import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Kindora — Social Development Events Platform",
    template: "%s | Kindora",
  },
  description:
    "Kindora connects local citizens with grassroots social service initiatives across Dhaka and beyond. Discover cleanups, plantation drives, winter relief, and education workshops.",
  keywords: [
    "social development",
    "community service",
    "volunteering",
    "Dhaka events",
    "winter clothes distribution",
    "tree plantation",
    "humanitarian aid",
    "Kindora",
  ],
  authors: [{ name: "Kindora Community Network" }],
  openGraph: {
    title: "Kindora — Social Development Events Platform",
    description:
      "Community-driven platform to create, join, and track social welfare events in your local area.",
    url: "https://client-five-phi-98.vercel.app",
    siteName: "Kindora",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kindora — Social Development Events Platform",
    description:
      "Small Acts. Big Changes. Join grassroots community initiatives in your area.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-theme-bg text-theme-body antialiased"
      >
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
