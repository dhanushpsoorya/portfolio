import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { spring } from "../motion";

export type TimelineItem = {
  label: string;
  text: string;
};

/**
 * The connector is an SVG line. strokeDashoffset runs from 1 to 0 with scroll progress.
 * pathLength is fixed at 1 so the dash units match the line, and no box size is animated.
 */
export function ScrollTimeline({
  title,
  items,
}: {
  title: ReactNode;
  items: TimelineItem[];
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 40%"],
  });
  const dashOffset = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section id="method" className="intro">
      <h2>{title}</h2>
      <div ref={ref} className="relative mt-8 max-w-xl pl-8">
        <svg
          className="pointer-events-none absolute top-2 bottom-2 left-0 h-[calc(100%-1rem)] w-2 text-[#d4c6b9]"
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="1" y1="0" x2="1" y2="100" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <motion.line
            x1="1"
            y1="0"
            x2="1"
            y2="100"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            style={reduce ? { strokeDashoffset: 0, strokeDasharray: 1 } : { strokeDasharray: 1, strokeDashoffset: dashOffset }}
          />
        </svg>
        <ol className="m-0 grid list-none gap-5 p-0">
          {items.map((item) => (
            <motion.li
              key={item.label}
              className="text-xl"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={spring}
            >
              <span className="mr-3 inline-block min-w-8 text-[#7a8b69]">{item.label}</span>
              {item.text}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
