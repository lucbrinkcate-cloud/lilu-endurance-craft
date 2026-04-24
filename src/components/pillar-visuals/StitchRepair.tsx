export function StitchRepair() {
  return (
    <svg
      viewBox="0 0 400 280"
      className="w-full h-auto"
      fill="none"
      aria-hidden
    >
      {/* Left fabric half */}
      <g className="text-mist/50 mend-left">
        <path
          stroke="currentColor"
          strokeWidth="1"
          fill="oklch(0.18 0.01 150 / 0.4)"
          d="M20,40 L180,40 L175,80 L185,120 L172,160 L182,200 L175,240 L20,240 Z"
        />
        {/* Torn edge detail */}
        <path
          stroke="currentColor"
          strokeWidth="0.8"
          d="M180,40 L175,55 L185,68 L172,82 L188,98 L175,115 L185,130 L172,148 L188,165 L175,182 L185,200 L172,218 L175,240"
        />
      </g>
      {/* Right fabric half */}
      <g className="text-mist/50 mend-right">
        <path
          stroke="currentColor"
          strokeWidth="1"
          fill="oklch(0.18 0.01 150 / 0.4)"
          d="M380,40 L220,40 L225,80 L215,120 L228,160 L218,200 L225,240 L380,240 Z"
        />
        <path
          stroke="currentColor"
          strokeWidth="0.8"
          d="M220,40 L225,55 L215,68 L228,82 L212,98 L225,115 L215,130 L228,148 L212,165 L225,182 L215,200 L228,218 L225,240"
        />
      </g>
      {/* Stitch line */}
      <line
        className="draw-line text-sage"
        style={{ animationDelay: "1.4s", animationDuration: "1.8s" }}
        x1="200"
        y1="50"
        x2="200"
        y2="230"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeDasharray="6 4"
      />
      {/* Stitch crosses */}
      <g className="text-sage fade-in-late" style={{ animationDelay: "3s" }} stroke="currentColor" strokeWidth="1">
        {[60, 90, 120, 150, 180, 210].map((y) => (
          <g key={y}>
            <line x1="194" y1={y - 4} x2="206" y2={y + 4} />
            <line x1="206" y1={y - 4} x2="194" y2={y + 4} />
          </g>
        ))}
      </g>
      <text
        x="20"
        y="266"
        className="font-mono fade-in-late text-mist/60"
        style={{ animationDelay: "3.2s" }}
        fontSize="9"
        fill="currentColor"
      >
        REPAIR LOG · GARMENT #00481 · MENDED
      </text>
    </svg>
  );
}
