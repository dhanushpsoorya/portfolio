import type { Transition } from "framer-motion";

/** Shared spring. Stiffness 100 with damping 20 settles quickly without bounce. */
export const spring: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

/** Opacity plus translateY only, so the reveal never changes layout. */
export const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: spring },
};
