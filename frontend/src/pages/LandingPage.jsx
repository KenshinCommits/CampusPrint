import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PixelGraduationCap } from '../components/PixelArt.jsx';
import { FileText, Users, Star, ArrowRight, Play, X, Check } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Modal states for navbar buttons
  const [activeModal, setActiveModal] = useState(null); // 'prices' | 'locations' | 'help'

  function handleGetStarted() {
    if (user) {
      navigate(user.role === 'staff' ? '/staff' : '/dashboard');
    } else {
      navigate('/register');
    }
  }

  function handleLogin() {
    if (user) {
      navigate(user.role === 'staff' ? '/staff' : '/dashboard');
    } else {
      navigate('/login');
    }
  }

  function scrollToHowItWorks(e) {
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000814', display: 'flex', flexDirection: 'column' }}>
      
      {/* ========================================================================= */}
      {/* SECTION A: TOP NAVIGATION BAR                                             */}
      {/* ========================================================================= */}
      <header
        style={{
          height: '72px',
          backgroundColor: '#000814',
          borderBottom: '4px solid #000814',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Left Branding: Pixel Cap + CAMPUSPRINT */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
        >
          <PixelGraduationCap size={36} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.95rem',
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                lineHeight: 1.2,
              }}
            >
              CAMPUS<span style={{ color: '#FFD60A' }}>PRINT</span>
            </span>
            <span
              style={{
                fontFamily: "'Silkscreen', monospace",
                fontWeight: 700,
                fontSize: '0.62rem',
                letterSpacing: '0.12em',
                color: '#FFD60A',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}
            >
              PRINT. PAY. PICK UP.
            </span>
          </div>
        </Link>

        {/* Center Links: Home (Active with yellow line), How It Works, Prices, Locations, Help */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {/* Active Home Item */}
          <div style={{ position: 'relative', paddingBottom: '6px' }}>
            <Link
              to="/"
              style={{
                fontFamily: "'Silkscreen', monospace",
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#FFD60A',
                textDecoration: 'none',
                letterSpacing: '0.04em',
              }}
            >
              Home
            </Link>
            {/* 3px Yellow Bar Directly Beneath */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#FFD60A',
              }}
            />
          </div>

          <a
            href="#how-it-works"
            onClick={scrollToHowItWorks}
            style={{
              fontFamily: "'Silkscreen', monospace",
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              transition: 'color 0.1s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FFD60A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'; }}
          >
            How It Works
          </a>

          <button
            type="button"
            onClick={() => setActiveModal('prices')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: "'Silkscreen', monospace",
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              padding: 0,
              transition: 'color 0.1s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FFD60A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'; }}
          >
            Prices
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('locations')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: "'Silkscreen', monospace",
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              padding: 0,
              transition: 'color 0.1s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FFD60A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'; }}
          >
            Locations
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('help')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: "'Silkscreen', monospace",
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              padding: 0,
              transition: 'color 0.1s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FFD60A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'; }}
          >
            Help
          </button>
        </nav>

        {/* Right Action Buttons: Login + Create Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={handleLogin}
            style={{
              backgroundColor: '#001D3D',
              color: '#FFFFFF',
              border: '2px solid #003566',
              padding: '8px 18px',
              fontFamily: "'Silkscreen', monospace",
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              borderRadius: 0,
              transition: 'all 0.1s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#003566';
              e.currentTarget.style.color = '#FFD60A';
              e.currentTarget.style.borderColor = '#FFD60A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#001D3D';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = '#003566';
            }}
          >
            {user ? 'Dashboard' : 'Login'}
          </button>

          <button
            type="button"
            onClick={handleGetStarted}
            style={{
              backgroundColor: '#FFC300',
              color: '#000814',
              border: '2px solid #000814',
              boxShadow: '2px 2px 0px #000814',
              padding: '10px 18px',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '10px',
              cursor: 'pointer',
              borderRadius: 0,
              transition: 'all 0.1s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFD60A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFC300'; }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(1px, 1px)';
              e.currentTarget.style.boxShadow = '1px 1px 0px #000814';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '2px 2px 0px #000814';
            }}
          >
            {user ? 'Open App' : 'Create Account'}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SECTION B: THE HERO SECTION                                               */}
      {/* ========================================================================= */}
      <section
        style={{
          backgroundColor: '#001D3D',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'stretch',
          minHeight: '480px',
        }}
      >
        {/* Left Column: Massive Headline, Subtitle, and Dual Buttons */}
        <div
          style={{
            flex: '1 1 480px',
            padding: '56px 48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          {/* Massive 3-Line Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h1
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'clamp(2.4rem, 4.4vw, 3.8rem)',
                lineHeight: 1.2,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              <span style={{ color: '#FFFFFF', display: 'block' }}>PRINT.</span>
              <span style={{ color: '#FFFFFF', display: 'block' }}>PAY.</span>
              <span style={{ color: '#FFD60A', display: 'block' }}>PICK UP.</span>
            </h1>
          </div>

          {/* Subtext */}
          <p
            style={{
              margin: '22px 0 32px',
              fontFamily: 'monospace',
              fontSize: '1rem',
              color: '#FBF8F1',
              fontWeight: 600,
              lineHeight: 1.5,
              maxWidth: '460px',
            }}
          >
            Skip the queue. Send your documents from anywhere on campus.
          </p>

          {/* Action Buttons: Primary "Get Started >" + Secondary "▶ How It Works" */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Primary Yellow CTA */}
            <button
              type="button"
              onClick={handleGetStarted}
              style={{
                backgroundColor: '#FFC300',
                color: '#000814',
                border: '4px solid #000814',
                boxShadow: '4px 4px 0px #000814',
                padding: '16px 24px',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                borderRadius: 0,
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFD60A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFC300'; }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = '2px 2px 0px #000814';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '4px 4px 0px #000814';
              }}
            >
              <FileText size={16} strokeWidth={2.5} />
              <span>Get Started &gt;</span>
            </button>

            {/* Secondary Dark CTA */}
            <a
              href="#how-it-works"
              onClick={scrollToHowItWorks}
              style={{
                backgroundColor: '#000814',
                color: '#FFFFFF',
                border: '2px solid #003566',
                padding: '16px 22px',
                fontFamily: "'Silkscreen', monospace",
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                cursor: 'pointer',
                borderRadius: 0,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FFD60A';
                e.currentTarget.style.color = '#FFD60A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#003566';
                e.currentTarget.style.color = '#FFFFFF';
              }}
            >
              <Play size={14} fill="currentColor" />
              <span>How It Works</span>
            </a>
          </div>
        </div>

        {/* Right Column: Authentic Pixel Workstation Scene */}
        <div
          style={{
            flex: '1 1 540px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            overflow: 'hidden',
          }}
        >
          <img
            src="/landing_hero_workstation.png"
            alt="CampusPrint Workstation Scene"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'right center',
              imageRendering: 'pixelated',
              display: 'block',
            }}
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION C: 4-STEP HOW IT WORKS BAR                                        */}
      {/* ========================================================================= */}
      <section
        id="how-it-works"
        style={{
          backgroundColor: '#FBF8F1',
          borderTop: '4px solid #000814',
          borderBottom: '4px solid #000814',
          padding: '44px 32px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
          }}
        >
          {/* STEP 1: UPLOAD */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/step_upload.png"
                alt="Upload Step"
                style={{ height: '52px', objectFit: 'contain', imageRendering: 'pixelated' }}
              />
            </div>
            <h3
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.82rem',
                color: '#000814',
                marginTop: '16px',
                marginBottom: '8px',
                letterSpacing: '0.04em',
              }}
            >
              UPLOAD
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#4B5563', fontFamily: 'monospace', lineHeight: 1.4, maxWidth: '200px' }}>
              Upload your PDF from any device.
            </p>
          </div>

          {/* STEP 2: PAY */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/step_pay.png"
                alt="Pay Step"
                style={{ height: '48px', objectFit: 'contain', imageRendering: 'pixelated' }}
              />
            </div>
            <h3
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.82rem',
                color: '#000814',
                marginTop: '16px',
                marginBottom: '8px',
                letterSpacing: '0.04em',
              }}
            >
              PAY
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#4B5563', fontFamily: 'monospace', lineHeight: 1.4, maxWidth: '200px' }}>
              Secure and easy online payment.
            </p>
          </div>

          {/* STEP 3: WE PRINT */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/step_print.png"
                alt="We Print Step"
                style={{ height: '52px', objectFit: 'contain', imageRendering: 'pixelated' }}
              />
            </div>
            <h3
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.82rem',
                color: '#000814',
                marginTop: '16px',
                marginBottom: '8px',
                letterSpacing: '0.04em',
              }}
            >
              WE PRINT
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#4B5563', fontFamily: 'monospace', lineHeight: 1.4, maxWidth: '200px' }}>
              Your documents are printed on campus.
            </p>
          </div>

          {/* STEP 4: PICK UP */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/step_pickup.png"
                alt="Pick Up Step"
                style={{ height: '50px', objectFit: 'contain', imageRendering: 'pixelated' }}
              />
            </div>
            <h3
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.82rem',
                color: '#000814',
                marginTop: '16px',
                marginBottom: '8px',
                letterSpacing: '0.04em',
              }}
            >
              PICK UP
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#4B5563', fontFamily: 'monospace', lineHeight: 1.4, maxWidth: '200px' }}>
              Collect your prints at the campus print shop.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION D: BOTTOM SOCIAL PROOF & CAMPUS SKYLINE BANNER                     */}
      {/* ========================================================================= */}
      <footer
        style={{
          backgroundColor: '#000814',
          borderTop: '4px solid #000814',
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        {/* Left: Tagline + Small Yellow Accent Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              fontFamily: "'Silkscreen', monospace",
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'rgba(255, 255, 255, 0.85)',
              textTransform: 'uppercase',
            }}
          >
            BUILT FOR STUDENTS.
            <br />
            POWERED BY CONVENIENCE.
          </div>
          {/* Small Yellow Accent Bar */}
          <div
            style={{
              width: '28px',
              height: '3.5px',
              backgroundColor: '#FFD60A',
            }}
          />
        </div>

        {/* Center: Pixel Campus Skyline Silhouette */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/landing_skyline.png"
            alt="Campus Skyline"
            style={{
              height: '70px',
              objectFit: 'contain',
              imageRendering: 'pixelated',
              display: 'block',
            }}
          />
        </div>

        {/* Right: Live Stats Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Stat 1: 10K+ Students */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: '#FFC300' }}>
              <Users size={22} strokeWidth={2.5} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.78rem', color: '#FFFFFF' }}>
                10K+
              </span>
              <span style={{ fontFamily: "'Silkscreen', monospace", fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Students
              </span>
            </div>
          </div>

          {/* Stat 2: 50K+ Pages Printed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: '#FFD60A' }}>
              <FileText size={22} strokeWidth={2.5} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.78rem', color: '#FFFFFF' }}>
                50K+
              </span>
              <span style={{ fontFamily: "'Silkscreen', monospace", fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Pages Printed
              </span>
            </div>
          </div>

          {/* Stat 3: 4.8 Student Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: '#FFC300' }}>
              <Star size={22} fill="#FFC300" strokeWidth={0} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.78rem', color: '#FFFFFF' }}>
                4.8
              </span>
              <span style={{ fontFamily: "'Silkscreen', monospace", fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Student Rating
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* INTERACTIVE MODALS (Prices, Locations, Help)                              */}
      {/* ========================================================================= */}
      {activeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 8, 20, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '4px solid #000814',
              boxShadow: '6px 6px 0px #000814',
              maxWidth: '480px',
              width: '100%',
              borderRadius: 0,
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                backgroundColor: '#001D3D',
                color: '#FFFFFF',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '3px solid #000814',
              }}
            >
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.78rem', color: '#FFD60A' }}>
                {activeModal === 'prices' && 'CAMPUS PRINT RATES'}
                {activeModal === 'locations' && 'PRINT SHOP LOCATIONS'}
                {activeModal === 'help' && 'STUDENT SUPPORT'}
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', fontFamily: 'monospace' }}>
              {activeModal === 'prices' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1.5px dashed #CBD5E1', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#000814' }}>B&amp;W A4 (Per Page)</span>
                    <span style={{ fontWeight: 900, color: '#003566' }}>₹2</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1.5px dashed #CBD5E1', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#000814' }}>Color A4 (Per Page)</span>
                    <span style={{ fontWeight: 900, color: '#003566' }}>₹8</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1.5px dashed #CBD5E1', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#000814' }}>Corner Staple Binding</span>
                    <span style={{ fontWeight: 900, color: '#003566' }}>₹5</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#000814' }}>Spiral Document Binding</span>
                    <span style={{ fontWeight: 900, color: '#003566' }}>₹30</span>
                  </div>
                </div>
              )}

              {activeModal === 'locations' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ fontWeight: 900, color: '#000814', fontSize: '0.95rem' }}>Central Library Stationery Hub</div>
                    <div style={{ color: '#64748B', fontSize: '0.82rem', marginTop: '2px' }}>Ground Floor, Near Circulation Desk (8 AM - 9 PM)</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, color: '#000814', fontSize: '0.95rem' }}>Academic Block A Xerox Counter</div>
                    <div style={{ color: '#64748B', fontSize: '0.82rem', marginTop: '2px' }}>Room A-102, Adjacent to Cafeteria (9 AM - 6 PM)</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, color: '#000814', fontSize: '0.95rem' }}>Engineering Complex Express Station</div>
                    <div style={{ color: '#64748B', fontSize: '0.82rem', marginTop: '2px' }}>Lab Complex East Wing (10 AM - 7 PM)</div>
                  </div>
                </div>
              )}

              {activeModal === 'help' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#000814', lineHeight: 1.5 }}>
                    Need assistance with a print order or pickup?
                  </p>
                  <div style={{ backgroundColor: '#F8F5ED', border: '1.5px solid #000814', padding: '12px' }}>
                    <div style={{ fontWeight: 800, color: '#000814' }}>Campus Stationery Helpline:</div>
                    <div style={{ color: '#003566', fontWeight: 700, marginTop: '4px' }}>support@campusprint.edu · Ext. 4040</div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Orders ready for pickup remain reserved at the desk for up to 48 hours.
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{
                  marginTop: '20px',
                  width: '100%',
                  backgroundColor: '#FFC300',
                  color: '#000814',
                  border: '2px solid #000814',
                  padding: '10px',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '10px',
                  cursor: 'pointer',
                  borderRadius: 0,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
