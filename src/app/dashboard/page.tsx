"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getStudents, getCheckins, getMoods } from '@/lib/api';

/* ---- CSS variable tokens (whiteboard theme) ---- */
const V = {
  bg: 'var(--color-bg, #FDFBF7)',
  bgCard: 'var(--color-bg-card, #FFFFFF)',
  surface: 'var(--color-surface, #F5F0E8)',
  border: 'var(--color-border, #2D2D2D)',
  borderLight: 'var(--color-border-light, #C4B8A8)',
  textPrimary: 'var(--color-text-primary, #2D2D2D)',
  textSecondary: 'var(--color-text-secondary, #5A5347)',
  textMuted: 'var(--color-text-muted, #8A7E72)',
  textInverse: 'var(--color-text-inverse, #FDFBF7)',
  primary: 'var(--color-primary, #E8874A)',
  primaryDark: 'var(--color-primary-dark, #C86A2E)',
  primaryLighter: 'var(--color-primary-lighter, #FFF3E8)',
  secondaryLighter: 'var(--color-secondary-lighter, #E8F0FA)',
  secondary: 'var(--color-secondary, #2D5DA1)',
  postitYellow: 'var(--color-postit-yellow, #FFF9C4)',
  postitPink: 'var(--color-postit-pink, #FFE0E8)',
  postitBlue: 'var(--color-postit-blue, #D8ECFF)',
  postitGreen: 'var(--color-postit-green, #D8F5D8)',
  happyLight: 'var(--color-happy-light, #FFF9D4)',
  danger: 'var(--color-danger, #D94040)',
  markerBlack: 'var(--color-marker-black, #2D2D2D)',
  shadowSketch: 'var(--shadow-sketch, 4px 4px 0 #2D2D2D)',
  shadowSketchSm: 'var(--shadow-sketch-sm, 3px 3px 0 #2D2D2D)',
  shadowSketchHover: 'var(--shadow-sketch-hover, 6px 6px 0 #2D2D2D)',
  shadowSketchPressed: 'var(--shadow-sketch-pressed, 1px 1px 0 #2D2D2D)',
  wobble1: 'var(--wobble-1, 15px 25px 20px 10px)',
  wobble2: 'var(--wobble-2, 20px 10px 25px 15px)',
  wobble3: 'var(--wobble-3, 10px 20px 15px 25px)',
  wobble4: 'var(--wobble-4, 25px 15px 10px 20px)',
  borderWidth: 'var(--border-width, 3px)',
  fontHeading: "var(--font-heading, 'Kalam', 'Noto Sans TC', cursive)",
  fontBody: "var(--font-body, 'Patrick Hand', 'Noto Sans TC', cursive)",
  spXs: 'var(--space-xs, 6px)',
  spSm: 'var(--space-sm, 10px)',
  spMd: 'var(--space-md, 18px)',
  spLg: 'var(--space-lg, 28px)',
  spXl: 'var(--space-xl, 40px)',
  fsSm: 'var(--font-size-sm, 16px)',
  fsBase: 'var(--font-size-base, 20px)',
  fsLg: 'var(--font-size-lg, 24px)',
  fsXl: 'var(--font-size-xl, 28px)',
  fs2xl: 'var(--font-size-2xl, 34px)',
  fs3xl: 'var(--font-size-3xl, 42px)',
  fs4xl: 'var(--font-size-4xl, 52px)',
  transitionFast: 'var(--transition-fast, 150ms ease)',
} as const;

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ students: '--', checkins: '--', moods: '--', week: '1' });

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const students = await getStudents();
        const checkins = await getCheckins('1');
        const moods = await getMoods('1');
        setStats({
          students: String(students.length),
          checkins: String(checkins.length),
          moods: String(moods.length),
          week: '1',
        });
      } catch (e) {
        console.error('Failed to load stats:', e);
      }
    })();
  }, [isAuthenticated]);

  const pageStyle: React.CSSProperties = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: V.fontBody,
    backgroundColor: V.bg,
    backgroundImage: 'radial-gradient(circle, #d5cfc5 1px, transparent 1px)',
    backgroundSize: '32px 32px',
  };

  /* Not logged in */
  if (!isAuthenticated) {
    return (
      <div style={pageStyle}>
        <div style={{ textAlign: 'center', padding: '80px 40px', fontFamily: V.fontHeading }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', border: `${V.borderWidth} solid ${V.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: `0 auto ${V.spLg}`, background: V.primaryLighter, color: V.primary,
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 style={{ fontSize: V.fs2xl, marginBottom: V.spSm }}>尚未登入</h2>
          <p style={{ color: V.textMuted, fontSize: V.fsLg, marginBottom: V.spLg }}>請先登入以使用管理功能</p>
          <Link href="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: V.spSm,
            padding: '18px 36px', borderRadius: V.wobble1, border: `${V.borderWidth} solid ${V.border}`,
            fontSize: V.fsXl, fontWeight: 700, fontFamily: V.fontHeading,
            background: V.primary, color: V.textInverse, boxShadow: V.shadowSketchSm,
            textDecoration: 'none', cursor: 'pointer',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            前往登入
          </Link>
        </div>
      </div>
    );
  }

  const userName = user?.account || '使用者';

  const managementCards = [
    {
      title: '心情紀錄', desc: '查看與管理所有心情投票紀錄', href: '/dashboard/mood-records',
      iconBg: V.happyLight, iconColor: '#B8860B',
      icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>,
    },
    {
      title: '簽到紀錄', desc: '查看各週簽到狀況與出席率', href: '/dashboard/signintree-records',
      iconBg: V.secondaryLighter, iconColor: V.secondary,
      icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>,
    },
    {
      title: '課程管理', desc: '查看與管理所有課程內容', href: '/courses',
      iconBg: '#F0ECF8', iconColor: '#8B7EC8',
      icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
    },
    {
      title: '回到前台', desc: '回到互動平台首頁', href: '/',
      iconBg: V.primaryLighter, iconColor: V.primary,
      icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    },
  ];

  const wobbles = [V.wobble1, V.wobble2, V.wobble3, V.wobble4];
  const rotations = ['-0.5deg', '0.3deg', '0.6deg', '-0.4deg'];
  const statBgs = [V.postitBlue, V.postitGreen, V.postitYellow, V.postitPink];
  const statLabels = ['總學員數', '本週簽到', '心情投票', '目前週次'];
  const statValues = [stats.students, stats.checkins, stats.moods, stats.week];

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ padding: `${V.spXl} ${V.spXl} 0`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: V.spLg }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', border: `${V.borderWidth} solid ${V.border}`,
            background: V.postitYellow, color: V.markerBlack, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: V.fs3xl, fontWeight: 700, fontFamily: V.fontHeading,
            boxShadow: V.shadowSketchSm, transform: 'rotate(-2deg)',
          }}>
            {userName[0]}
          </div>
          <div>
            <div style={{ fontSize: V.fsBase, color: V.textMuted }}>歡迎回來</div>
            <div style={{ fontSize: V.fs3xl, fontWeight: 700, fontFamily: V.fontHeading }}>{userName}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: V.spSm }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: V.spSm,
            padding: '10px 20px', background: 'transparent', color: V.textSecondary,
            border: `2px dashed ${V.borderLight}`, borderRadius: V.wobble1,
            fontWeight: 700, fontFamily: V.fontHeading, fontSize: V.fsBase,
            textDecoration: 'none', cursor: 'pointer',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            首頁
          </Link>
          <button onClick={() => { logout(); router.push('/'); }} style={{
            display: 'inline-flex', alignItems: 'center', gap: V.spSm,
            padding: '14px 28px', borderRadius: V.wobble1, border: `${V.borderWidth} solid ${V.border}`,
            fontSize: V.fsLg, fontWeight: 700, fontFamily: V.fontHeading,
            background: V.bgCard, color: V.danger, borderColor: V.danger,
            boxShadow: V.shadowSketchSm, cursor: 'pointer',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            登出
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: V.spXl, maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        {/* Section: Quick Stats */}
        <div style={{
          fontSize: V.fsXl, fontWeight: 700, color: V.textSecondary, marginBottom: V.spMd,
          display: 'flex', alignItems: 'center', gap: V.spSm, fontFamily: V.fontHeading,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          快速統計
        </div>
        <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: V.spMd, marginBottom: V.spXl }}>
          {statLabels.map((label, i) => (
            <div key={label} style={{
              background: statBgs[i], border: `${V.borderWidth} solid ${V.border}`,
              borderRadius: wobbles[i], padding: V.spLg, boxShadow: V.shadowSketchSm, textAlign: 'center',
            }}>
              <div style={{ fontSize: V.fsBase, color: V.textSecondary, marginBottom: V.spXs, fontFamily: V.fontHeading }}>
                {label}
              </div>
              <div style={{ fontSize: V.fs4xl, fontWeight: 700, fontFamily: V.fontHeading }}>
                {statValues[i]}
              </div>
            </div>
          ))}
        </div>

        {/* Section: Management */}
        <div style={{
          fontSize: V.fsXl, fontWeight: 700, color: V.textSecondary, marginBottom: V.spMd,
          display: 'flex', alignItems: 'center', gap: V.spSm, fontFamily: V.fontHeading,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
          </svg>
          管理功能
        </div>
        <div className="dash-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: V.spLg, marginBottom: V.spXl }}>
          {managementCards.map((card, i) => (
            <Link
              key={card.title}
              href={card.href}
              style={{
                background: V.bgCard,
                border: `${V.borderWidth} solid ${V.border}`,
                padding: V.spXl,
                cursor: 'pointer',
                transition: `all ${V.transitionFast}`,
                boxShadow: V.shadowSketch,
                display: 'flex',
                alignItems: 'flex-start',
                gap: V.spLg,
                borderRadius: wobbles[i],
                transform: `rotate(${rotations[i]})`,
                textDecoration: 'none',
                color: 'inherit',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px) rotate(0deg)';
                (e.currentTarget as HTMLElement).style.boxShadow = V.shadowSketchHover;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = `rotate(${rotations[i]})`;
                (e.currentTarget as HTMLElement).style.boxShadow = V.shadowSketch;
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                border: `${V.borderWidth} solid ${V.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                background: card.iconBg, color: card.iconColor,
              }}>
                {card.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: V.fsXl, fontWeight: 700, fontFamily: V.fontHeading, marginBottom: V.spXs }}>
                  {card.title}
                </div>
                <div style={{ fontSize: V.fsBase, color: V.textMuted, marginBottom: V.spMd }}>
                  {card.desc}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: V.spXs,
                  color: V.textMuted, fontSize: V.fsBase, fontWeight: 700, fontFamily: V.fontHeading,
                }}>
                  查看詳情
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
