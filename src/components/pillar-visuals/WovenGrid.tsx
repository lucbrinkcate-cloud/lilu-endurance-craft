export function WovenGrid() {
  const warp = Array.from({ length: 14 });
  const weft = Array.from({ length: 10 });
  return (
    <svg
      viewBox="0 0 400 280"
      className="w-full h-auto"
      fill="none"
      aria-hidden
    >
      {/* Warp (vertical) — draws top to bottom */}
      <g className="text-mist/60" stroke="currentColor" strokeWidth="1">
        {warp.map((_, i) => (
          <line
            key={`warp-${i}`}
            className="draw-vert"
            style={{ animationDelay: `${i * 0.05}s` }}
            x1={40 + i * 25}
            y1={40}
            x2={40 + i * 25}
            y2={240}
          />
        ))}
      </g>
      {/* Weft (horizontal) — draws left to right */}
      <g className="text-paper/80" stroke="currentColor" strokeWidth="1.2">
        {weft.map((_, i) => (
          <line
            key={`weft-${i}`}
            className="draw-line"
            style={{ animationDelay: `${0.7 + i * 0.06}s` }}
            x1={40}
            y1={40 + i * 22}
            x2={365}
            y2={40 + i * 22}
          />
        ))}
      </g>
      {/* Tension pulse rectangle */}
      <rect
        x="40"
        y="40"
        width="325"
        height="200"
        className="text-sage tension-pulse"
        style={{ animationDelay: "1.8s" }}
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <text
        x="40"
        y="266"
        className="font-mono fade-in-late text-mist/60"
        style={{ animationDelay: "1.6s" }}
        fontSize="9"
        fill="currentColor"
      >
        WARP × WEFT · 142 g/m² · ITALY
      </text>
    </svg>
  );
}
