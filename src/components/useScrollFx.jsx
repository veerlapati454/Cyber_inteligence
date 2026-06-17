import { useEffect, useRef, useState } from "react";

export function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

export function useCountUp(end, visible, duration = 1400) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    let frame;

    function step(timestamp) {
      if (!startRef.current) startRef.current = timestamp;

      const progress = Math.min(
        (timestamp - startRef.current) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(eased * end);

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    }

    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [visible, end, duration]);

  return value;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}) {
  const [ref, visible] = useReveal();
  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export function StatCard({
  value,
  suffix = "",
  label,
  delay = 0,
}) {
  const [ref, visible] = useReveal(0.4);
  const count = useCountUp(value, visible);

  return (
    <div
      ref={ref}
      className={`stat-card reveal ${
        visible ? "reveal-visible" : ""
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h2>
        {Number.isInteger(value)
          ? Math.floor(count).toLocaleString()
          : count.toFixed(1)}
        {suffix}
      </h2>
      <p>{label}</p>
    </div>
  );
}

export function DecodeText({ text, startDelay = 0 }) {
  const [display, setDisplay] = useState(text.replace(/[^\s]/g, " "));
  const glyphs = "!<>-_\\/[]{}—=+*^?#0123456789";

  useEffect(() => {
    let frame = 0;
    let raf;
    const totalFrames = 28;
    const timer = setTimeout(() => {
      function tick() {
        frame++;
        const progress = frame / totalFrames;
        const revealCount = Math.floor(progress * text.length);

        const next = text
          .split("")
          .map((char, i) => {
            if (char === " " || char === "\n") return char;
            if (i < revealCount) return char;
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join("");

        setDisplay(next);

        if (frame < totalFrames) {
          raf = requestAnimationFrame(() => setTimeout(tick, 28));
        } else {
          setDisplay(text);
        }
      }
      tick();
    }, startDelay);

    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{display}</>;
}