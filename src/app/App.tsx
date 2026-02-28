import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import imageJpg from './image.jpg';

const SERIF = "'EB Garamond', Georgia, 'Times New Roman', serif";

const TEXT = "var(--site-text)";
const MUTED = "var(--site-muted)";
const RULE = "var(--site-rule)";
const BG = "var(--site-bg)";
const FOOTNOTE = "var(--site-footnote)";

const rule: React.CSSProperties = {
  border: "none",
  borderTop: `1px solid ${RULE}`,
  margin: "10px 0 14px 0",
};

const sectionLabel: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: "10.5px",
  fontWeight: 500,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: MUTED,
};

const bodyText: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: "15px",
  fontWeight: 400,
  color: TEXT,
  lineHeight: 1.55,
};

const mutedText: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: "14px",
  color: MUTED,
  lineHeight: 1.5,
};

const externalLink: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: "14px",
  color: TEXT,
  textDecoration: "none",
  borderBottom: `1px solid ${RULE}`,
  paddingBottom: "1px",
  transition: "border-color 0.15s",
  cursor: "pointer",
};

// ── Data ──────────────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    company: "Mudraksh & McShaw",
    role: "Associate, Quant Systems Developer",
    period: "December 2025 — Present",
  },
  {
    company: "Zeko AI",
    role: "Machine Learning Intern",
    period: "July 2024 - October 2024",
  },
  {
    company: "JSS Academy of Technical Education Noida",
    role: "B.Tech, Electrical Engineering",
    period: "November 2021 - October 2025",
  },
];

const INTERESTS = [
  "Markets, capital, and investing (memos → microstructure)",
  "Systems and software built for correctness and leverage",
  "Applied mathematics and probabilistic thinking",
  "Reading: finance, [business] history, essays/blogs, Research [AI/Finance]",
  "Cinema, art, and the aesthetics of ideas",
];

const RECENT_POST = {
  title: "Chaos and Excess",
  date: "November 2025",
  excerpt:
    "the problem with excess or abundance, observed historically, is that its existence often gets accompanied by chaos.",
  href: "https://shandilyabh.substack.com/p/chaos-and-excess",
  substackUrl: "https://shandilyabh.substack.com/p/chaos-and-excess",
};

const READING_1 = {
  title: "The Rise and Fall of Nations: Forces of Change in the Post-Crisis World",
  author: "Ruchir Sharma",
  href: "https://ruchirsharma.com/books/the-rise-and-fall-of-nations/",
};

const READING_2 = {
  title: "Titan: The Life of John D. Rockefeller, Sr.",
  author: "Ron Chernow",
  href: "https://www.amazon.in/Titan-Life-John-Rockefeller-Sr/dp/1400077303/",
};

// ── Theme Toggle ────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
      aria-label="Toggle Theme"
      style={{ color: TEXT }}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

// ── Component ──────────────────────────────────────────────────────────

export default function App() {
  return (
    <div
      className="flex flex-col min-h-screen box-border p-6 md:px-[60px] md:pt-[44px] md:pb-[36px] transition-colors duration-300"
      style={{
        backgroundColor: BG,
        fontFamily: SERIF,
        color: TEXT,
      }}
    >
      {/* ── Letterhead ───────────────────────────────────────────── */}
      <header
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-[18px] shrink-0 gap-6 md:gap-0 relative"
      >
        {/* Left: Tagline & Toggle */}
        <div
          className="order-2 md:order-1 flex items-center gap-2 w-full md:w-auto"
        >
          <ThemeToggle />
          <div
            style={{
              fontFamily: SERIF,
              fontSize: "15px",
              fontStyle: "italic",
              color: MUTED,
              maxWidth: "480px",
            }}
          >
            forever fascinated by the financial markets, human nature, and technology.
          </div>
        </div>

        {/* Center: Name */}
        <div 
          className="md:absolute md:left-1/2 md:-translate-x-1/2 md:bottom-[2px] order-1 md:order-2 w-full md:w-auto"
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: "28px",
              fontWeight: 500,
              letterSpacing: "0.01em",
              color: TEXT,
              textAlign: "center"
            }}
          >
            Abhishek Shandilya
          </div>
        </div>

        {/* Right: Nav Links */}
        <nav
          className="flex flex-wrap gap-4 md:gap-[22px] items-center pb-[2px] w-full md:w-auto order-3 md:text-right justify-start md:justify-end"
        >
          {[
            { label: "LinkedIn", href: "https://linkedin.com/in/shandilyabh" },
            { label: "X", href: "https://x.com/shandilyabh" },
            { label: "GitHub", href: "https://github.com/shandilyabh" },
            { label: "Ster", href: "https://shandilyabh.substack.com" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...externalLink,
                fontSize: "13.5px",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "var(--site-text)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "var(--site-rule)")
              }
            >
              {l.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Full-width rule */}
      <hr
        style={{
          border: "none",
          borderTop: `1px solid ${TEXT}`,
          margin: "0 0 0 0",
          flexShrink: 0,
        }}
      />

      {/* ── Body grid ────────────────────────────────────────────── */}
      <main
        className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr_1.1fr] flex-1 mt-6 md:mt-0 md:overflow-hidden gap-8 md:gap-0"
      >
        {/* ── Column 1: Experience + Reading ── */}
        <div
          className="flex flex-col gap-8 md:gap-[32px] md:pt-[26px] md:pr-[40px] border-b md:border-b-0 md:border-r pb-8 md:pb-0"
          style={{ borderColor: RULE }}
        >
          {/* Experience */}
          <section>
            <div style={sectionLabel}>Experience & Education</div>
            <hr style={rule} />
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {EXPERIENCE.map((e) => (
                <div key={e.company}>
                  <div
                    style={{
                      ...bodyText,
                      fontSize: "15px",
                      fontWeight: 500,
                      marginBottom: "1px",
                    }}
                  >
                    {e.company}
                  </div>
                  <div style={{ ...mutedText, fontStyle: "italic" }}>{e.role}</div>
                  <div
                    style={{
                      ...mutedText,
                      fontSize: "13px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {e.period}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Currently Reading */}
          <section>
            <div style={sectionLabel}>Currently Reading</div>
            <hr style={rule} />
            <div
              style={{
                ...bodyText,
                fontStyle: "italic",
                marginBottom: "3px",
              }}
            >
              {READING_1.title}
            </div>
            <div style={{ ...mutedText, marginBottom: "10px" }}>
              {READING_1.author}
            </div>
            <a
              href={READING_1.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...externalLink, fontSize: "13px" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "var(--site-text)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "var(--site-rule)")
              }
            >
              Here →
            </a>

            <div
              style={{
                ...bodyText,
                fontStyle: "italic",
                marginBottom: "3px",
                marginTop: "20px"
              }}
            >
              {READING_2.title}
            </div>
            <div style={{ ...mutedText, marginBottom: "10px" }}>
              {READING_2.author}
            </div>
            <a
              href={READING_2.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...externalLink, fontSize: "13px" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "var(--site-text)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "var(--site-rule)")
              }
            >
              Here →
            </a>
          </section>
        </div>

        {/* ── Column 2: Interests ── */}
        <div
          className="md:pt-[26px] md:px-[36px] border-b md:border-b-0 md:border-r pb-8 md:pb-0"
          style={{ borderColor: RULE }}
        >
          <div style={sectionLabel}>Interests</div>
          <hr style={rule} />
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0",
            }}
          >
            {INTERESTS.map((item, i) => (
              <li
                key={i}
                style={{
                  ...bodyText,
                  fontSize: "14.5px",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  borderBottom:
                    i < INTERESTS.length - 1 ? `1px solid ${RULE}` : "none",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "14px",
                    textAlign: "center",
                    color: MUTED,
                    fontSize: "18px",
                    lineHeight: 1,
                    flexShrink: 0,
                    fontStyle: "italic",
                  }}
                >
                  —
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Column 3: Substack ── */}
        <div
          className="md:pt-[26px] md:pl-[36px] flex flex-col pb-8 md:pb-0"
        >
          <div style={sectionLabel}>
            <strong style={{ fontWeight: 700, color: TEXT }}>Ster</strong> — Periodic Newsletter I write
          </div>
          <hr style={rule} />

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: "17px",
                fontWeight: 500,
                color: TEXT,
                lineHeight: 1.35,
                marginBottom: "10px",
                fontStyle: "italic",
              }}
            >
              {RECENT_POST.title}
            </div>

            <div
              style={{
                ...mutedText,
                fontSize: "12.5px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontStyle: "normal",
                marginBottom: "14px",
              }}
            >
              {RECENT_POST.date}
            </div>

            <img
              src={imageJpg}
              alt="Substack Post"
              className="w-full h-auto mb-5 grayscale hover:grayscale-0 transition-all duration-500"
              style={{ borderRadius: "2px" }}
            />

            <p
              style={{
                ...bodyText,
                fontSize: "14.5px",
                margin: "0 0 20px 0",
                lineHeight: 1.65,
              }}
            >
              {RECENT_POST.excerpt}
            </p>

            <a
              href={RECENT_POST.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...externalLink,
                fontSize: "13.5px",
                fontStyle: "italic",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "var(--site-text)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "var(--site-rule)")
              }
            >
              Read →
            </a>
          </div>

          {/* Footer note */}
          <div
            style={{
              paddingTop: "16px",
              borderTop: `1px solid ${RULE}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "24px",
            }}
          >
            <span
              style={{
                fontFamily: SERIF,
                fontSize: "12px",
                color: FOOTNOTE,
                letterSpacing: "0.04em",
              }}
            >
              India
            </span>
            <span
              style={{
                fontFamily: SERIF,
                fontSize: "12px",
                color: FOOTNOTE,
                letterSpacing: "0.04em",
              }}
            >
              Est. 2026
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}