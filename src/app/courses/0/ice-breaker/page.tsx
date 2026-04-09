"use client";

import { useState } from "react";
import Link from "next/link";
import FloatingNav from "@/app/courses/_components/FloatingNav";

const steps = [
  {
    title: "\u{1F44B} \u81EA\u6211\u4ECB\u7D39\u6642\u9593",
    items: [
      "\u8AAA\u51FA\u81EA\u5DF1\u7684\u540D\u5B57",
      "\u6700\u559C\u6B61\u7684\u984F\u8272\u662F\u4EC0\u9EBC\uFF1F",
      "\u6700\u559C\u6B61\u5403\u4EC0\u9EBC\u98DF\u7269\uFF1F",
      "\u5E73\u5E38\u6700\u559C\u6B61\u505A\u4EC0\u9EBC\u6D3B\u52D5\uFF1F",
    ],
  },
  {
    title: "\u{1F3AF} \u914D\u5C0D\u5C0F\u904A\u6232",
    items: [
      "\u5C0F\u670B\u53CB\u548C\u9577\u8F29\u914D\u5C0D\u6210\u4E00\u7D44",
      "\u4E92\u76F8\u8A18\u4F4F\u5C0D\u65B9\u7684\u540D\u5B57",
      "\u4E00\u8D77\u5B8C\u6210\u7C21\u55AE\u7684\u9ED8\u5951\u6311\u6230",
      "\u5EFA\u7ACB\u5C0F\u7D44\u540D\u7A31\u548C\u53E3\u865F",
    ],
  },
  {
    title: "\u{1F4AA} \u4FE1\u4EFB\u8207\u9F13\u52F5",
    items: [
      "\u4E92\u76F8\u8AAA\u4E00\u53E5\u9F13\u52F5\u7684\u8A71",
      "\u7DF4\u7FD2\u7528\u624B\u52E2\u8868\u9054\u300C\u4F60\u597D\u68D2\u300D",
      "\u4E00\u8D77\u5927\u8072\u558A\u51FA\u5C0F\u7D44\u53E3\u865F",
      "\u62CD\u624B\u6176\u795D\u8A8D\u8B58\u65B0\u670B\u53CB\uFF01",
    ],
  },
];

export default function IceBreakerPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const s = steps[currentStep];

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ flex: 1, overflow: "auto", maxWidth: 860, margin: "0 auto", padding: "var(--space-lg)", width: "100%" }}>
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <Link href="/courses/0" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          回到第 1 週
        </Link>
      </div>

      <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--font-size-4xl)", fontFamily: "var(--font-heading)", transform: "rotate(-0.5deg)" }}>🤝 破冰遊戲</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xl)", marginTop: "var(--space-xs)" }}>認識新朋友，建立小默契</p>
      </div>

      {/* Steps Indicator */}
      <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-lg)", marginBottom: "var(--space-xl)" }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: 48, height: 48, borderRadius: "50%",
              border: "var(--border-width) solid var(--color-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontFamily: "var(--font-heading)", fontSize: "var(--font-size-xl)",
              background: i === currentStep ? "var(--color-primary)" : i < currentStep ? "var(--color-success-light)" : "var(--color-bg-card)",
              color: i === currentStep ? "white" : i < currentStep ? "var(--color-success)" : undefined,
              transform: i === currentStep ? "scale(1.1)" : undefined,
              transition: "all var(--transition-fast)",
              boxShadow: "var(--shadow-sketch-sm)",
            }}
          >
            {i < currentStep ? "\u2713" : i + 1}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div style={{
        background: "var(--color-bg-card)",
        border: "var(--border-width) solid var(--color-border)",
        borderRadius: "var(--wobble-1)",
        padding: "var(--space-2xl)",
        boxShadow: "var(--shadow-sketch)",
        minHeight: 300,
      }}>
        <h2 style={{ fontSize: "var(--font-size-3xl)", fontFamily: "var(--font-heading)", marginBottom: "var(--space-lg)", display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          {s.title}
        </h2>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-md)", padding: 0, margin: 0 }}>
          {s.items.map((item, idx) => (
            <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-md)", fontSize: "var(--font-size-xl)", lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", border: "3px solid var(--color-primary)", flexShrink: 0, marginTop: 10 }} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      </div>
      <FloatingNav
        onPrev={currentStep > 0
          ? { onClick: () => setCurrentStep(currentStep - 1), label: `${currentStep}/${steps.length}` }
          : undefined}
        prev={currentStep === 0 ? { href: "/courses/0", label: "回課程" } : undefined}
        onNext={currentStep < steps.length - 1
          ? { onClick: () => setCurrentStep(currentStep + 1), label: `${currentStep + 2}/${steps.length}` }
          : undefined}
        next={currentStep === steps.length - 1 ? { href: "/courses/0/together", label: "一起動一動" } : undefined}
      />
    </div>
  );
}
