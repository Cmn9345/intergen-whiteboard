"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type LoginAccount = {
  id: number;
  account: string;
  pinCode: string;
};

type LoginState = 'select' | 'pin' | 'success' | 'error';

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
  postitYellow: 'var(--color-postit-yellow, #FFF9C4)',
  successLight: 'var(--color-success-light, #E2F5E2)',
  success: 'var(--color-success, #3A8F4B)',
  danger: 'var(--color-danger, #D94040)',
  angryLight: 'var(--color-angry-light, #FFE4E4)',
  markerBlack: 'var(--color-marker-black, #2D2D2D)',
  shadowSketch: 'var(--shadow-sketch, 4px 4px 0 #2D2D2D)',
  shadowSketchSm: 'var(--shadow-sketch-sm, 3px 3px 0 #2D2D2D)',
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
  sp2xl: 'var(--space-2xl, 56px)',
  fsSm: 'var(--font-size-sm, 16px)',
  fsBase: 'var(--font-size-base, 20px)',
  fsLg: 'var(--font-size-lg, 24px)',
  fsXl: 'var(--font-size-xl, 28px)',
  fs2xl: 'var(--font-size-2xl, 34px)',
  transitionFast: 'var(--transition-fast, 150ms ease)',
} as const;

export default function Page() {
  const { login } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<LoginAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<LoginAccount | null>(null);
  const [pinCode, setPinCode] = useState('');
  const [loginState, setLoginState] = useState<LoginState>('select');
  const [errorShake, setErrorShake] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/login-accounts');
        if (res.ok) setAccounts(await res.json());
        else throw new Error(`HTTP ${res.status}`);
      } catch (e) {
        console.error('Failed to load login accounts:', e);
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* --- handlers --- */
  const selectAccount = (acc: LoginAccount) => {
    setSelectedAccount(acc);
    setPinCode('');
    setLoginState('pin');
  };

  const enterDigit = (d: string) => {
    if (pinCode.length >= 4) return;
    const next = pinCode + d;
    setPinCode(next);
    if (next.length === 4) {
      setTimeout(() => verifyPin(next), 200);
    }
  };

  const deleteDigit = () => setPinCode(p => p.slice(0, -1));
  const clearPin = () => setPinCode('');

  const verifyPin = (code: string) => {
    if (!selectedAccount) return;
    if (code === selectedAccount.pinCode) {
      setLoginState('success');
      localStorage.setItem('loggedInUser', JSON.stringify(selectedAccount));
      login(selectedAccount);
      setTimeout(() => router.push('/dashboard'), 1500);
    } else {
      setErrorShake(true);
      setTimeout(() => { setErrorShake(false); setPinCode(''); }, 500);
    }
  };

  const goBack = () => {
    setSelectedAccount(null);
    setPinCode('');
    setLoginState('select');
    setErrorShake(false);
  };

  /* ---- styles ---- */
  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: V.spXl,
    fontFamily: V.fontBody,
    backgroundColor: V.bg,
    backgroundImage: 'radial-gradient(circle, #d5cfc5 1px, transparent 1px)',
    backgroundSize: '32px 32px',
  };

  const containerStyle: React.CSSProperties = { width: '100%', maxWidth: 520 };

  const cardStyle: React.CSSProperties = {
    background: V.bgCard,
    borderRadius: V.wobble1,
    border: `${V.borderWidth} solid ${V.border}`,
    padding: V.sp2xl,
    boxShadow: V.shadowSketch,
    position: 'relative',
  };

  const tapeStyle: React.CSSProperties = {
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: 'translateX(-50%) rotate(-2deg)',
    width: 80,
    height: 24,
    background: 'rgba(255,249,196,0.75)',
    border: '1px solid rgba(200,180,120,0.4)',
    zIndex: 2,
  };

  const headerStyle: React.CSSProperties = { textAlign: 'center', marginBottom: V.spXl };

  const iconBoxStyle: React.CSSProperties = {
    width: 80,
    height: 80,
    borderRadius: '50%',
    border: `${V.borderWidth} solid ${V.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `0 auto ${V.spMd}`,
    background: 'var(--color-primary-lighter, #FFF3E8)',
    color: V.primary,
  };

  const h2Style: React.CSSProperties = {
    fontSize: V.fs2xl,
    fontWeight: 700,
    fontFamily: V.fontHeading,
  };

  const subStyle: React.CSSProperties = {
    color: V.textMuted,
    fontSize: V.fsLg,
    marginTop: V.spXs,
  };

  const accountGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: V.spMd,
  };

  const accountBtnBase: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: V.spSm,
    padding: V.spLg,
    borderRadius: V.wobble2,
    border: `${V.borderWidth} solid ${V.border}`,
    background: V.bgCard,
    cursor: 'pointer',
    transition: `all ${V.transitionFast}`,
    minHeight: 120,
    boxShadow: V.shadowSketchSm,
    fontFamily: V.fontHeading,
  };

  const avatarStyle = (size = 64): React.CSSProperties => ({
    width: size,
    height: size,
    borderRadius: '50%',
    border: `${V.borderWidth} solid ${V.border}`,
    background: V.postitYellow,
    color: V.markerBlack,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontFamily: V.fontHeading,
    fontSize: size > 56 ? V.fs2xl : V.fsXl,
  });

  const selectedUserStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: V.spMd,
    padding: V.spMd,
    background: V.postitYellow,
    border: `2px solid ${V.border}`,
    borderRadius: V.wobble3,
    marginBottom: V.spXl,
  };

  const pinDotsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: V.spXl,
    marginBottom: V.spXl,
  };

  const dotBase: React.CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: '50%',
    border: `${V.borderWidth} solid ${V.border}`,
    background: 'transparent',
    transition: `all ${V.transitionFast}`,
  };

  const dotFilled: React.CSSProperties = {
    ...dotBase,
    background: V.primary,
    borderColor: V.markerBlack,
    transform: 'scale(1.15)',
  };

  const dotError: React.CSSProperties = {
    ...dotBase,
    background: V.danger,
    borderColor: V.danger,
  };

  const numpadStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: V.spMd,
    maxWidth: 340,
    margin: '0 auto',
  };

  const numBtnStyle: React.CSSProperties = {
    width: 84,
    height: 84,
    borderRadius: '50%',
    border: `${V.borderWidth} solid ${V.border}`,
    background: V.bgCard,
    fontSize: V.fs2xl,
    fontWeight: 700,
    fontFamily: V.fontHeading,
    cursor: 'pointer',
    transition: `all ${V.transitionFast}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    boxShadow: V.shadowSketchSm,
  };

  const numBtnAction: React.CSSProperties = {
    ...numBtnStyle,
    border: `2px dashed ${V.borderLight}`,
    boxShadow: 'none',
    color: V.textMuted,
    fontSize: V.fsBase,
  };

  const resultIconBase: React.CSSProperties = {
    width: 96,
    height: 96,
    borderRadius: '50%',
    border: `${V.borderWidth} solid ${V.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `0 auto ${V.spLg}`,
  };

  const backLinkStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: V.spSm,
    padding: '12px 24px',
    borderRadius: V.wobble4,
    background: V.bgCard,
    border: `2px solid ${V.border}`,
    color: V.textSecondary,
    fontSize: V.fsBase,
    fontWeight: 700,
    fontFamily: V.fontHeading,
    boxShadow: V.shadowSketchSm,
    transition: `all ${V.transitionFast}`,
    cursor: 'pointer',
    textDecoration: 'none',
  };

  /* ---- Loading state ---- */
  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{ textAlign: 'center', fontFamily: V.fontHeading, fontSize: V.fsLg, color: V.textMuted }}>
          <div style={{
            width: 48, height: 48, border: `4px dashed ${V.border}`, borderTopColor: V.primary,
            borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 18px',
          }} />
          載入帳號中...
          <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}} @keyframes celebrate{0%{transform:scale(.5) rotate(-5deg);opacity:0}50%{transform:scale(1.15) rotate(3deg)}100%{transform:scale(1) rotate(0);opacity:1}}`}</style>
        </div>
      </div>
    );
  }

  /* ---- Render ---- */
  return (
    <div style={pageStyle}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}} @keyframes celebrate{0%{transform:scale(.5) rotate(-5deg);opacity:0}50%{transform:scale(1.15) rotate(3deg)}100%{transform:scale(1) rotate(0);opacity:1}}`}</style>
      <div style={containerStyle}>
        <div style={cardStyle}>
          {/* Tape decoration */}
          <div style={tapeStyle} />

          {/* Step 1: Account Selection */}
          {loginState === 'select' && (
            <div>
              <div style={headerStyle}>
                <div style={iconBoxStyle}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <h2 style={h2Style}>人員登入</h2>
                <p style={subStyle}>請選擇您的帳號</p>
              </div>
              <div style={accountGridStyle}>
                {accounts.length === 0 ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: V.sp2xl, color: V.textMuted, fontFamily: V.fontHeading, fontSize: V.fsLg }}>
                    無法載入帳號資料
                  </div>
                ) : accounts.map((acc, i) => (
                  <button
                    key={acc.id}
                    onClick={() => selectAccount(acc)}
                    style={{
                      ...accountBtnBase,
                      transform: i % 2 === 0 ? 'rotate(-0.5deg)' : 'rotate(0.5deg)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = V.postitYellow;
                      (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px) rotate(0deg)';
                      (e.currentTarget as HTMLElement).style.boxShadow = V.shadowSketch;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = V.bgCard;
                      (e.currentTarget as HTMLElement).style.transform = i % 2 === 0 ? 'rotate(-0.5deg)' : 'rotate(0.5deg)';
                      (e.currentTarget as HTMLElement).style.boxShadow = V.shadowSketchSm;
                    }}
                  >
                    <div style={avatarStyle(64)}>{acc.account.charAt(0)}</div>
                    <span style={{ fontSize: V.fsXl, fontWeight: 700 }}>{acc.account}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: PIN Input */}
          {loginState === 'pin' && selectedAccount && (
            <div style={{ textAlign: 'center' }}>
              <div style={headerStyle}>
                <h2 style={h2Style}>輸入 PIN 碼</h2>
              </div>

              <div style={selectedUserStyle}>
                <div style={avatarStyle(56)}>{selectedAccount.account.charAt(0)}</div>
                <span style={{ fontSize: V.fsXl, fontWeight: 700, fontFamily: V.fontHeading }}>{selectedAccount.account}</span>
                <button onClick={goBack} title="重新選擇" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div style={{
                ...pinDotsStyle,
                ...(errorShake ? { animation: 'shake 0.4s ease' } : {}),
              }}>
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    style={errorShake ? dotError : (i < pinCode.length ? dotFilled : dotBase)}
                  />
                ))}
              </div>

              <div style={numpadStyle}>
                {['1','2','3','4','5','6','7','8','9'].map(d => (
                  <button
                    key={d}
                    style={numBtnStyle}
                    onClick={() => enterDigit(d)}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = V.postitYellow;
                      (e.currentTarget as HTMLElement).style.transform = 'translate(-1px,-1px)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = V.bgCard;
                      (e.currentTarget as HTMLElement).style.transform = 'none';
                    }}
                  >
                    {d}
                  </button>
                ))}
                <button style={numBtnAction} onClick={clearPin} title="清除">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>
                  </svg>
                </button>
                <button
                  style={numBtnStyle}
                  onClick={() => enterDigit('0')}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = V.postitYellow;
                    (e.currentTarget as HTMLElement).style.transform = 'translate(-1px,-1px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = V.bgCard;
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                  }}
                >
                  0
                </button>
                <button style={numBtnAction} onClick={deleteDigit} title="刪除">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Result - Success */}
          {loginState === 'success' && (
            <div style={{ textAlign: 'center', padding: `${V.spXl} 0` }}>
              <div style={{ ...resultIconBase, background: V.successLight, color: V.success, animation: 'celebrate 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div style={{ fontSize: V.fs2xl, fontWeight: 700, fontFamily: V.fontHeading, marginBottom: V.spSm }}>
                登入成功
              </div>
              <div style={{ color: V.textMuted, fontSize: V.fsLg }}>
                歡迎回來，{selectedAccount?.account}
              </div>
            </div>
          )}

          {/* Step 3: Result - Error */}
          {loginState === 'error' && (
            <div style={{ textAlign: 'center', padding: `${V.spXl} 0` }}>
              <div style={{ ...resultIconBase, background: V.angryLight, color: V.danger }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </div>
              <div style={{ fontSize: V.fs2xl, fontWeight: 700, fontFamily: V.fontHeading, marginBottom: V.spSm }}>
                PIN 碼錯誤
              </div>
              <div style={{ color: V.textMuted, fontSize: V.fsLg, marginBottom: V.spLg }}>
                請重新嘗試
              </div>
              <button
                onClick={goBack}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  gap: V.spSm, padding: '14px 28px', borderRadius: V.wobble1,
                  border: `${V.borderWidth} solid ${V.border}`, fontSize: V.fsLg,
                  fontWeight: 700, fontFamily: V.fontHeading, background: V.primary,
                  color: V.textInverse, cursor: 'pointer', boxShadow: V.shadowSketchSm,
                }}
              >
                重新嘗試
              </button>
            </div>
          )}
        </div>

        {/* Back to home */}
        <div style={{ textAlign: 'center', marginTop: V.spLg }}>
          <Link href="/" style={backLinkStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
