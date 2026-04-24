export function ContourMap() {
  return (
    <svg
      viewBox="0 0 400 280"
      className="w-full h-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
    >
      {/* Topographic contour lines */}
      <g className="text-mist/50">
        <path className="draw-line" style={{ animationDelay: "0.0s" }} d="M0,220 Q100,200 200,210 T400,200" />
        <path className="draw-line" style={{ animationDelay: "0.15s" }} d="M0,190 Q120,160 220,180 T400,170" />
        <path className="draw-line" style={{ animationDelay: "0.30s" }} d="M0,160 Q140,120 240,150 T400,140" />
        <path className="draw-line" style={{ animationDelay: "0.45s" }} d="M0,130 Q160,90 260,120 T400,110" />
        <path className="draw-line" style={{ animationDelay: "0.60s" }} d="M0,100 Q180,70 280,90 T400,80" />
        <path className="draw-line" style={{ animationDelay: "0.75s" }} d="M0,70 Q200,50 300,60 T400,50" />
      </g>
      {/* Bike trace path */}
      <path
        className="draw-line text-sage"
        style={{ animationDelay: "1s", animationDuration: "2.4s" }}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        d="M0,160 Q140,120 240,150 T400,140"
      />
      {/* Bike silhouette */}
      <g className="text-sage fade-in-late" style={{ animationDelay: "2.8s" }}>
        <circle cx="380" cy="142" r="4" fill="currentColor" />
        <circle cx="392" cy="142" r="4" fill="currentColor" />
        <path d="M380,142 L386,134 L392,142" stroke="currentColor" strokeWidth="1.2" />
      </g>
      {/* Coordinate label */}
      <text
        x="8"
        y="266"
        className="font-mono fade-in-late text-mist/60"
        style={{ animationDelay: "1.6s" }}
        fontSize="9"
        fill="currentColor"
        stroke="none"
      >
        46.8°N · 9.5°E · 1840m
      </text>
    </svg>
  );
}
