"use client";
import Link from "next/link";
import React from "react";
import { useAuth } from "./contexts/AuthContext";

  const cards = [
    { href: "/checkin-tree", title: "簽到樹", icon: "🌳" },
    { href: "/mood", title: "心情溫度計", icon: "😊" },
    { href: "/courses", title: "課程內容", icon: "📚" },
    { href: "/login", title: "人員登入", icon: "🔐" },
  ];

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 sm:text-5xl mb-12">代間共學互動平台</h1>
          
          
          {/* 四格功能 - 正方形排列，移除白色背景 */}
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
            {cards.map((c) => (
              <Link key={c.href} href={c.href} className="group rounded-xl border border-gray-200 bg-white text-center shadow-sm transition hover:shadow-md w-[375px] h-[375px] flex flex-col justify-center">
                <div className="flex-1 flex items-center justify-center" aria-hidden>
                  <span className="text-9xl">{c.icon}</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 pb-6">{c.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}