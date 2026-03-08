import { useTheme } from 'next-themes';
import { Sun, Moon, Terminal, ArrowUp, ArrowDown, X, MessageSquare, Github } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import imageJpg from './image.jpg';

const SERIF = "'EB Garamond', Georgia, 'Times New Roman', serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

const TEXT = "var(--site-text)";
const MUTED = "var(--site-muted)";
const RULE = "var(--site-rule)";
const BG = "var(--site-bg)";
const FOOTNOTE = "var(--site-footnote)";

// ── Types ─────────────────────────────────────────────────────────────

interface TickerData {
  price: number;
  change: number;
  percent_change: number;
  currency: string;
}

interface MarketData {
  last_updated: string;
  tickers: Record<string, TickerData>;
  charts: Record<string, { time: string; value: number }[]>;
  article?: {
    title: string;
    content: string;
    url: string;
  };
  tweet?: {
    text: string;
    date: string;
    url: string;
  };
  github?: {
    weeks: { 
      contributionDays: { date: string; level: number; count: number }[] 
    }[];
  };
}

const SYMBOL_MAP: Record<string, string> = {
  "^NSEI": "NIFTY",
  "^GSPC": "S&P 500",
  "^FTSE": "FTSE 100",
  "INR=X": "USDINR",
  "BTC-USD": "BTC",
  "CL=F": "CRUDE",
  "GC=F": "GOLD",
  "SI=F": "SILVER",
};

// ── Bloomberg Components ──────────────────────────────────────────────

function TerminalTicker({ data }: { data: MarketData | null }) {
  if (!data || !data.tickers) return <div style={{ height: "46px", borderBottom: `1px solid ${RULE}` }} />;

  const tickerItems = Object.entries(data.tickers);
  if (tickerItems.length === 0) return <div style={{ height: "46px", borderBottom: `1px solid ${RULE}` }} />;

  return (
    <div className="overflow-hidden whitespace-nowrap py-3 relative border-b border-[#333] bg-black shrink-0" style={{ height: "46px" }}>
      <div className="inline-block animate-marquee hover:pause">
        {[...tickerItems, ...tickerItems].map(([symbol, info], i) => (
          <span key={`${symbol}-${i}`} className="mx-6 inline-flex items-center gap-2 text-[12px] font-mono tracking-tight">
            <span className="text-[#7C7C7C]">{SYMBOL_MAP[symbol] || symbol}</span>
            <span style={{ color: "#FFB100" }}>{info.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className={info.change >= 0 ? "text-emerald-500" : "text-red-500"} style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {info.change >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
              {Math.abs(info.change).toFixed(2)} ({info.percent_change.toFixed(2)}%)
            </span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 40s linear infinite;
        }
        .pause:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}

function TerminalComparativeChart({ data }: { data: MarketData['charts'] | undefined }) {
  if (!data) return null;

  const symbols = ["^NSEI", "^GSPC", "^FTSE"];
  const allTimes = Array.from(new Set(symbols.flatMap(sym => (data[sym] || []).map(p => p.time)))).sort();
  
  const firstVals: Record<string, number> = {};
  symbols.forEach(sym => {
    if (data[sym] && data[sym].length > 0) {
      firstVals[sym] = data[sym][0].value;
    }
  });

  const chartData = allTimes.map(time => {
    const entry: any = { time };
    symbols.forEach(sym => {
      const point = (data[sym] || []).find(p => p.time === time);
      if (point && firstVals[sym]) {
        entry[sym] = ((point.value - firstVals[sym]) / firstVals[sym]) * 100;
      }
    });
    return entry;
  });

  return (
    <div className="mt-8 border border-[#333] p-4 bg-black relative min-h-[300px] shrink-0">
      <div className="text-[10px] font-mono text-[#7C7C7C] uppercase tracking-widest mb-4">
        Global Indices / YTD RELATIVE PERFORMANCE (%)
      </div>
      
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="2 2" stroke="#222222" vertical={false} />
            <XAxis dataKey="time" hide={true} />
            <YAxis 
              orientation="right"
              tick={{ fill: '#7C7C7C', fontSize: 10, fontFamily: MONO }}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
              unit="%"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#000', 
                borderColor: '#333',
                fontFamily: MONO,
                fontSize: '11px',
                color: '#FFB100'
              }}
              itemStyle={{ padding: '0' }}
            />
            <Legend 
              verticalAlign="top" 
              align="left"
              wrapperStyle={{ 
                fontFamily: MONO, 
                fontSize: '11px', 
                paddingBottom: '20px',
                textTransform: 'uppercase'
              }}
              formatter={(value) => SYMBOL_MAP[value] || value}
            />
            <Line type="monotone" dataKey="^NSEI" stroke="#FFB100" strokeWidth={2} dot={false} activeDot={{ r: 4 }} animationDuration={1000} />
            <Line type="monotone" dataKey="^GSPC" stroke="#00BCFF" strokeWidth={2} dot={false} activeDot={{ r: 4 }} animationDuration={1000} />
            <Line type="monotone" dataKey="^FTSE" stroke="#FF00FF" strokeWidth={2} dot={false} activeDot={{ r: 4 }} animationDuration={1000} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TerminalWireFeed({ tweet, isBloomberg }: { tweet?: MarketData['tweet'], isBloomberg: boolean }) {
  if (!tweet || !tweet.text) return null;

  return (
    <div className="mt-8 mb-2 shrink-0">
      <div style={sectionLabel(isBloomberg)}>Latest (X Timeline)</div>
      <hr style={rule()} />
      <div className="text-[13px] font-mono text-[#FFB100] leading-relaxed italic mb-3">
        {tweet.text}
      </div>
      <div className="flex justify-between items-center">
        <a 
          href={tweet.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[11px] font-mono text-[#00BCFF] hover:underline"
        >
          VIEW ORIGINAL SOURCE →
        </a>
        <div className="text-[10px] font-mono text-[#7C7C7C]">{tweet.date}</div>
      </div>
    </div>
  );
}

function TerminalGitHubHeatmap({ weeks, isBloomberg }: { weeks?: MarketData['github']['weeks'], isBloomberg: boolean }) {
  const { resolvedTheme } = useTheme();
  if (!weeks || weeks.length === 0) return null;

  const bloombergLevels = ["#1a1a1a", "#332200", "#664400", "#996600", "#FFB100"];
  const vanillaLevels = resolvedTheme === 'dark' 
    ? ["#161b22", "#30363d", "#6e7681", "#9198a1", "#ffffff"]
    : ["#ebedf0", "#dcdcdc", "#a0a0a0", "#707070", "#000000"];

  const activeLevels = isBloomberg ? bloombergLevels : vanillaLevels;

  return (
    <div className="mt-10 mb-4 shrink-0">
      <div style={sectionLabel(isBloomberg)}>GitHub Contribution Map</div>
      <hr style={rule()} />
      <div className="flex gap-[3px]">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[3px]">
            {week.contributionDays.map((day, dayIndex) => (
              <div 
                key={dayIndex}
                title={`${day.date}: ${day.count} contributions`}
                style={{ 
                  width: "10px", 
                  height: "10px", 
                  backgroundColor: activeLevels[day.level],
                  borderRadius: "1px"
                }} 
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[9px] font-mono text-muted uppercase tracking-wider">
        <span>Less Activity</span>
        <div className="flex gap-1">
          {activeLevels.map((c, i) => (
            <div key={i} style={{ width: 8, height: 8, backgroundColor: c }} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────

const rule = (): React.CSSProperties => ({
  border: "none",
  borderTop: `1px solid ${RULE}`,
  margin: "10px 0 14px 0",
});

const sectionLabel = (isBloomberg: boolean): React.CSSProperties => ({
  fontFamily: isBloomberg ? MONO : SERIF,
  fontSize: isBloomberg ? "9.5px" : "10.5px",
  fontWeight: 500,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: MUTED,
});

const bodyText = (isBloomberg: boolean): React.CSSProperties => ({
  fontFamily: isBloomberg ? MONO : SERIF,
  fontSize: isBloomberg ? "13.5px" : "15px",
  fontWeight: 400,
  color: TEXT,
  lineHeight: 1.55,
});

const mutedText = (isBloomberg: boolean): React.CSSProperties => ({
  fontFamily: isBloomberg ? MONO : SERIF,
  fontSize: isBloomberg ? "12.5px" : "14px",
  color: MUTED,
  lineHeight: 1.5,
});

const externalLink = (isBloomberg: boolean): React.CSSProperties => ({
  fontFamily: isBloomberg ? MONO : SERIF,
  fontSize: isBloomberg ? "12.5px" : "14px",
  color: isBloomberg ? "#00BCFF" : TEXT,
  textDecoration: "none",
  borderBottom: `1px solid ${isBloomberg ? "#00BCFF" : RULE}`,
  paddingBottom: "1px",
  transition: "border-color 0.15s",
  cursor: "pointer",
});

// ── Data ──────────────────────────────────────────────────────────────

const EXPERIENCE = [
  { company: "Mudraksh & McShaw", role: "Associate, Quant Systems Developer", period: "December 2025 — Present" },
  { company: "Zeko AI", role: "Intern, Machine Learning", period: "August 2024 - October 2024" },
  { company: "JSS Academy of Technical Education Noida", role: "B.Tech, Electrical Engineering", period: "November 2021 - October 2025" },
];

const SKILLS = [
  { category: "Programming Languages", items: "Java, Python, C, C++, SQL, Polars, BASH" },
  { category: "Data & Cloud", items: "AWS (Fargate, Lambda, S3, DynamoDB), PostgreSQL, Redis, ElasticSearch, FAISS, Docker, MongoDB" },
  { category: "ML/AI & Web", items: "PyTorch, SciKit Learn, XGBoost, FastAPI, Spring Boot, Selenium" },
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
  excerpt: "the problem with excess or abundance, observed historically, is that its existence often gets accompanied by chaos.",
  href: "https://shandilyabh.substack.com/p/chaos-and-excess",
};

const READING_1 = { title: "The Rise and Fall of Nations: Forces of Change in the Post-Crisis World", author: "Ruchir Sharma", href: "https://ruchirsharma.com/books/the-rise-and-fall-of-nations/" };
const READING_2 = { title: "Titan: The Life of John D. Rockefeller, Sr.", author: "Ron Chernow", href: "https://www.amazon.in/Titan-Life-John-Rockefeller-Sr/dp/1400077303/" };

// ── Theme Toggles ──────────────────────────────────────────────────────

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="w-8 h-8" />;
  return (
    <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer" aria-label="Toggle Theme" style={{ color: TEXT }}>
      {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

function BloombergToggle({ active, onToggle }: { active: boolean, onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`p-2 rounded-full transition-colors cursor-pointer ${active ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`} aria-label="Toggle Bloomberg Mode" style={{ color: TEXT }}>
      <Terminal size={16} />
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────

export default function App() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isBloomberg, setIsBloomberg] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const saved = localStorage.getItem('bloomberg-mode');
    if (saved !== null) {
      if (saved === 'true') {
        setIsBloomberg(true);
        document.documentElement.classList.add('bloomberg');
      }
    } else {
      if (window.innerWidth >= 1024) {
        setIsBloomberg(true);
        document.documentElement.classList.add('bloomberg');
        localStorage.setItem('bloomberg-mode', 'true');
        setTheme('dark');
      } else {
        setIsBloomberg(false);
        localStorage.setItem('bloomberg-mode', 'false');
        setTheme('light');
      }
    }

    const fetchUrl = `/market-data.json?t=${new Date().getTime()}`;
    fetch(fetchUrl).then(res => res.json()).then(data => setMarketData(data)).catch(err => console.error(err));
    return () => window.removeEventListener('resize', checkMobile);
  }, [setTheme]);

  const toggleBloomberg = () => {
    const newState = !isBloomberg;
    setIsBloomberg(newState);
    localStorage.setItem('bloomberg-mode', String(newState));
    if (newState) {
      document.documentElement.classList.add('bloomberg');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('bloomberg');
      setTheme('light');
      setIsReading(false);
    }
  };

  if (!mounted) return null;
  const currentTheme = resolvedTheme || 'light';

  // Mobile Terminal Reader full-screen view
  if (isBloomberg && isReading && isMobile) {
    return (
      <div className="flex flex-col h-screen bg-black text-[#FFB100] p-6 font-mono overflow-hidden">
        <header className="flex justify-between items-center shrink-0 mb-4 border-b border-[#333] pb-2">
          <div className="text-[10px] tracking-widest text-[#7C7C7C]">TERMINAL_READER.EXE</div>
          <button onClick={() => setIsReading(false)} className="text-[11px] font-bold">[CLOSE / BACK]</button>
        </header>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar terminal-content">
          <div className="mb-6 p-3 border border-[#333] bg-black/40">
            <h1 className="text-[20px] mb-2">{marketData?.article?.title || RECENT_POST.title}</h1>
            <div className="text-[#7C7C7C] text-[10px]">SOURCE: SHANDILYABH.SUBSTACK.COM / NOV 2025</div>
          </div>
          <div 
            dangerouslySetInnerHTML={{ __html: marketData?.article?.content || "Loading content..." }} 
            className="article-body text-[14px] leading-relaxed"
          />
        </div>
        <footer className="mt-4 pt-2 border-t border-[#333] text-[10px] text-[#7C7C7C] flex justify-between">
          <span>ABHISHEK SHANDILYA</span>
          <span>ESTD 2026</span>
        </footer>
        <style>{`
          .article-body a { color: #00BCFF !important; text-decoration: underline; }
          .article-body p { margin-bottom: 1.5em; }
          .article-body h2, .article-body h3 { color: #FFB100; margin: 1.2em 0 0.5em 0; font-size: 1.2em; }
          .custom-scrollbar::-webkit-scrollbar { width: 0px !important; background: transparent !important; }
          .custom-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isMobile ? 'min-h-screen' : 'h-screen overflow-hidden'} box-border p-6 md:px-[60px] md:pt-[44px] md:pb-[36px] transition-colors duration-300`} style={{ backgroundColor: "transparent", fontFamily: isBloomberg ? MONO : SERIF, color: TEXT }}>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-[18px] shrink-0 gap-6 md:gap-0 relative">
        <div className="order-2 md:order-1 flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 min-w-[8px]">
            <BloombergToggle active={isBloomberg} onToggle={toggleBloomberg} />
            {!isBloomberg && <ThemeToggle />}
          </div>
          <div style={{ fontFamily: isBloomberg ? MONO : SERIF, fontSize: "15px", fontStyle: isBloomberg ? "normal" : "italic", color: MUTED, maxWidth: "480px" }}>
            {isBloomberg ? "" : ""}financial markets, humans, and technology
          </div>
        </div>
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2 md:bottom-[2px] order-1 md:order-2 w-full md:w-auto">
          <div 
            onClick={isBloomberg ? toggleBloomberg : undefined}
            style={{ 
              fontFamily: isBloomberg ? MONO : SERIF, 
              fontSize: "28px", 
              fontWeight: 500, 
              letterSpacing: "0.01em", 
              color: TEXT, 
              textAlign: "center",
              cursor: isBloomberg ? "pointer" : "default"
            }}
          >
            {isBloomberg ? "ABHISHEK SHANDILYA" : "Abhishek Shandilya"}
          </div>
        </div>
        <nav className="flex flex-wrap gap-4 md:gap-[22px] items-center pb-[2px] w-full md:w-auto order-3 md:text-right justify-start md:justify-end">
          {[
            { label: "LinkedIn", href: "https://linkedin.com/in/shandilyabh" },
            { label: "X", href: "https://x.com/shandilyabh" },
            { label: "GitHub", href: "https://github.com/shandilyabh" },
            { label: "Ster", href: "https://shandilyabh.substack.com" },
            { label: "Mail", href: "mailto:shandilyabh@gmail.com" },
            { label: "Resume", href: "https://drive.google.com/file/d/1TbPkfw5QCnpQ29A-5OsYIWqo_8NQ9ku0/view?usp=sharing" },
          ].map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ ...externalLink(isBloomberg), fontSize: "13.5px", letterSpacing: "0.01em" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = isBloomberg ? "#00BCFF" : "var(--site-text)")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = isBloomberg ? "#00BCFF" : "var(--site-rule)")}>
              {isBloomberg ? l.label.toUpperCase() : l.label}
            </a>
          ))}
        </nav>
      </header>

      {isBloomberg && <TerminalTicker data={marketData} />}
      <hr style={{ border: "none", borderTop: `1px solid ${isBloomberg ? '#FFB100' : TEXT}`, margin: "0", flexShrink: 0 }} />

      <main className={`grid grid-cols-1 md:grid-cols-[1.15fr_1fr_1.1fr] flex-1 mt-6 md:mt-0 ${isMobile ? '' : 'overflow-hidden'} gap-8 md:gap-0`}>
        {/* Column 1: Experience / Map / Reading */}
        <div className={`flex flex-col md:pt-[26px] md:pr-[40px] border-b md:border-b-0 md:border-r pb-8 md:pb-0 ${isMobile ? '' : 'h-full overflow-hidden'}`} style={{ borderColor: RULE }}>
          <div className={`${isMobile ? '' : 'flex-1 overflow-y-auto pr-4 custom-scrollbar'}`}>
            <section>
              <div style={sectionLabel(isBloomberg)}>Experience & Education</div>
              <hr style={rule()} />
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {EXPERIENCE.map((e) => (
                  <div key={e.company + e.period}>
                    <div style={{ ...bodyText(isBloomberg), fontSize: isBloomberg ? "12.5px" : "13.5px", fontWeight: 500, marginBottom: "1px" }}>{isBloomberg ? e.company.toUpperCase() : e.company}</div>
                    <div style={{ ...mutedText(isBloomberg), fontSize: isBloomberg ? "11.5px" : "12.5px", fontStyle: isBloomberg ? "normal" : "italic" }}>{e.role}</div>
                    <div style={{ ...mutedText(isBloomberg), fontSize: isBloomberg ? "10.5px" : "11.5px", letterSpacing: "0.02em" }}>{e.period}</div>
                  </div>
                ))}
              </div>
            </section>

            {isBloomberg && (
              <div className="px-8">
                <TerminalComparativeChart data={marketData?.charts} />
              </div>
            )}

            <section className="mt-8">
              <div style={sectionLabel(isBloomberg)}>Currently Reading</div>
              <hr style={rule()} />
              <div style={{ ...bodyText(isBloomberg), fontSize: isBloomberg ? "12.5px" : "13.5px", fontStyle: isBloomberg ? "normal" : "italic", marginBottom: "2px" }}>{READING_1.title}</div>
              <div style={{ ...mutedText(isBloomberg), fontSize: isBloomberg ? "11.5px" : "12.5px", marginBottom: "8px" }}>{READING_1.author}</div>
              <a href={READING_1.href} target="_blank" rel="noopener noreferrer" style={{ ...externalLink(isBloomberg), fontSize: "11.5px" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = isBloomberg ? "#00BCFF" : "var(--site-text)")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = isBloomberg ? "#00BCFF" : "var(--site-rule)")}>{isBloomberg ? "VIEW →" : "Here →"}</a>
              
              <div style={{ ...bodyText(isBloomberg), fontSize: isBloomberg ? "12.5px" : "13.5px", fontStyle: isBloomberg ? "normal" : "italic", marginBottom: "2px", marginTop: "18px" }}>{READING_2.title}</div>
              <div style={{ ...mutedText(isBloomberg), fontSize: isBloomberg ? "11.5px" : "12.5px", marginBottom: "8px" }}>{READING_2.author}</div>
              <a href={READING_2.href} target="_blank" rel="noopener noreferrer" style={{ ...externalLink(isBloomberg), fontSize: "11.5px" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = isBloomberg ? "#00BCFF" : "var(--site-text)")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = isBloomberg ? "#00BCFF" : "var(--site-rule)")}>{isBloomberg ? "VIEW →" : "Here →"}</a>
            </section>
          </div>
        </div>

        {/* Column 2: Skills / GitHub / Interests */}
        <div className={`flex flex-col md:pt-[26px] md:px-[36px] border-b md:border-b-0 md:border-r pb-8 md:pb-0 ${isMobile ? '' : 'h-full overflow-hidden'}`} style={{ borderColor: RULE }}>
          <div className={`${isMobile ? '' : 'flex-1 overflow-y-auto pr-4 custom-scrollbar'}`}>
            <section>
              <div style={sectionLabel(isBloomberg)}>Technical Skills</div>
              <hr style={rule()} />
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {SKILLS.map((s) => (
                  <div key={s.category}>
                    <div style={{ ...bodyText(isBloomberg), fontSize: "10.5px", fontWeight: 600, color: MUTED, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.category}</div>
                    <div style={{ ...bodyText(isBloomberg), fontSize: "13px" }}>{s.items}</div>
                  </div>
                ))}
              </div>
            </section>

            <TerminalGitHubHeatmap weeks={marketData?.github?.weeks} isBloomberg={isBloomberg} />
            
            <div className="mt-10">
              <div style={sectionLabel(isBloomberg)}>Interests</div>
              <hr style={rule()} />
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0" }}>
                {INTERESTS.map((item, i) => (
                  <li key={i} style={{ ...bodyText(isBloomberg), fontSize: isBloomberg ? "13px" : "14.5px", paddingTop: "8px", paddingBottom: "8px", borderBottom: i < INTERESTS.length - 1 ? `1px solid ${RULE}` : "none", display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <span style={{ display: "inline-block", width: "14px", textAlign: "center", color: MUTED, fontSize: isBloomberg ? "14px" : "18px", lineHeight: 1, flexShrink: 0, fontStyle: isBloomberg ? "normal" : "italic" }}>{isBloomberg ? ">" : "—"}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Column 3: Substack / Terminal Reader */}
        <div className={`md:pt-[26px] md:pl-[36px] flex flex-col pb-8 md:pb-0 ${isMobile ? '' : 'h-full overflow-hidden'}`}>
          <div className="flex justify-between items-center mb-[-10px] shrink-0">
            <div style={sectionLabel(isBloomberg)}>
              <strong style={{ fontWeight: 700, color: TEXT }}>{isBloomberg ? "STER" : "Ster"}</strong> — Periodic Newsletter I write
            </div>
            {isReading && !isMobile && (
              <button onClick={() => setIsReading(false)} className="flex items-center gap-1 text-[10px] font-mono hover:text-white transition-colors cursor-pointer" style={{ color: "#FFB100" }}>[BACK]</button>
            )}
          </div>
          <hr style={rule()} className="shrink-0" />
          <div className={`${isMobile ? '' : 'flex-1 overflow-y-auto pr-2 custom-scrollbar'}`}>
            {isReading && !isMobile ? (
              <div className="terminal-content">
                <div style={{ fontFamily: MONO, color: TEXT, fontSize: "12.5px", lineHeight: 1.6 }}>
                  <div className="mb-6 p-3 border border-[#333] bg-black/40">
                    <div className="text-[9px] text-muted mb-1 uppercase tracking-widest">FILE: CHAOS_AND_EXCESS.TXT</div>
                    <h1 style={{ color: "#FFB100", fontSize: "18px", marginBottom: "4px", lineHeight: 1.2 }}>{marketData?.article?.title || RECENT_POST.title}</h1>
                    <div className="text-muted text-[10px]">STATUS: {marketData?.article?.content && marketData.article.content.length > 100 ? "LOADED" : "UNAVAILABLE / FALLBACK MODE"} / NOV 2025</div>
                  </div>
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: (marketData?.article?.content && marketData.article.content.length > 100) 
                        ? marketData.article.content 
                        : `<p>${RECENT_POST.excerpt}</p><p style="color: ${MUTED}; font-style: italic;">[Terminal Error: High-fidelity content currently restricted by source origin. Direct link recommended.]</p>`
                    }} 
                    className="article-body" 
                  />
                </div>
              </div>
            ) : (
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: isBloomberg ? MONO : SERIF, fontSize: "17px", fontWeight: 500, color: TEXT, lineHeight: 1.35, marginBottom: "10px", fontStyle: isBloomberg ? "normal" : "italic" }}>{RECENT_POST.title}</div>
                <div style={{ ...mutedText(isBloomberg), fontSize: "12.5px", letterSpacing: "0.06em", textTransform: "uppercase", fontStyle: "normal", marginBottom: "14px" }}>{RECENT_POST.date}</div>
                <img src={imageJpg} alt="Substack Post" className={`w-full h-auto mb-5 grayscale hover:grayscale-0 transition-all duration-500 ${isBloomberg ? 'border border-muted' : ''}`} style={{ borderRadius: "2px" }} />
                <p style={{ ...bodyText(isBloomberg), fontSize: "14.5px", margin: "0 0 20px 0", lineHeight: 1.65 }}>{RECENT_POST.excerpt}</p>
                <a href={RECENT_POST.href} target={isBloomberg ? "_self" : "_blank"} rel="noopener noreferrer" onClick={(e) => { if (isBloomberg) { e.preventDefault(); setIsReading(true); } }} style={{ ...externalLink(isBloomberg), fontSize: "13.5px", fontStyle: isBloomberg ? "normal" : "italic" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = isBloomberg ? "#00BCFF" : "var(--site-text)")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = isBloomberg ? "#00BCFF" : "var(--site-rule)")}>
                  {isBloomberg ? "READ ARTICLE →" : "Read →"}
                </a>
                {isBloomberg && marketData?.tweet && <TerminalWireFeed tweet={marketData.tweet} isBloomberg={isBloomberg} />}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer style={{ marginTop: isMobile ? "40px" : "24px", flexShrink: 0, paddingBottom: isMobile ? "24px" : "0" }}>
        <hr style={{ border: "none", borderTop: `1px solid ${RULE}`, margin: "0 0 16px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: isBloomberg ? MONO : SERIF, fontSize: "12px", color: FOOTNOTE, letterSpacing: "0.04em" }}>{isBloomberg ? "LOCATION: INDIA" : "Location: India"}</span>
          <span style={{ fontFamily: isBloomberg ? MONO : SERIF, fontSize: "12px", color: FOOTNOTE, letterSpacing: "0.04em" }}>{isBloomberg ? "ABHISHEK SHANDILYA" : "Abhishek Shandilya"}</span>
          <span style={{ fontFamily: isBloomberg ? MONO : SERIF, fontSize: "12px", color: FOOTNOTE, letterSpacing: "0.04em" }}>{isBloomberg ? "ESTD 2026" : "Estd 2026"}</span>
        </div>
      </footer>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px !important; background: transparent !important; }
        .custom-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        .article-body a { color: #00BCFF !important; text-decoration: underline; }
        .article-body p { margin-bottom: 1.2em; }
        .article-body h2, .article-body h3 { color: #FFB100; margin: 1.2em 0 0.4em 0; font-size: 1.1em; }
      `}</style>
    </div>
  );
}
