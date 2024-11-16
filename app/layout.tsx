import type { Metadata } from "next";
import "./globals.scss";

import SmoothScroll from "@/helper/SmoothScroll";

export const metadata: Metadata = {
  title: "Project Impact",
  description: "Simple Creative Frontend Demo For Project Impact",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>
        <SmoothScroll>
          {children}
          {/* <div className="h-dvh w-screen bg-yellow-200" /> */}
        </SmoothScroll>
      </body>
    </html>
  );
}
