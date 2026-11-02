import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/styles/tokens.css";
import "@/styles/layout-tokens.css";
import "@/styles/fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyFee",
  description: "School fees, clear for every family.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
