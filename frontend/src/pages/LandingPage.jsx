import React from "react";
import { Link } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/* Pixel Icons                                                                */
/* -------------------------------------------------------------------------- */

const PixelCapIcon = ({ className = "w-8 h-8", size = 32 }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    shapeRendering="crispEdges"
    style={{ flexShrink: 0 }}
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
    style={{ flexShrink: 0 }}
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
    style={{ flexShrink: 0 }}
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
    style={{ flexShrink: 0 }}
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
    style={{ flexShrink: 0 }}
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
    style={{ flexShrink: 0 }}
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
    style={{ flexShrink: 0 }}
  >
    <rect x="6" y="2" width="8" height="3" fill="currentColor" />
    <rect x="3" y="5" width="14" height="3" fill="currentColor" />
    <rect x="5" y="8" width="5" height="3" fill="currentColor" />
    <rect x="8" y="11" width="4" height="4" fill="currentColor" />
    <rect x="8" y="16" width="4" height="2" fill="currentColor" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* Step Card                                                                  */
/* -------------------------------------------------------------------------- */

const StepCard = ({ number, icon, title, description }) => (
  <div className="group relative border-r-4 border-[#000814] px-6 py-8 last:border-r-0">
    {/* Step number */}
    <div className="absolute right-4 top-3 font-['Silkscreen'] text-[10px] text-[#003566]/50">
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

    {/* Pixel accent */}
    <div className="mt-5 flex gap-1">
      <span className="h-1 w-6 bg-[#FFC300]" />
      <span className="h-1 w-2 bg-[#000814]" />
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Metric Badge                                                               */
/* -------------------------------------------------------------------------- */

const MetricBadge = ({ symbol, value, label }) => (
  <div className="flex items-center gap-3 border-l-2 border-[#001D3D] pl-4">
    <span className="text-lg text-[#FFD60A]">{symbol}</span>

    <div>
      <div className="font-['Press_Start_2P'] text-[9px] text-white md:text-[10px]">
        {value}
      </div>

      <div className="mt-1 font-['Silkscreen'] text-[9px] text-white/60">
        {label}
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Landing Page                                                               */
/* -------------------------------------------------------------------------- */

export const LandingPage = () => {
  return (
    <main className="min-h-screen bg-[#001D3D] text-white">
      {/* ================================================================== */}
      {/* NAVBAR (FLOATING PIXEL BAR)                                        */}
      {/* ================================================================== */}

      <nav className="sticky top-3 z-50 mx-3 sm:mx-6 lg:mx-auto mt-3 max-w-[1440px] border-4 border-[#000814] bg-[#000814] shadow-[4px_4px_0px_#000814]">
        <div className="flex h-[68px] items-center justify-between px-5 lg:px-10">
          {/* Branding */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3"
            aria-label="CampusPrint home"
          >
            <div className="flex h-11 w-11 items-center justify-center border-2 border-[#FFC300] bg-[#001D3D]">
              <PixelCapIcon className="h-8 w-8" />
            </div>

            <div className="hidden sm:block">
              <div className="font-['Press_Start_2P'] text-[13px] tracking-tight text-white">
                CAMPUSPRINT
              </div>

              <div className="mt-1 font-['Silkscreen'] text-[8px] tracking-wider text-[#FFD60A]">
                PRINT. PAY. PICK UP.
              </div>
            </div>
          </Link>

          {/* Center navigation */}
          <div className="hidden h-full items-center gap-6 lg:flex">
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

          {/* Auth buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="border-2 border-[#FFC300] px-3 py-2 font-['Silkscreen'] text-[9px] text-white transition-colors hover:bg-[#001D3D] hover:text-[#FFD60A] sm:px-4"
            >
              LOGIN
            </Link>

            <Link
              to="/signup"
              className="
                border-2 border-[#000814]
                bg-[#FFC300]
                px-3 py-2
                font-['Silkscreen'] text-[9px]
                text-[#000814]
                shadow-[2px_2px_0px_#FFD60A]
                transition-transform
                hover:bg-[#FFD60A]
                active:translate-x-[2px]
                active:translate-y-[2px]
                active:shadow-none
                sm:px-4
              "
            >
              CREATE ACCOUNT
            </Link>
          </div>
        </div>
      </nav>

      {/* ================================================================== */}
      {/* HERO                                                               */}
      {/* ================================================================== */}

      <section className="relative min-h-[580px] overflow-hidden bg-[#001D3D]">
        {/* Decorative pixel grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Pixel corner decorations */}
        <div className="absolute left-0 top-0 h-24 w-2 bg-[#FFC300]" />
        <div className="absolute left-2 top-0 h-2 w-24 bg-[#FFC300]" />

        <div className="absolute bottom-0 right-0 h-24 w-2 bg-[#FFD60A]" />
        <div className="absolute bottom-0 right-0 h-2 w-24 bg-[#FFD60A]" />

        <div className="relative mx-auto grid min-h-[580px] max-w-[1440px] items-center gap-8 px-6 py-14 md:grid-cols-2 md:px-10 lg:px-16">
          {/* Hero copy */}
          <div className="z-10">
            <div className="mb-6 inline-flex items-center gap-2 border-2 border-[#003566] bg-[#000814] px-3 py-2">
              <span className="h-2 w-2 bg-[#86EFAC]" />
              <span className="font-['Silkscreen'] text-[9px] text-white/80">
                CAMPUS PRINT NETWORK // ONLINE
              </span>
            </div>

            <h1 className="font-['Press_Start_2P'] text-3xl leading-[1.35] tracking-tight md:text-5xl">
              <span className="block text-white">PRINT.</span>
              <span className="block text-white">PAY.</span>
              <span className="block text-[#FFD60A]">PICK UP.</span>
            </h1>

            <div className="mt-6 h-1 w-28 bg-[#FFC300]" />

            <p className="mt-5 max-w-lg font-mono text-sm leading-6 text-[#FBF8F1]">
              Skip the queue. Send your documents from anywhere on campus.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="
                  inline-flex items-center gap-3
                  border-4 border-[#000814]
                  bg-[#FFC300]
                  px-5 py-4
                  font-['Press_Start_2P'] text-[10px]
                  text-[#000814]
                  shadow-[4px_4px_0px_#000814]
                  transition-all
                  hover:bg-[#FFD60A]
                  active:translate-x-1
                  active:translate-y-1
                  active:shadow-none
                "
              >
                <DocumentIcon className="h-5 w-5" />
                GET STARTED &gt;
              </Link>

              <a
                href="#how-it-works"
                className="
                  inline-flex items-center gap-3
                  border-2 border-[#003566]
                  bg-[#000814]
                  px-5 py-4
                  font-['Press_Start_2P'] text-[10px]
                  text-white
                  transition-colors
                  hover:border-[#38BDF8]
                  hover:text-[#38BDF8]
                "
              >
                ▶ HOW IT WORKS
              </a>
            </div>

            {/* Mini trust line */}
            <div className="mt-7 flex items-center gap-3 font-['Silkscreen'] text-[9px] text-white/50">
              <span className="h-2 w-2 bg-[#86EFAC]" />
              NO QUEUES
              <span className="text-[#003566]">/</span>
              FAST PICKUP
              <span className="text-[#003566]">/</span>
              CAMPUS READY
            </div>
          </div>

          {/* Hero artwork */}
          <div className="relative flex min-h-[340px] items-center justify-center md:min-h-[450px]">
            {/* Artwork frame */}
            <div className="absolute h-[75%] w-[75%] border-2 border-[#003566]" />

            <div className="absolute right-[8%] top-[12%] h-3 w-3 bg-[#FFD60A]" />
            <div className="absolute bottom-[15%] left-[8%] h-3 w-3 bg-[#38BDF8]" />
            <div className="absolute right-[17%] bottom-[8%] h-2 w-8 bg-[#FFC300]" />

            <img
              src="/landing-hero.png"
              alt="CampusPrint Workstation"
              className="relative z-10 w-full max-w-2xl object-contain"
              style={{
                imageRendering: "pixelated",
              }}
            />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* HOW IT WORKS                                                       */}
      {/* ================================================================== */}

      <section
        id="how-it-works"
        className="border-y-4 border-[#000814] bg-[#FBF8F1]"
      >
        {/* Section header */}
        <div className="border-b-4 border-[#000814] px-6 py-6 md:px-10">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between">
            <div>
              <div className="mb-2 font-['Silkscreen'] text-[10px] text-[#003566]">
                // HOW IT WORKS
              </div>

              <h2 className="font-['Press_Start_2P'] text-lg text-[#000814] md:text-xl">
                FOUR STEPS. ZERO QUEUES.
              </h2>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-3 w-3 bg-[#FFC300]" />
              <span className="h-3 w-3 bg-[#38BDF8]" />
              <span className="h-3 w-3 bg-[#86EFAC]" />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
      </section>

      {/* ================================================================== */}
      {/* SOCIAL PROOF / METRICS                                             */}
      {/* ================================================================== */}

      <section className="border-t-2 border-[#001D3D] bg-[#000814]">
        <div className="mx-auto flex min-h-[80px] max-w-[1440px] flex-col items-center justify-between gap-6 px-6 py-5 md:flex-row md:px-10">
          {/* Statement */}
          <div className="flex items-center gap-3">
            <span className="h-1 w-8 bg-[#FFD60A]" />

            <p className="font-['Silkscreen'] text-[9px] leading-4 text-white/70 md:text-xs">
              BUILT FOR STUDENTS.
              <br className="md:hidden" /> POWERED BY CONVENIENCE.
            </p>
          </div>

          {/* Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-7">
            <MetricBadge
              symbol="👥"
              value="10K+"
              label="STUDENTS"
            />

            <MetricBadge
              symbol="▣"
              value="50K+"
              label="PAGES PRINTED"
            />

            <MetricBadge
              symbol="★"
              value="4.8"
              label="STUDENT RATING"
            />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FOOTER                                                             */}
      {/* ================================================================== */}

      <footer
        id="help"
        className="border-t-4 border-[#001D3D] bg-[#000814]"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <div className="font-['Press_Start_2P'] text-[10px] text-white">
              CAMPUSPRINT
            </div>

            <p className="mt-2 font-['Silkscreen'] text-[8px] text-white/40">
              PRINT. PAY. PICK UP.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-['Silkscreen'] text-[9px] text-white/50">
            <Link
              to="/"
              className="hover:text-[#FFD60A]"
            >
              HOME
            </Link>

            <a
              href="#how-it-works"
              className="hover:text-[#FFD60A]"
            >
              HOW IT WORKS
            </a>

            <a
              href="#prices"
              className="hover:text-[#FFD60A]"
            >
              PRICES
            </a>

            <a
              href="#locations"
              className="hover:text-[#FFD60A]"
            >
              LOCATIONS
            </a>

            <a
              href="#help"
              className="flex items-center gap-2 hover:text-[#FFD60A]"
            >
              <HelpIcon />
              HELP
            </a>
          </div>

          <div className="font-mono text-[10px] text-white/30">
            © 2026 CAMPUSPRINT
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
