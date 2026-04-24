import { useEffect, useRef, useState, type ReactNode } from "react";

export function AnimatedPillar({
  children,
  className = "",
  threshold = 0.3,
  onActivate,
}: {
  children: ReactNode;
  className?: string;
  threshold?: number;
  onActivate?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            onActivate?.();
            obs.disconnect();
          }
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, onActivate]);

  return (
    <div ref={ref} className={`${active ? "in-view" : ""} ${className}`}>
      {children}
    </div>
  );
}
