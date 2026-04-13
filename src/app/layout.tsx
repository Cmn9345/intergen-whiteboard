import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { AuthProvider } from "./contexts/AuthContext";

export const metadata: Metadata = {
  title: "代間共學互動平台",
  description: "讓祖孫一起學習、一起歡笑",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
