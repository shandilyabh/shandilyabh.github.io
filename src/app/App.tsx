import imageJpg from './image.jpg';

const SERIF = "'EB Garamond', Georgia, 'Times New Roman', serif";

const TEXT = "#1c1b18";
const MUTED = "#7a7870";
const RULE = "#ddd9ce";
const BG = "#f9f8f5";

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

// ── Component ──────────────────────────────────────────────────────────

export default function App() {
  return (
    <div
      className="flex flex-col min-h-screen box-border p-6 md:px-[60px] md:pt-[44px] md:pb-[36px]"
      style={{
        backgroundColor: BG,
        fontFamily: SERIF,
        color: TEXT,
      }}
    >
      {/* ── Letterhead ───────────────────────────────────────────── */}
      <header
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-[18px] shrink-0 gap-4 md:gap-0"
      >
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: "21px",
              fontWeight: 500,
              letterSpacing: "0.01em",
              color: TEXT,
              marginBottom: "5px",
            }}
          >
            Abhishek Shandilya
          </div>
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

        <nav
          className="flex flex-wrap gap-4 md:gap-[22px] items-center pb-[2px]"
        >
          {[
            { label: "LinkedIn", href: "https://linkedin.com/in/shandilyabh" },
            { label: "X", href: "https://x.com/shandilyabh" },
            { label: "GitHub", href: "https://github.com/shandilyabh" },
            { label: "Ster", href: "https://shandilyabh.substack.com" },
            // { label: "Resume", href: "https://x.com/shandilyabh" }
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
                ((e.currentTarget as HTMLElement).style.borderColor = TEXT)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = RULE)
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
                ((e.currentTarget as HTMLElement).style.borderColor = TEXT)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = RULE)
              }
            >
              Here →
            </a>

            {/* <div style={sectionLabel}>Currently Reading</div> */}
            {/* <hr style={rule} /> */}
            
            

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
                ((e.currentTarget as HTMLElement).style.borderColor = TEXT)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = RULE)
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
              className="w-full h-auto mb-5"
              style={{ borderRadius: "2px" }}
            />

            <p
              style={{
                ...bodyText,
                fontSize: "14.5px",
                color: "#4a4840",
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
                ((e.currentTarget as HTMLElement).style.borderColor = TEXT)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = RULE)
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
                color: RULE,
                letterSpacing: "0.04em",
              }}
            >
              India
            </span>
            <span
              style={{
                fontFamily: SERIF,
                fontSize: "12px",
                color: RULE,
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