"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getCheckins, getStudents, deleteCheckin, deleteAllCheckins, type CheckinRecord, type Student } from '@/lib/api';

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
  postitBlue: 'var(--color-postit-blue, #D8ECFF)',
  postitGreen: 'var(--color-postit-green, #D8F5D8)',
  postitYellow: 'var(--color-postit-yellow, #FFF9C4)',
  successLight: 'var(--color-success-light, #E2F5E2)',
  success: 'var(--color-success, #3A8F4B)',
  secondaryLighter: 'var(--color-secondary-lighter, #E8F0FA)',
  secondary: 'var(--color-secondary, #2D5DA1)',
  markerBlack: 'var(--color-marker-black, #2D2D2D)',
  shadowSketch: 'var(--shadow-sketch, 4px 4px 0 #2D2D2D)',
  shadowSketchSm: 'var(--shadow-sketch-sm, 3px 3px 0 #2D2D2D)',
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
  fs3xl: 'var(--font-size-3xl, 42px)',
  transitionFast: 'var(--transition-fast, 150ms ease)',
} as const;

export default function SignintreeRecordsPage() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [checkins, setCheckins] = useState<CheckinRecord[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async (week: number) => {
    setLoading(true);
    try {
      const [checkinData, studentData] = await Promise.all([
        getCheckins(String(week)),
        getStudents(),
      ]);
      setCheckins(checkinData);
      setTotalStudents(studentData.length);
    } catch (e) {
      console.error('Failed to load checkins:', e);
      setCheckins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(currentWeek); }, [currentWeek, loadData]);

  const switchWeek = (w: number) => setCurrentWeek(w);

  const checkinRate = totalStudents > 0
    ? Math.round((checkins.length / totalStudents) * 100)
    : 0;

  const wobbles = [V.wobble1, V.wobble2, V.wobble3, V.wobble4];

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

  const headerStyle: React.CSSProperties = {
    padding: `${V.spLg} ${V.spXl}`,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  };

  const backBtnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: V.spSm,
    padding: '12px 24px', borderRadius: V.wobble4, background: V.bgCard,
    border: `2px solid ${V.border}`, color: V.textSecondary,
    fontSize: V.fsBase, fontWeight: 700, fontFamily: V.fontHeading,
    boxShadow: V.shadowSketchSm, textDecoration: 'none', cursor: 'pointer',
  };

  const refreshBtnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: V.spSm,
    padding: '14px 28px', borderRadius: V.wobble1,
    border: `${V.borderWidth} solid ${V.border}`,
    fontSize: V.fsLg, fontWeight: 700, fontFamily: V.fontHeading,
    background: V.bgCard, color: V.textSecondary,
    boxShadow: V.shadowSketchSm, cursor: 'pointer',
  };

  const weekTabsStyle: React.CSSProperties = {
    display: 'flex', gap: V.spXs, background: V.surface,
    border: `2px solid ${V.borderLight}`, padding: 6,
    borderRadius: V.wobble1, marginBottom: V.spXl, flexWrap: 'wrap',
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: V.wobble2, fontWeight: 700,
    fontSize: V.fsBase, fontFamily: V.fontHeading,
    color: active ? V.textPrimary : V.textMuted, cursor: 'pointer',
    transition: `all ${V.transitionFast}`,
    border: active ? `2px solid ${V.border}` : '2px solid transparent',
    background: active ? V.bgCard : 'transparent',
    boxShadow: active ? V.shadowSketchSm : 'none',
  });

  const summaryData = [
    {
      label: '總簽到數', value: checkins.length, bg: V.postitBlue,
      iconColor: V.textSecondary,
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>,
    },
    {
      label: '簽到率', value: `${checkinRate}%`, bg: V.postitGreen,
      iconColor: V.success,
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    },
  ];

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: V.spLg }}>
          <Link href="/dashboard" style={backBtnStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            儀表板
          </Link>
          <h1 style={{
            fontSize: V.fs3xl, fontWeight: 700, fontFamily: V.fontHeading,
            transform: 'rotate(-0.8deg)',
          }}>
            簽到紀錄
          </h1>
        </div>
        <div style={{ display: 'flex', gap: V.spSm }}>
          <button style={refreshBtnStyle} onClick={() => loadData(currentWeek)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            {loading ? '載入中...' : '重新整理'}
          </button>
          <button style={{ ...refreshBtnStyle, color: 'var(--color-angry, #E06B6B)', borderColor: 'var(--color-angry, #E06B6B)' }} onClick={async () => {
            if (!confirm(`確定要刪除第 ${currentWeek} 週的所有簽到紀錄嗎？`)) return;
            const count = await deleteAllCheckins(String(currentWeek));
            alert(`已刪除 ${count} 筆簽到紀錄`);
            loadData(currentWeek);
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            清除本週
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: `0 ${V.spXl} ${V.spXl}`, maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        {/* Week Tabs */}
        <div style={weekTabsStyle}>
          {Array.from({ length: 9 }, (_, i) => i + 1).map(w => (
            <button key={w} style={tabStyle(w === currentWeek)} onClick={() => switchWeek(w)}>
              第 {w} 週
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: V.spMd, marginBottom: V.spXl }}>
          {summaryData.map((s, i) => (
            <div key={s.label} style={{
              background: s.bg, border: `${V.borderWidth} solid ${V.border}`,
              padding: V.spLg, boxShadow: V.shadowSketchSm,
              display: 'flex', alignItems: 'center', gap: V.spMd,
              borderRadius: wobbles[i],
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                border: `2px solid ${V.border}`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                background: V.bgCard, color: s.iconColor,
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: V.fs3xl, fontWeight: 700, fontFamily: V.fontHeading, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: V.fsBase, color: V.textSecondary, marginTop: 4, fontFamily: V.fontHeading }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail List */}
        <div style={{
          background: V.bgCard, border: `${V.borderWidth} solid ${V.border}`,
          boxShadow: V.shadowSketch, overflow: 'hidden', borderRadius: V.wobble1,
        }}>
          {/* Section header */}
          <div style={{
            padding: `${V.spMd} ${V.spLg}`, display: 'flex', alignItems: 'center', gap: V.spSm,
            fontWeight: 700, fontSize: V.fsXl, fontFamily: V.fontHeading,
            borderBottom: `${V.borderWidth} solid ${V.border}`, background: V.successLight,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>
            </svg>
            已簽到學員
            <span style={{ marginLeft: 'auto', fontSize: V.fsBase, color: V.textMuted, fontWeight: 500 }}>
              {checkins.length} / {totalStudents} 人
            </span>
          </div>
          {/* List */}
          <div style={{ padding: V.spSm, maxHeight: 600, overflowY: 'auto' }}>
            {checkins.length === 0 ? (
              <div style={{ padding: V.spXl, textAlign: 'center', color: V.textMuted, fontFamily: V.fontHeading, fontSize: V.fsLg }}>
                尚無簽到資料
              </div>
            ) : checkins.map((c, j) => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: V.spMd,
                padding: `${V.spSm} ${V.spMd}`, borderRadius: V.wobble3,
                fontSize: V.fsLg, transition: `background ${V.transitionFast}`,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', border: `2px solid ${V.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: V.fsBase, fontWeight: 700, fontFamily: V.fontHeading,
                  flexShrink: 0, background: V.successLight,
                }}>
                  {j + 1}
                </div>
                <div style={{ fontWeight: 700, fontFamily: V.fontHeading, flex: 1 }}>
                  {c.Name || '未知'}
                </div>
                <div style={{ fontSize: V.fsBase, color: V.textMuted }}>
                  第 {c.group || '?'} 組
                </div>
                <div style={{ fontSize: V.fsSm, color: V.textMuted }}>
                  {c.created ? new Date(c.created).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
                <button onClick={async () => { await deleteCheckin(c.id); loadData(currentWeek); }} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid var(--color-angry, #E06B6B)', background: 'transparent', color: 'var(--color-angry, #E06B6B)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} title="刪除">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
