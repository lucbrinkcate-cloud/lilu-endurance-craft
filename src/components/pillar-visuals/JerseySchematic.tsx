export function JerseySchematic() {
  return (
    <svg
      viewBox="0 0 400 280"
      className="w-full h-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
    >
      {/* Jersey pattern outline */}
      <g className="text-paper/80">
        <path
          className="draw-line"
          style={{ animationDelay: "0s", animationDuration: "1.8s" }}
          d="M140,60 L120,80 L100,90 L110,140 L120,160 L120,240 L200,240 L280,240 L280,160 L290,140 L300,90 L280,80 L260,60 L240,75 Q200,90 160,75 Z"
        />
        {/* Neck */}
        <path
          className="draw-line"
          style={{ animationDelay: "0.4s" }}
          d="M170,60 Q200,75 230,60"
        />
        {/* Center seam */}
        <line
          className="draw-vert"
          style={{ animationDelay: "0.7s" }}
          x1="200"
          y1="75"
          x2="200"
          y2="240"
          strokeDasharray="2 3"
        />
      </g>

      {/* Measurement annotations */}
      <g className="text-sage" stroke="currentColor" strokeWidth="0.8">
        {/* Sleeve callout */}
        <line className="draw-line" style={{ animationDelay: "1.2s" }} x1="100" y1="115" x2="50" y2="115" />
        <text x="6" y="113" fontSize="8" className="font-mono fade-in-late" style={{ animationDelay: "1.5s" }} fill="currentColor" stroke="none">
          SLEEVE +12mm
        </text>
        {/* Back drop callout */}
        <line className="draw-line" style={{ animationDelay: "1.5s" }} x1="280" y1="200" x2="350" y2="200" />
        <text x="290" y="197" fontSize="8" className="font-mono fade-in-late" style={{ animationDelay: "1.8s" }} fill="currentColor" stroke="none">
          BACK DROP +3cm
        </text>
        {/* Chest callout */}
        <line className="draw-line" style={{ animationDelay: "1.8s" }} x1="280" y1="120" x2="350" y2="120" />
        <text x="290" y="117" fontSize="8" className="font-mono fade-in-late" style={{ animationDelay: "2.1s" }} fill="currentColor" stroke="none">
          CHEST 96cm
        </text>
        {/* Hem callout */}
        <line className="draw-line" style={{ animationDelay: "2.1s" }} x1="120" y1="240" x2="50" y2="240" />
        <text x="6" y="237" fontSize="8" className="font-mono fade-in-late" style={{ animationDelay: "2.4s" }} fill="currentColor" stroke="none">
          HEM −8mm
        </text>
      </g>

      <text
        x="6"
        y="266"
        className="font-mono fade-in-late text-mist/60"
        style={{ animationDelay: "2.6s" }}
        fontSize="9"
        fill="currentColor"
        stroke="none"
      >
        PATTERN 04.SS · DROPS POSITION
      </text>
    </svg>
  );
}
