import React, { useState } from "react";
import { Link } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/* Handcrafted Pixel Icons (Razor Sharp 16-Bit Crisp SVG)                    */
/* -------------------------------------------------------------------------- */

const PixelCapIcon = ({ className = "w-8 h-8", size = 32 }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    shapeRendering="crispEdges"
    style={{ flexShrink: 0, imageRendering: 'pixelated' }}
  >
    <rect x="4" y="10" width="24" height="7" fill="#FFC300" />
    <rect x="8" y="7" width="16" height="3" fill="#FFD60A" />
    <rect x="11" y="17" width="10" height="6" fill="#FFC300" />
    <rect x="14" y="23" width="4" height="3" fill="#FFD60A" />
    <rect x="25" y="15" width="3" height="10" fill="#FFD60A" />
    <rect x="3" y="13" width="3" height="3" fill="#000814" />
    <rect x="27" y="13" width="3" height="3" fill="#000814" />
  </svg>
);

const DocumentIcon = ({ className = "w-6 h-6", size = 24 }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    shapeRendering="crispEdges"
    style={{ flexShrink: 0, imageRendering: 'pixelated' }}
  >
    <rect x="6" y="3" width="17" height="26" fill="#000814" />
    <rect x="9" y="6" width="11" height="20" fill="#FFFFFF" />
    <rect x="20" y="3" width="6" height="6" fill="#38BDF8" />
    <rect x="20" y="9" width="6" height="3" fill="#000814" />
    <rect x="12" y="13" width="6" height="2" fill="#003566" />
    <rect x="12" y="17" width="9" height="2" fill="#003566" />
    <rect x="12" y="21" width="7" height="2" fill="#38BDF8" />
  </svg>
);

const UploadIcon = ({ className = "w-12 h-12", size = 48 }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    shapeRendering="crispEdges"
    style={{ flexShrink: 0, imageRendering: 'pixelated' }}
  >
    <rect x="9" y="5" width="26" height="38" fill="#000814" />
    <rect x="13" y="9" width="18" height="30" fill="#FFFFFF" />

    <rect x="27" y="9" width="8" height="8" fill="#38BDF8" />
    <rect x="27" y="17" width="4" height="4" fill="#FFFFFF" />

    <rect x="17" y="22" width="10" height="3" fill="#003566" />
    <rect x="17" y="28" width="14" height="3" fill="#003566" />

    <rect x="37" y="25" width="5" height="15" fill="#38BDF8" />
    <rect x="33" y="21" width="13" height="5" fill="#38BDF8" />
    <rect x="35" y="18" width="9" height="5" fill="#38BDF8" />
  </svg>
);

const PaymentIcon = ({ className = "w-12 h-12", size = 48 }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    shapeRendering="crispEdges"
    style={{ flexShrink: 0, imageRendering: 'pixelated' }}
  >
    <rect x="5" y="10" width="38" height="28" fill="#000814" />
    <rect x="9" y="14" width="30" height="20" fill="#003566" />

    <rect x="9" y="18" width="30" height="5" fill="#FFC300" />

    <rect x="13" y="27" width="9" height="3" fill="#FFFFFF" />
    <rect x="26" y="27" width="8" height="3" fill="#38BDF8" />

    <rect x="38" y="7" width="4" height="4" fill="#FFD60A" />
    <rect x="42" y="11" width="3" height="3" fill="#FFD60A" />
  </svg>
);

const PrinterIcon = ({ className = "w-12 h-12", size = 48 }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    shapeRendering="crispEdges"
    style={{ flexShrink: 0, imageRendering: 'pixelated' }}
  >
    <rect x="9" y="17" width="30" height="23" fill="#000814" />
    <rect x="5" y="20" width="38" height="16" fill="#003566" />

    <rect x="13" y="7" width="22" height="16" fill="#000814" />
    <rect x="16" y="10" width="16" height="10" fill="#FFFFFF" />

    <rect x="15" y="31" width="18" height="13" fill="#FFFFFF" />
    <rect x="18" y="34" width="12" height="2" fill="#001D3D" />
    <rect x="18" y="38" width="9" height="2" fill="#38BDF8" />

    <rect x="34" y="23" width="4" height="4" fill="#86EFAC" />
    <rect x="29" y="23" width="3" height="3" fill="#FFD60A" />
  </svg>
);

const ParcelIcon = ({ className = "w-12 h-12", size = 48 }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    shapeRendering="crispEdges"
    style={{ flexShrink: 0, imageRendering: 'pixelated' }}
  >
    <rect x="7" y="15" width="34" height="26" fill="#000814" />

    <rect x="11" y="18" width="26" height="19" fill="#FFC300" />

    <rect x="11" y="18" width="26" height="5" fill="#FFD60A" />
    <rect x="21" y="18" width="6" height="19" fill="#003566" />

    <rect x="15" y="13" width="18" height="5" fill="#FFC300" />
    <rect x="18" y="10" width="12" height="4" fill="#FFD60A" />

    <rect x="15" y="27" width="5" height="3" fill="#001D3D" />
    <rect x="29" y="27" width="5" height="3" fill="#001D3D" />
  </svg>
);

const HelpIcon = ({ className = "w-5 h-5", size = 20 }) => (
  <svg
    viewBox="0 0 20 20"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    shapeRendering="crispEdges"
    style={{ flexShrink: 0, imageRendering: 'pixelated' }}
  >
    <rect x="6" y="2" width="8" height="3" fill="currentColor" />
    <rect x="3" y="5" width="14" height="3" fill="currentColor" />
    <rect x="5" y="8" width="5" height="3" fill="currentColor" />
    <rect x="8" y="11" width="4" height="4" fill="currentColor" />
    <rect x="8" y="16" width="4" height="2" fill="currentColor" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* Step Card Component                                                        */
/* -------------------------------------------------------------------------- */

const StepCard = ({ number, icon, title, description }) => (
  <div className="group relative border-r-4 border-[#000814] px-6 py-8 last:border-r-0 rounded-none bg-[#FBF8F1]">
    {/* Step number */}
    <div className="absolute right-4 top-3 font-['Silkscreen'] text-[10px] text-[#003566]/50 select-none">
      0{number}
    </div>

    <div className="mb-5 flex h-14 items-center justify-start">
      {icon}
    </div>

    <h3 className="font-['Press_Start_2P'] text-[11px] leading-5 text-[#000814]">
      {title}
    </h3>

    <p className="mt-3 max-w-[230px] font-mono text-xs leading-5 text-[#003566]">
      {description}
    </p>

    {/* Pixel accent indicator */}
    <div className="mt-5 flex gap-1">
      <span className="h-1 w-6 bg-[#FFC300]" />
      <span className="h-1 w-2 bg-[#000814]" />
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Metric Counter Badge                                                       */
/* -------------------------------------------------------------------------- */

const MetricBadge = ({ symbol, value, label }) => (
  <div className="flex items-center gap-3 border-l-2 border-[#001D3D] pl-4">
    <span className="text-lg text-[#FFD60A]">{symbol}</span>
    <div>
      <div className="font-['Press_Start_2P'] text-[9px] text-[#FFD60A] md:text-[10px]">
        {value}
      </div>
      <div className="mt-1 font-['Silkscreen'] text-[9px] text-white/60">
        {label}
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Dynamic 16-Bit Pixel Landing Page Component                               */
/* -------------------------------------------------------------------------- */

export const LandingPage = () => {
  const [isNight, setIsNight] = useState(false);

  return (
    <main className="min-h-screen bg-[#001D3D] text-white selection:bg-[#FFD60A] selection:text-[#000814]">
      {/* ================================================================== */}
      {/* 1. RETRO PIXEL TOP NAVBAR                                          */}
      {/* ================================================================== */}
      <nav className="sticky top-0 z-50 h-16 w-full border-b-4 border-[#000814] bg-[#000814] px-6 md:px-12 flex items-center justify-between text-white rounded-none shadow-[0_4px_0_0_#000814]">
        {/* Brand */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="CampusPrint home"
        >
          <div className="flex h-10 w-10 items-center justify-center border-2 border-[#FFC300] bg-[#001D3D] rounded-none shadow-[2px_2px_0px_#000814]">
            <PixelCapIcon className="h-7 w-7" size={28} />
          </div>

          <div>
            <div className="font-['Press_Start_2P'] text-[12px] sm:text-[13px] tracking-tight text-white">
              CAMPUS<span className="text-[#FFD60A]">PRINT</span>
            </div>
            <div className="mt-0.5 font-['Silkscreen'] text-[8px] tracking-wider text-[#FFD60A]">
              PRINT. PAY. PICK UP.
            </div>
          </div>
        </Link>

        {/* Center navigation */}
        <div className="hidden h-full items-center gap-7 lg:flex">
          <Link
            to="/"
            className="relative flex h-full items-center font-['Silkscreen'] text-xs text-[#FFD60A]"
          >
            Home
            <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#FFD60A]" />
          </Link>

          <a
            href="#how-it-works"
            className="font-['Silkscreen'] text-xs text-white/80 transition-colors hover:text-[#FFD60A]"
          >
            How It Works
          </a>

          <a
            href="#prices"
            className="font-['Silkscreen'] text-xs text-white/80 transition-colors hover:text-[#FFD60A]"
          >
            Prices
          </a>

          <a
            href="#locations"
            className="font-['Silkscreen'] text-xs text-white/80 transition-colors hover:text-[#FFD60A]"
          >
            Locations
          </a>

          <a
            href="#help"
            className="font-['Silkscreen'] text-xs text-white/80 transition-colors hover:text-[#FFD60A]"
          >
            Help
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="font-['Silkscreen'] text-xs text-white px-3 py-1.5 hover:text-[#FFD60A] transition-colors"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="
              border-2 border-[#000814]
              bg-[#FFC300]
              px-4 py-2
              font-['Press_Start_2P'] text-[10px]
              text-[#000814]
              shadow-[2px_2px_0px_#000814]
              transition-transform
              hover:bg-[#FFD60A]
              active:translate-x-0.5
              active:translate-y-0.5
              active:shadow-none
              rounded-none
            "
          >
            Create Account
          </Link>
        </div>
      </nav>

      {/* ================================================================== */}
      {/* 2. DYNAMIC 16-BIT PIXEL HERO (TWILIGHT / NIGHT DUAL ENGINE)        */}
      {/* ================================================================== */}
      <section className="relative min-h-[620px] md:min-h-[700px] overflow-hidden bg-[#000814] rounded-none">
        {/* Background Layer 1: Sunset / Golden Twilight */}
        <img
          src="/hero-twilight.jpg"
          alt="CampusPrint Sunset Workstation"
          className={`absolute inset-0 w-full h-full object-cover object-right md:object-center transition-opacity duration-700 select-none ${
            isNight ? "opacity-0" : "opacity-100"
          }`}
          style={{ imageRendering: "pixelated" }}
        />

        {/* Background Layer 2: Deep Night Workstation */}
        <img
          src="/hero-night.jpg"
          alt="CampusPrint Night Workstation"
          className={`absolute inset-0 w-full h-full object-cover object-right md:object-center transition-opacity duration-700 select-none ${
            isNight ? "opacity-100" : "opacity-0"
          }`}
          style={{ imageRendering: "pixelated" }}
        />

        {/* Subtle Navy Gradient Overlay (keeps left headlines 100% readable) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000814]/95 via-[#000814]/70 to-transparent pointer-events-none" />

        {/* Subtle Bottom Ground Shadow */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#000814] to-transparent pointer-events-none" />

        {/* Hero Content Overlay */}
        <div className="relative mx-auto max-w-[1440px] px-6 py-12 md:px-12 lg:px-16 min-h-[620px] md:min-h-[700px] flex flex-col justify-center">
          <div className="max-w-2xl z-10">
            {/* Top Row: Campus Status Badge + Atmosphere Switcher Widget */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 border-2 border-[#003566] bg-[#000814]/85 px-3 py-1.5 rounded-none shadow-[2px_2px_0px_#000814]">
                <span className="h-2 w-2 bg-[#86EFAC]" />
                <span className="font-['Silkscreen'] text-[9px] text-white/80 tracking-wider">
                  CAMPUS PRINT NETWORK // ONLINE
                </span>
              </div>

              {/* Atmosphere Switcher Widget */}
              <button
                type="button"
                onClick={() => setIsNight((prev) => !prev)}
                className="
                  inline-flex items-center gap-1.5
                  font-['Silkscreen'] text-[10px]
                  bg-[#000814]/85 text-[#FFD60A]
                  border-2 border-[#FFC300]
                  px-3 py-1.5
                  shadow-[2px_2px_0px_#000814]
                  cursor-pointer
                  hover:bg-[#001D3D]
                  transition-all
                  rounded-none
                  active:translate-x-0.5
                  active:translate-y-0.5
                "
                title="Toggle Daytime / Nighttime Workstation"
              >
                <span>{isNight ? "🌙 NIGHT" : "☀️ TWILIGHT"}</span>
                <span className="text-[#FFC300] text-[9px]">[TOGGLE]</span>
              </button>
            </div>

            {/* 3-Line Pixel Headline */}
            <h1 className="font-['Press_Start_2P'] text-3xl sm:text-5xl lg:text-6xl leading-[1.25] mt-6 tracking-tight">
              <span className="block text-white drop-shadow-[3px_3px_0px_#000814]">
                PRINT.
              </span>
              <span className="block text-white drop-shadow-[3px_3px_0px_#000814]">
                PAY.
              </span>
              <span className="block text-[#FFD60A] drop-shadow-[3px_3px_0px_#000814]">
                PICK UP.
              </span>
            </h1>

            {/* Golden Divider Accent */}
            <div className="mt-5 h-1.5 w-28 bg-[#FFC300] shadow-[1px_1px_0px_#000814]" />

            {/* Subtext */}
            <p className="font-mono text-white/90 text-sm md:text-base mt-5 max-w-lg bg-[#000814]/75 p-3.5 border-l-4 border-[#FFC300] shadow-[2px_2px_0px_#000814]">
              Skip the queue. Send your documents from anywhere on campus.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/signup"
                className="
                  bg-[#FFC300] hover:bg-[#FFD60A]
                  text-[#000814]
                  font-['Press_Start_2P'] text-xs
                  px-6 py-4
                  border-4 border-[#000814]
                  shadow-[4px_4px_0px_#000814]
                  active:translate-x-1 active:translate-y-1 active:shadow-none
                  flex items-center gap-3
                  rounded-none
                  transition-transform
                "
              >
                <DocumentIcon className="h-5 w-5" size={20} />
                <span>Get Started &gt;</span>
              </Link>

              <a
                href="#how-it-works"
                className="
                  bg-[#000814]/85 text-white
                  font-['Silkscreen'] text-xs
                  px-5 py-4
                  border-2 border-[#003566] hover:border-[#FFD60A]
                  flex items-center gap-2
                  rounded-none
                  transition-colors
                  shadow-[2px_2px_0px_#000814]
                "
              >
                <span>▶ How It Works</span>
              </a>
            </div>

            {/* Mini Trustline */}
            <div className="mt-7 flex items-center gap-3 font-['Silkscreen'] text-[9px] text-white/60 select-none">
              <span className="h-2 w-2 bg-[#86EFAC]" />
              NO QUEUES
              <span className="text-[#003566]">/</span>
              FAST PICKUP
              <span className="text-[#003566]">/</span>
              CAMPUS READY
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 3. "HOW IT WORKS" 4-STEP BAR (Codédex / Pixel Parchment Style)       */}
      {/* ================================================================== */}
      <section
        id="how-it-works"
        className="border-y-4 border-[#000814] bg-[#FBF8F1] rounded-none py-12 px-6 md:px-12"
      >
        <div className="mx-auto max-w-[1440px]">
          {/* Section Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-4 border-[#000814] pb-6">
            <div>
              <div className="mb-2 font-['Silkscreen'] text-[10px] text-[#003566] tracking-wider">
                // HOW IT WORKS
              </div>
              <h2 className="font-['Press_Start_2P'] text-base sm:text-lg md:text-xl text-[#000814]">
                FOUR STEPS. ZERO QUEUES.
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-[#FFC300]" />
              <span className="h-3 w-3 bg-[#38BDF8]" />
              <span className="h-3 w-3 bg-[#86EFAC]" />
            </div>
          </div>

          {/* 4-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-4 border-[#000814] bg-[#000814] gap-[4px] shadow-[4px_4px_0px_#000814]">
            <StepCard
              number="1"
              icon={<UploadIcon />}
              title="UPLOAD"
              description="Upload your PDF from any device."
            />

            <StepCard
              number="2"
              icon={<PaymentIcon />}
              title="PAY"
              description="Secure and easy online payment."
            />

            <StepCard
              number="3"
              icon={<PrinterIcon />}
              title="WE PRINT"
              description="Your documents are printed on campus."
            />

            <StepCard
              number="4"
              icon={<ParcelIcon />}
              title="PICK UP"
              description="Collect your prints at the campus print shop."
            />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. BOTTOM METRICS & SKYLINE FOOTER                                 */}
      {/* ================================================================== */}
      <section className="border-t-2 border-[#001D3D] bg-[#000814] py-6 px-6 md:px-12 rounded-none">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6">
          {/* Statement */}
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-8 bg-[#FFD60A]" />
            <p className="font-['Silkscreen'] text-[9px] sm:text-xs leading-4 text-white/80">
              BUILT FOR STUDENTS. POWERED BY CONVENIENCE.
            </p>
          </div>

          {/* 3 Live Counters */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <MetricBadge symbol="👥" value="10K+" label="STUDENTS" />
            <MetricBadge symbol="▣" value="50K+" label="PAGES PRINTED" />
            <MetricBadge symbol="★" value="4.8" label="STUDENT RATING" />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 5. RETRO FOOTER                                                    */}
      {/* ================================================================== */}
      <footer id="help" className="border-t-4 border-[#001D3D] bg-[#000814] py-8 px-6 md:px-12 rounded-none">
        <div className="mx-auto flex max-w-[1440px] flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="font-['Press_Start_2P'] text-[10px] text-white">
              CAMPUS<span className="text-[#FFD60A]">PRINT</span>
            </div>
            <p className="mt-2 font-['Silkscreen'] text-[8px] text-white/40">
              DIGITAL XEROX &amp; STATIONERY ORDERING SYSTEM
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-['Silkscreen'] text-[9px] text-white/50">
            <Link to="/" className="hover:text-[#FFD60A] transition-colors">
              HOME
            </Link>
            <a href="#how-it-works" className="hover:text-[#FFD60A] transition-colors">
              HOW IT WORKS
            </a>
            <a href="#prices" className="hover:text-[#FFD60A] transition-colors">
              PRICES
            </a>
            <a href="#locations" className="hover:text-[#FFD60A] transition-colors">
              LOCATIONS
            </a>
            <a href="#help" className="flex items-center gap-2 hover:text-[#FFD60A] transition-colors">
              <HelpIcon />
              HELP
            </a>
          </div>

          <div className="font-mono text-[10px] text-white/30">
            &copy; 2026 CAMPUSPRINT // RETRO 16-BIT EDITION
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
