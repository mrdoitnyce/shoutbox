import { useEffect, useRef, useState, type ReactNode } from "react";

/* Observe when an element enters the viewport */
export function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* Scroll-reveal wrapper */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* Scramble-decode text effect */
const GLYPHS = "█▓▒░<>/{}[]=+*#";

export function useScramble(text: string, startDelay = 150) {
  const [output, setOutput] = useState(text);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let frame = 0;
    let raf = 0;
    let started = false;
    const total = text.length;
    const t = window.setTimeout(() => {
      started = true;
      const tick = () => {
        frame++;
        const resolved = Math.floor(frame / 2.4);
        let out = "";
        for (let i = 0; i < total; i++) {
          const ch = text[i];
          if (ch === " " || ch === "\n") {
            out += ch;
          } else if (i < resolved) {
            out += ch;
          } else {
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
        setOutput(out);
        if (resolved < total) {
          raf = requestAnimationFrame(tick);
        } else {
          setOutput(text);
          setDone(true);
        }
      };
      raf = requestAnimationFrame(tick);
    }, startDelay);
    return () => {
      window.clearTimeout(t);
      if (started) cancelAnimationFrame(raf);
    };
  }, [text, startDelay]);

  return { output, done };
}

/* Animated counter */
export function useCountUp(target: number, inView: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return value;
}
