import React, { useState, useMemo } from "react";
import heroVideo from "./assets/hero-video.mp4";
import {
    Box,
    Container,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Paper,
    Grid,
    List,
    ListItem,
    ListItemText,
    Drawer,
    IconButton,
    CssBaseline,
    useMediaQuery,
    Alert,
    Divider,
    CircularProgress
} from "@mui/material";
import MenuIcon from "@mui/icons-material/MenuOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import { ThemeProvider, createTheme } from "@mui/material/styles";

/* ============================================================
   GLOBAL STYLES  (Landing + Login)
   ============================================================ */
const landingStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --teal: #2f8f8b;
    --teal-light: #4fd1c5;
    --dark: #0a1f1e;
    --card: #102826;
    --text: #e0f4f2;
    --muted: #7bbab6;
  }

  /* NAVBAR */
  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 60px;
    background: rgba(10,31,30,0.75);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(79,209,197,0.08);
  }
  .lp-nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 900; letter-spacing: 2px;
    background: linear-gradient(135deg, var(--teal-light), #fff);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .lp-nav-links { display: flex; gap: 36px; }
  .lp-nav-link { color: var(--muted); font-size: 14px; font-weight: 500; cursor: pointer; transition: color .2s; text-decoration: none; font-family: 'DM Sans', sans-serif; }
  .lp-nav-link:hover { color: var(--teal-light); }
  .lp-btn-ghost {
    padding: 10px 24px; border-radius: 999px;
    background: transparent; color: var(--teal-light);
    font-size: 14px; font-weight: 500; cursor: pointer;
    border: 1px solid rgba(79,209,197,0.35); transition: background .2s;
    font-family: 'DM Sans', sans-serif;
  }
  .lp-btn-ghost:hover { background: rgba(79,209,197,0.07); }
  .lp-btn-primary {
    padding: 10px 28px; border-radius: 999px;
    background: linear-gradient(90deg, var(--teal), var(--teal-light));
    color: #fff; font-size: 14px; font-weight: 500; cursor: pointer;
    border: none; transition: opacity .2s, transform .2s;
    font-family: 'DM Sans', sans-serif;
  }
  .lp-btn-primary:hover { opacity: .9; transform: translateY(-1px); }

  /* HERO */
  .lp-hero {
    min-height: 100vh; background: var(--dark);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 120px 24px 80px; position: relative; overflow: hidden;
  }
  .lp-hero-bg {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(47,143,139,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(79,209,197,0.08) 0%, transparent 60%);
  }
  .lp-hero-grid {
    position: absolute; inset: 0; opacity: .04;
    background-image: linear-gradient(rgba(79,209,197,.6) 1px, transparent 1px),
      linear-gradient(90deg, rgba(79,209,197,.6) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .lp-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 18px; border-radius: 999px;
    border: 1px solid rgba(79,209,197,0.3);
    background: rgba(79,209,197,0.06);
    color: var(--teal-light); font-size: 13px; margin-bottom: 32px;
    animation: lpFadeUp .6s ease both; font-family: 'DM Sans', sans-serif;
  }
  .lp-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal-light); animation: lpPulse 2s infinite; }

  @keyframes lpPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
  @keyframes lpFadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lpFadeIn { from{opacity:0} to{opacity:1} }
  @keyframes lpBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }

  .lp-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(48px, 8vw, 96px); font-weight: 900; line-height: 1.05;
    color: var(--text); animation: lpFadeUp .7s .1s ease both; max-width: 900px;
  }
  .lp-title span {
    background: linear-gradient(135deg, var(--teal-light), #a0f0ea, var(--teal));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .lp-sub {
    font-size: clamp(16px, 2vw, 20px); color: var(--muted);
    max-width: 560px; margin: 24px auto 48px; line-height: 1.7;
    font-weight: 300; animation: lpFadeUp .7s .2s ease both;
    font-family: 'DM Sans', sans-serif;
  }
  .lp-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; animation: lpFadeUp .7s .3s ease both; }
  .lp-btn-hero {
    padding: 16px 40px; border-radius: 999px;
    background: linear-gradient(90deg, var(--teal), var(--teal-light));
    color: #fff; font-size: 16px; font-weight: 500; cursor: pointer;
    border: none; transition: transform .2s, box-shadow .2s;
    box-shadow: 0 0 32px rgba(79,209,197,0.25);
    font-family: 'DM Sans', sans-serif;
  }
  .lp-btn-hero:hover { transform: translateY(-2px); box-shadow: 0 0 48px rgba(79,209,197,0.4); }
  .lp-btn-hero-ghost {
    padding: 16px 40px; border-radius: 999px;
    background: transparent; color: var(--teal-light);
    font-size: 16px; font-weight: 500; cursor: pointer;
    border: 1px solid rgba(79,209,197,0.35); transition: background .2s;
    font-family: 'DM Sans', sans-serif;
  }
  .lp-btn-hero-ghost:hover { background: rgba(79,209,197,0.07); }

  /* DEMO CARD */
  .lp-demo { margin-top: 64px; animation: lpFadeUp .8s .4s ease both; max-width: 700px; width: 100%; }
  .lp-demo-card {
    background: var(--card); border: 1px solid rgba(79,209,197,0.15);
    border-radius: 20px; padding: 32px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,209,197,0.05);
    text-align: left;
  }
  .lp-demo-tag { font-size: 11px; font-weight: 500; color: var(--teal-light); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; font-family: 'DM Sans', sans-serif; }
  .lp-demo-text { font-size: 14px; color: var(--muted); line-height: 1.7; font-family: 'DM Sans', sans-serif; }
  .lp-demo-arrow { text-align: center; padding: 20px 0; font-size: 28px; color: var(--teal-light); animation: lpBounce 2s infinite; }
  .lp-demo-reply { background: rgba(47,143,139,0.12); border-left: 3px solid var(--teal); border-radius: 12px; padding: 20px; }
  .lp-demo-reply-label { font-size: 11px; color: var(--teal-light); letter-spacing: 2px; margin-bottom: 8px; font-family: 'DM Sans', sans-serif; }
  .lp-demo-reply-text { font-size: 14px; color: var(--text); line-height: 1.7; font-family: 'DM Sans', sans-serif; }

  /* STATS */
  .lp-stats { padding: 80px 24px; background: rgba(47,143,139,0.05); border-top: 1px solid rgba(79,209,197,0.08); border-bottom: 1px solid rgba(79,209,197,0.08); }
  .lp-stats-inner { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; text-align: center; }
  .lp-stat-num { font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 900; background: linear-gradient(135deg, var(--teal-light), #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .lp-stat-label { font-size: 14px; color: var(--muted); margin-top: 8px; font-family: 'DM Sans', sans-serif; }

  /* FEATURES */
  .lp-features { padding: 100px 24px; max-width: 1100px; margin: 0 auto; }
  .lp-section-label { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: var(--teal-light); margin-bottom: 16px; text-align: center; font-family: 'DM Sans', sans-serif; }
  .lp-section-title { font-family: 'Playfair Display', serif; font-size: clamp(32px, 5vw, 52px); font-weight: 700; text-align: center; margin-bottom: 64px; color: var(--text); }
  .lp-feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
  .lp-feature-card {
    background: var(--card); border: 1px solid rgba(79,209,197,0.1);
    border-radius: 20px; padding: 36px;
    transition: transform .3s, border-color .3s, box-shadow .3s;
    position: relative; overflow: hidden;
  }
  .lp-feature-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--teal-light), transparent);
    opacity: 0; transition: opacity .3s;
  }
  .lp-feature-card:hover { transform: translateY(-4px); border-color: rgba(79,209,197,0.25); box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
  .lp-feature-card:hover::before { opacity: 1; }
  .lp-feature-icon { font-size: 36px; margin-bottom: 20px; }
  .lp-feature-name { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; margin-bottom: 12px; color: var(--text); }
  .lp-feature-desc { font-size: 14px; color: var(--muted); line-height: 1.7; font-family: 'DM Sans', sans-serif; }

  /* CTA */
  .lp-cta { padding: 120px 24px; text-align: center; background: var(--dark); }
  .lp-cta-title { font-family: 'Playfair Display', serif; font-size: clamp(36px, 6vw, 64px); font-weight: 900; margin-bottom: 24px; color: var(--text); }
  .lp-cta-sub { color: var(--muted); font-size: 18px; margin-bottom: 48px; font-weight: 300; font-family: 'DM Sans', sans-serif; }

  /* FOOTER */
  .lp-footer { padding: 40px 60px; border-top: 1px solid rgba(79,209,197,0.08); display: flex; align-items: center; justify-content: space-between; background: var(--dark); }
  .lp-footer-logo { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 900; color: var(--teal-light); }
  .lp-footer-copy { font-size: 13px; color: var(--muted); font-family: 'DM Sans', sans-serif; }

  /* LOGIN MODAL */
  .lp-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(10,31,30,0.85); backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
    animation: lpFadeIn .3s ease;
  }
  .lp-login-card {
    background: var(--card); border: 1px solid rgba(79,209,197,0.18);
    border-radius: 28px; padding: 52px 44px; width: 100%; max-width: 440px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(79,209,197,0.06);
    position: relative; animation: lpFadeUp .4s ease;
  }
  .lp-login-close { position: absolute; top: 20px; right: 24px; font-size: 22px; cursor: pointer; color: var(--muted); background: none; border: none; transition: color .2s; }
  .lp-login-close:hover { color: var(--text); }
  .lp-login-logo { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 900; text-align: center; margin-bottom: 6px; background: linear-gradient(135deg, var(--teal-light), #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .lp-login-tagline { text-align: center; color: var(--muted); font-size: 14px; margin-bottom: 40px; font-family: 'DM Sans', sans-serif; }
  .lp-tab-row { display: flex; background: rgba(0,0,0,0.3); border-radius: 999px; padding: 4px; margin-bottom: 32px; }
  .lp-tab-btn { flex: 1; padding: 10px; border-radius: 999px; border: none; cursor: pointer; font-size: 14px; font-weight: 500; transition: background .2s, color .2s; font-family: 'DM Sans', sans-serif; }
  .lp-tab-active { background: linear-gradient(90deg, var(--teal), var(--teal-light)); color: #fff; }
  .lp-tab-inactive { background: transparent; color: var(--muted); }
  .lp-field-label { font-size: 12px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; display: block; font-family: 'DM Sans', sans-serif; }
  .lp-field-input {
    width: 100%; padding: 14px 18px; border-radius: 12px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(79,209,197,0.15);
    color: var(--text); font-size: 15px; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color .2s, box-shadow .2s; margin-bottom: 20px;
  }
  .lp-field-input:focus { border-color: var(--teal-light); box-shadow: 0 0 0 3px rgba(79,209,197,0.12); }
  .lp-field-input::placeholder { color: rgba(123,186,182,0.4); }
  .lp-login-btn {
    width: 100%; padding: 16px; border-radius: 999px;
    background: linear-gradient(90deg, var(--teal), var(--teal-light));
    color: #fff; font-size: 16px; font-weight: 500; cursor: pointer;
    border: none; margin-top: 4px; transition: transform .2s, box-shadow .2s;
    box-shadow: 0 0 24px rgba(79,209,197,0.25); font-family: 'DM Sans', sans-serif;
  }
  .lp-login-btn:hover { transform: translateY(-1px); box-shadow: 0 0 40px rgba(79,209,197,0.4); }
  .lp-login-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  .lp-divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; }
  .lp-divider-line { flex: 1; height: 1px; background: rgba(79,209,197,0.1); }
  .lp-divider-text { font-size: 12px; color: var(--muted); font-family: 'DM Sans', sans-serif; }
  .lp-social-btn {
    width: 100%; padding: 13px; border-radius: 12px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(79,209,197,0.12);
    color: var(--text); font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: background .2s, border-color .2s; font-family: 'DM Sans', sans-serif;
  }
  .lp-social-btn:hover { background: rgba(255,255,255,0.07); border-color: rgba(79,209,197,0.2); }
  .lp-forgot { text-align: right; margin-top: -12px; margin-bottom: 24px; }
  .lp-forgot a { font-size: 12px; color: var(--teal-light); cursor: pointer; text-decoration: none; font-family: 'DM Sans', sans-serif; }
  .lp-forgot a:hover { text-decoration: underline; }
  .lp-success { text-align: center; padding: 20px; color: var(--teal-light); font-size: 15px; animation: lpFadeIn .4s ease; font-family: 'DM Sans', sans-serif; }

  @media(max-width:600px) {
    .lp-nav { padding: 16px 20px; }
    .lp-nav-links { display: none; }
    .lp-footer { flex-direction: column; gap: 12px; text-align: center; padding: 32px 20px; }
    .lp-login-card { padding: 40px 24px; }
  }
    /* ===== HERO VIDEO FIX ===== */

.lp-hero {
  position: relative;
  overflow: hidden;
}

/* VIDEO BACKGROUND */
.lp-hero-video {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  z-index: 0;           /* UPDATED */
  pointer-events: none; /* UPDATED */
}

/* DARK OVERLAY */
.lp-hero-overlay {
  position: absolute;
  inset: 0;

  background: rgba(0,0,0,0.55);

  z-index: 1;           /* UPDATED */
}

/* HERO CONTENT */
.lp-badge,
.lp-title,
.lp-sub,
.lp-actions,
.lp-hero-grid {
  position: relative;
  z-index: 2;           /* UPDATED */
}
   

`;

/* ============================================================
   LANDING PAGE COMPONENT
   ============================================================ */
function LandingPage({ onLogin }) {
    const [showLogin, setShowLogin] = useState(false);
    const [authTab, setAuthTab] = useState("login");
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const openModal = (tab) => { setAuthTab(tab); setShowLogin(true); };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 1400));
        setLoading(false);
        setSuccess(authTab === "login" ? "Welcome back! Redirecting…" : "Account created! Welcome to EMIPI ✨");
        setTimeout(() => { setShowLogin(false); setSuccess(""); onLogin(); }, 1600);
    };

    const features = [
        { icon: "⚡", name: "Instant Generation", desc: "Paste your email and get a polished reply in under 3 seconds. No waiting, no friction." },
        { icon: "🎭", name: "Tone Control", desc: "Switch between Professional, Friendly, and Casual tones with a single click." },
        { icon: "🧠", name: "Smart Instructions", desc: "Add custom instructions to steer the AI — mention specific points, set a word limit." },
        { icon: "📋", name: "Copy & Download", desc: "One-click copy to clipboard or download as a .txt file. Ready to send in seconds." },
        { icon: "📊", name: "Reply History", desc: "Every reply is saved in your session dashboard. Review and reuse past responses." },
        { icon: "🌙", name: "Dark Mode", desc: "Easy on the eyes, day or night. Toggle dark mode from the sidebar in one click." },
    ];

    return (
        <div style={{ background: "#0a1f1e", minHeight: "100vh" }}>
            {/* NAVBAR */}
            <nav className="lp-nav">
                <div className="lp-nav-logo">EMIPI</div>
                <div className="lp-nav-links">
                    <a className="lp-nav-link" href="#">Features</a>
                    <a className="lp-nav-link" href="#">Pricing</a>
                    <a className="lp-nav-link" href="#">Blog</a>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <button className="lp-btn-ghost" onClick={() => openModal("login")}>Sign in</button>
                    <button className="lp-btn-primary" onClick={() => openModal("signup")}>Get Started</button>
                </div>
            </nav>

            <section className="lp-hero">

                <video
                    className="lp-hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src={heroVideo} type="video/mp4" />
                </video>

                {/* Optional overlay */}
                <div className="lp-hero-overlay"></div>

                <div className="lp-hero-grid" />

                <div className="lp-badge">
                    <span className="lp-badge-dot" />
                    AI-Powered Email Replies — Now Live
                </div>

                <h1 className="lp-title">
                    Write emails <span>10× faster</span><br />with AI
                </h1>

                <p className="lp-sub">
                    Paste any email, choose your tone, and get a polished reply in seconds.
                    Professional, friendly, or casual — EMIPI handles it all.
                </p>

                <div className="lp-actions">
                    <button className="lp-btn-hero" onClick={() => openModal("signup")}>
                        Start for Free →
                    </button>

                    <button className="lp-btn-hero-ghost" onClick={() => openModal("login")}>
                        Sign in
                    </button>
                </div>

            </section>

            {/* STATS */}
            <div className="lp-stats">
                <div className="lp-stats-inner">
                    <div><div className="lp-stat-num">10×</div><div className="lp-stat-label">Faster email replies</div></div>
                    <div><div className="lp-stat-num">3</div><div className="lp-stat-label">Tone options</div></div>
                    <div><div className="lp-stat-num">∞</div><div className="lp-stat-label">Replies generated</div></div>
                    <div><div className="lp-stat-num">0s</div><div className="lp-stat-label">Learning curve</div></div>
                </div>
            </div>

            {/* FEATURES */}
            <section className="lp-features">
                <div className="lp-section-label">Why EMIPI</div>
                <h2 className="lp-section-title">Everything you need to reply smarter</h2>
                <div className="lp-feature-grid">
                    {features.map(f => (
                        <div className="lp-feature-card" key={f.name}>
                            <div className="lp-feature-icon">{f.icon}</div>
                            <div className="lp-feature-name">{f.name}</div>
                            <div className="lp-feature-desc">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="lp-cta">
                <div className="lp-section-label">Ready to begin?</div>
                <h2 className="lp-cta-title">Stop drafting.<br />Start sending.</h2>
                <p className="lp-cta-sub">Join thousands who reply faster with EMIPI.</p>
                <button className="lp-btn-hero" style={{ fontSize: 18, padding: "18px 56px" }} onClick={() => openModal("signup")}>Create Free Account</button>
            </section>

            {/* FOOTER */}
            <footer className="lp-footer">
                <div className="lp-footer-logo">EMIPI</div>
                <div className="lp-footer-copy">© 2026 EMIPI · Smart Email Replies</div>
            </footer>

            {/* LOGIN / SIGNUP MODAL */}
            {showLogin && (
                <div className="lp-overlay" onClick={e => { if (e.target === e.currentTarget) setShowLogin(false); }}>
                    <div className="lp-login-card">
                        <button className="lp-login-close" onClick={() => setShowLogin(false)}>✕</button>
                        <div className="lp-login-logo">EMIPI</div>
                        <div className="lp-login-tagline">Smart email replies, instantly.</div>
                        <div className="lp-tab-row">
                            <button className={`lp-tab-btn ${authTab === "login" ? "lp-tab-active" : "lp-tab-inactive"}`} onClick={() => setAuthTab("login")}>Sign In</button>
                            <button className={`lp-tab-btn ${authTab === "signup" ? "lp-tab-active" : "lp-tab-inactive"}`} onClick={() => setAuthTab("signup")}>Sign Up</button>
                        </div>
                        {success ? (
                            <div className="lp-success">✅ {success}</div>
                        ) : (
                            <form onSubmit={handleAuth}>
                                {authTab === "signup" && (
                                    <><label className="lp-field-label">Full Name</label>
                                        <input className="lp-field-input" type="text" placeholder="Rahul Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></>
                                )}
                                <label className="lp-field-label">Email Address</label>
                                <input className="lp-field-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                                <label className="lp-field-label">Password</label>
                                <input className="lp-field-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                                {authTab === "login" && <div className="lp-forgot"><a href="#">Forgot password?</a></div>}
                                <button className="lp-login-btn" type="submit" disabled={loading}>
                                    {loading ? "Please wait…" : authTab === "login" ? "Sign In →" : "Create Account →"}
                                </button>
                                <div className="lp-divider"><div className="lp-divider-line" /><div className="lp-divider-text">or continue with</div><div className="lp-divider-line" /></div>
                                <button type="button" className="lp-social-btn">
                                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                    Continue with Google
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ============================================================
   MAIN APP COMPONENT  (your original code)
   ============================================================ */
function MainApp() {
    const isMobile = useMediaQuery("(max-width:430px)");

    const [activeTab, setActiveTab] = useState("generator");
    const [darkMode, setDarkMode] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [emailContent, setEmailContent] = useState("");
    const [instructions, setInstructions] = useState("");
    const [tone, setTone] = useState("Professional");
    const [generatedReply, setGeneratedReply] = useState("");
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                    background: {
                        default: darkMode ? "#0f1f1d" : "#eef6f6",
                        paper: darkMode ? "#142826" : "#ffffff"
                    },
                    primary: { main: darkMode ? "#4fd1c5" : "#2f8f8b" }
                },
                typography: {
                    fontFamily: '"Georgia","Times New Roman",serif',
                    h4: { fontWeight: 700, fontSize: isMobile ? "22px" : "34px" }
                }
            }),
        [darkMode, isMobile]
    );

    const handleSidebarClick = (key) => {
        if (key === "dark") setDarkMode((v) => !v);
        else setActiveTab(key);
        setDrawerOpen(false);
    };

    const handleGenerate = async () => {
        if (!emailContent.trim()) { setError("Original Email is required"); return; }
        setError(""); setGeneratedReply(""); setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/email/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailContent, instructions, tone })
            });
            if (!res.ok) throw new Error("Backend error");
            const replyText = await res.text();
            setGeneratedReply(replyText);
            setHistory((prev) => [{ email: emailContent, tone, reply: replyText, date: new Date().toLocaleString() }, ...prev]);
        } catch { setError("Backend response failed"); }
        finally { setLoading(false); }
    };

    const handleCopy = () => navigator.clipboard.writeText(generatedReply);

    const handleDownload = () => {
        const blob = new Blob([generatedReply], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "email-reply.txt";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const Sidebar = (
        <Box sx={{ width: 240, minHeight: "100vh", background: darkMode ? "linear-gradient(180deg,#0e3a36,#0b2d2a)" : "linear-gradient(180deg,#2f8f8b,#1f6f6b)", color: "#fff", px: 3, py: 4 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 4 }}>EMIPI</Typography>
            <List>
                {["generator", "dashboard", "history", "dark"].map((key) => (
                    <ListItem key={key} onClick={() => handleSidebarClick(key)}
                        sx={{ mb: 1, borderRadius: 999, cursor: "pointer", background: activeTab === key ? "rgba(255,255,255,0.3)" : "transparent" }}>
                        <ListItemText primary={key === "dark" ? "Dark Mode" : key.charAt(0).toUpperCase() + key.slice(1)} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: "100vh", display: "flex" }}>
                {!isMobile && Sidebar}
                {isMobile && (
                    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{ "& .MuiDrawer-paper": { background: "none" } }}>
                        {Sidebar}
                    </Drawer>
                )}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ py: 2, textAlign: "center", position: "relative" }}>
                        {isMobile && (
                            <IconButton onClick={() => setDrawerOpen(true)} sx={{ position: "absolute", left: 12, top: 12 }}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography variant="h4">Welcome to EMIPI</Typography>
                        <Typography sx={{ mt: 1 }}>Generate professional, friendly, or casual email replies instantly.</Typography>
                    </Box>

                    <Container maxWidth="lg" sx={{ flex: 1, mt: 3 }}>
                        {activeTab === "generator" && (
                            <Grid container spacing={3} alignItems="flex-start">
                                <Grid item xs={12} md={7}>
                                    <Paper sx={{ p: 3 }}>
                                        {error && <Alert severity="error">{error}</Alert>}
                                        <TextField fullWidth label="Original Email" multiline rows={4} value={emailContent} onChange={(e) => setEmailContent(e.target.value)} sx={{ my: 2 }} />
                                        <TextField fullWidth label="Additional Instructions" multiline rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)} sx={{ mb: 2 }} />
                                        <FormControl fullWidth sx={{ mb: 3 }}>
                                            <InputLabel>Tone</InputLabel>
                                            <Select value={tone} label="Tone" onChange={(e) => setTone(e.target.value)}>
                                                <MenuItem value="Professional">Professional</MenuItem>
                                                <MenuItem value="Friendly">Friendly</MenuItem>
                                                <MenuItem value="Casual">Casual</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Button fullWidth onClick={handleGenerate} disabled={loading}
                                            sx={{ height: 48, borderRadius: 999, color: "#fff", background: darkMode ? "linear-gradient(90deg,#3fe0c0,#5b7cff)" : "linear-gradient(90deg,#2f8f8b,#4fd1c5)" }}>
                                            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Generate Reply"}
                                        </Button>
                                        {generatedReply && (
                                            <Paper sx={{ mt: 3, p: 2 }}>
                                                <Typography fontWeight={700}>Generated Reply</Typography>
                                                <Typography sx={{ whiteSpace: "pre-line", mt: 1 }}>{generatedReply}</Typography>
                                                <Divider sx={{ my: 2 }} />
                                                <Box sx={{ display: "flex", gap: 2 }}>
                                                    <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={handleCopy}>Copy</Button>
                                                    <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownload}>Download</Button>
                                                </Box>
                                            </Paper>
                                        )}
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={5} sx={{ position: { md: "sticky" }, top: { md: 24 }, alignSelf: "flex-start" }}>
                                    <Paper sx={{ p: 3 }}>
                                        <Typography fontWeight={700} mb={2}>How EMIPI Works</Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Typography>1. Paste the original email</Typography>
                                        <Typography sx={{ mt: 1 }}>2. Add instructions if needed</Typography>
                                        <Typography sx={{ mt: 1 }}>3. Select the reply tone</Typography>
                                        <Typography sx={{ mt: 1 }}>4. Generate the reply</Typography>
                                        <Typography sx={{ mt: 1 }}>5. Copy or download the email</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}

                        {activeTab === "dashboard" && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3 }}>
                                        <Typography variant="h4">{history.length}</Typography>
                                        <Typography>Total Replies Generated</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3 }}>
                                        <Typography variant="h4">{history[0]?.tone || "—"}</Typography>
                                        <Typography>Last Used Tone</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}

                        {activeTab === "history" && (
                            <Paper sx={{ p: 3 }}>
                                {history.length === 0 ? (
                                    <Typography>No history yet</Typography>
                                ) : (
                                    <List>
                                        {history.map((h, i) => (
                                            <ListItem key={i} alignItems="flex-start">
                                                <ListItemText primary={h.email.slice(0, 80)} secondary={`${h.date}\n\n${h.reply}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Paper>
                        )}
                    </Container>

                    <Box sx={{ mt: "auto", py: 3, textAlign: "center", background: darkMode ? "#0b2d2a" : "#2f8f8b", color: "#fff" }}>
                        © 2026 EMIPI · Smart Email Replies
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

/* ============================================================
   ROOT — controls which page is shown
   ============================================================ */
export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <>
            <style>{landingStyles}</style>
            {isLoggedIn
                ? <MainApp />
                : <LandingPage onLogin={() => setIsLoggedIn(true)} />
            }
        </>
    );
}