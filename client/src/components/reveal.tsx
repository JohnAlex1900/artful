// src/components/reveal.tsx
import { useEffect, useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  noTranslate?: boolean; // fade-only when true (use for absolute-positioned children)
  displayContents?: boolean; // optional: set display: contents on wrapper
  once?: boolean; // only animate once when true
}

export default function Reveal({
  children,
  delay = 0,
  className = "",
  noTranslate = false,
  displayContents = false,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
          setVisible(true);
          if (once) obs.unobserve(el);
        }
      },
      { threshold: 0.18 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  const variants = noTranslate
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.6, ease: "easeOut", delay },
        },
      }
    : {
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeOut", delay },
        },
      };

  const style = displayContents ? { display: "contents" } : undefined;

  return (
    <motion.div
      ref={ref as any}
      className={className}
      style={style}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
