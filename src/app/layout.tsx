import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voyageur",
  description: "Planificateur de roadtrip pour la France",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${jakarta.variable} font-sans`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body className="h-[100dvh] w-screen overflow-hidden flex bg-slate-50 text-slate-900">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
