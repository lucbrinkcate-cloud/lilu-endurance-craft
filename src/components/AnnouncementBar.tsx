const MESSAGES = [
  "Free EU shipping over €150 · Worldwide delivery",
  "60-day returns · Lifetime crash repair on every kit",
  "Field notes from the road, dropped weekly",
];

export function AnnouncementBar() {
  return (
    <div className="bg-forest text-paper border-b border-paper/10 overflow-hidden">
      <div className="flex animate-[ticker_28s_linear_infinite] whitespace-nowrap py-2.5 font-mono text-[10px] uppercase tracking-[0.28em]">
        {[...MESSAGES, ...MESSAGES, ...MESSAGES].map((m, i) => (
          <span key={i} className="px-8 shrink-0 inline-flex items-center gap-3">
            <span className="text-sage">●</span>
            {m}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
