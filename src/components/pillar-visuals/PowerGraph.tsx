import { useEffect, useRef, useState } from "react";

export function PowerGraph({ active }: { active: boolean }) {
  const [watts, setWatts] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;
    const target = 287;
    const duration = 2200;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setWatts(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  // Power curve path (irregular, looks like real ride data)
  const path =
    "M20,180 L40,170 L60,150 L80,160 L100,120 L120,135 L140,90 L160,100 L180,75 L200,85 L220,60 L240,80 L260,55 L280,70 L300,45 L320,65 L340,50 L360,72 L380,60";

  return (
    <svg viewBox="0 0 400 280" className="w-full h-auto" fill="none" aria-hidden>
      {/* Grid */}
      <g className="text-paper/10" stroke="currentColor" strokeWidth="0.5">
        {[40, 80, 120, 160, 200].map((y) => (
          <line key={y} x1="20" y1={y} x2="380" y2={y} />
        ))}
        {[20, 100, 200, 300, 380].map((x) => (
          <line key={x} x1={x} y1="40" x2={x} y2="220" />
        ))}
      </g>

      {/* Y-axis labels */}
      <g className="font-mono text-mist/50" fontSize="8" fill="currentColor">
        <text x="2" y="44">300W</text>
        <text x="2" y="124">200W</text>
        <text x="2" y="204">100W</text>
      </g>

      {/* Power curve */}
      <path
        className="draw-line text-sage"
        style={{ animationDuration: "2.4s" }}
        d={path}
        stroke="currentColor"
        strokeWidth="1.6"
      />

      {/* Readout dot */}
      <circle
        cx="380"
        cy="60"
        r="4"
        className="text-sage fade-in-late"
        style={{ animationDelay: "2.4s" }}
        fill="currentColor"
      >
        <animate attributeName="r" values="4;6;4" dur="1.4s" repeatCount="indefinite" begin="2.4s" />
      </circle>

      {/* Live readout */}
      <g className="font-mono fade-in-late" style={{ animationDelay: "0.4s" }}>
        <text x="20" y="252" fontSize="9" fill="currentColor" className="text-mist/60">
          AVG POWER
        </text>
        <text x="20" y="272" fontSize="22" fill="currentColor" className="text-paper font-display">
          {watts}W
        </text>
        <text x="280" y="252" fontSize="9" fill="currentColor" className="text-mist/60">
          DISCOMFORT INDEX
        </text>
        <text x="280" y="272" fontSize="22" fill="currentColor" className="text-sage font-display">
          {Math.round((watts / 287) * 8.4 * 10) / 10}
        </text>
      </g>
    </svg>
  );
}
