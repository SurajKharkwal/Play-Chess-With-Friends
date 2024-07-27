import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { MaxWidth } from "@/components/ui/max-width";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "CheckMate: Play Chess with Friends",
  description:
    "ChessMate: Engage in exciting chess matches with friends, anytime, anywhere. Join our community and master the game together.",
};

export const customFont = Chakra_Petch({
  subsets: ["latin"],
  weight: "500",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en" className="dark">
      <body
        className={cn(
          customFont.className,
          "flex items-center h-full flex-col min-h-dvh"
        )}
      >
        <NextTopLoader />
        <Toaster />
        <Navbar />
        <MaxWidth className="h-full " size={"lg"}>
          {children}
        </MaxWidth>
        <Footer />
      </body>
    </html>
  );
}
