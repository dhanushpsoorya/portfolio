import { useLayoutEffect, useRef, type MouseEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { rise, spring, stagger } from "../motion";

const pulse = {
  scale: [1, 1.06, 1],
  opacity: [0.55, 0.85, 0.55],
};

/**
 * Magnetic pull is capped at 6px and applied as translate only.
 * The spring (stiffness 100, damping 20) eases the control back when the pointer leaves.
 */
function MagneticLink({
  href,
  className,
  children,
  download,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  download?: string;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 100, damping: 20 });
  const sy = useSpring(y, { stiffness: 100, damping: 20 });
  const external = /^https?:\/\//i.test(href);

  function pull(event: MouseEvent<HTMLAnchorElement>) {
    if (reduce) return;
    const box = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (box.left + box.width / 2);
    const dy = event.clientY - (box.top + box.height / 2);
    x.set(Math.max(-6, Math.min(6, dx * 0.35)));
    y.set(Math.max(-6, Math.min(6, dy * 0.45)));
  }

  return (
    <motion.a
      href={href}
      download={download}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={reduce ? undefined : { x: sx, y: sy }}
      onMouseMove={pull}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.a>
  );
}

function Mesh({
  mx,
  my,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const background = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(212,198,185,0.22), rgba(122,139,105,0.08) 38%, transparent 70%)`;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{ background }}
      animate={reduce ? undefined : pulse}
      transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/** Staggered hero: headline, profile bio, and the project link. */
export function HeroMotion() {
  const reduce = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(280);
  const my = useMotionValue(420);
  const smx = useSpring(mx, { stiffness: 100, damping: 20 });
  const smy = useSpring(my, { stiffness: 100, damping: 20 });
  const photoLeft = useMotionValue(0);
  const drift = useMotionValue(0);
  // The blend starts just left of the photo and slides with the pointer. Translate only.
  const seamTarget = useTransform([photoLeft, drift], ([left, shift]) => Number(left) - 180 + Number(shift));
  const seam = useSpring(seamTarget, { stiffness: 80, damping: 24 });
  const seamOpacity = useTransform(photoLeft, (left) => (left > 48 ? 1 : 0));

  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const fitted = Math.min(box.width, box.height * (3120 / 4160));
      photoLeft.set(Math.max(0, box.width - fitted));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [photoLeft]);

  function track(event: MouseEvent<HTMLDivElement>) {
    if (!frame.current) return;
    const box = frame.current.getBoundingClientRect();
    const localX = event.clientX - box.left;
    mx.set(localX);
    my.set(event.clientY - box.top);
    if (!reduce) drift.set(((localX / box.width) - 0.5) * 18);
  }

  const variants = reduce ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : rise;
  const group = reduce ? { hidden: {}, show: {} } : stagger;

  return (
    <>
      <section className="hero" aria-label="Opening">
        <div
          ref={frame}
          className="frame hero-frame"
          onMouseMove={track}
          onMouseLeave={() => drift.set(0)}
        >
          <img
            className="fill photo-look"
            src="/assets/IMG-20240813-WA0036-1600.webp"
            srcSet="/assets/IMG-20240813-WA0036-800.webp 800w, /assets/IMG-20240813-WA0036-1600.webp 1600w"
            sizes="(max-width: 800px) 100vw, 55vw"
            alt="Dhanush P. Soorya looking out over trees and water."
            width={1600}
            height={2133}
            fetchPriority="high"
            decoding="async"
          />
          <div className="shade" />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-[1] h-full w-[260px]"
            style={{
              x: seam,
              opacity: seamOpacity,
              background:
                "linear-gradient(90deg, #121616 0%, #121616 58%, rgba(18,22,22,0.28) 78%, transparent 100%)",
            }}
          />
          <Mesh mx={smx} my={smy} />
          <div className="hero-title">
            <motion.h1 initial="hidden" animate="show" variants={group}>
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span className="block" variants={variants}>
                  I look.
                </motion.span>
              </span>
              <em className="block overflow-hidden pb-[0.06em]">
                <motion.span className="block" variants={variants}>
                  And look again.
                </motion.span>
              </em>
            </motion.h1>
          </div>
          <a className="scroll-cue" href="#profile">
            Scroll down
          </a>
        </div>
      </section>

      <section id="profile" className="profile">
        <motion.figure
          className="portrait-card"
          initial={reduce ? false : { opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={spring}
        >
          <img
            src="/assets/IMG-20240813-WA0020.webp"
            alt="Dhanush P. Soorya outdoors, wearing a cap and jacket."
            width={960}
            height={1280}
            loading="lazy"
            decoding="async"
          />
        </motion.figure>
        <motion.div
          className="profile-copy"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={group}
        >
          <motion.p className="kicker" variants={variants}>
            Software engineering · Bengaluru
          </motion.p>
          <motion.h2 variants={variants}>Dhanush P. Soorya</motion.h2>
          <motion.p className="role-line" variants={variants}>
            B.Tech, Computer Science and Engineering
            <br />
            Amity University, Bengaluru · Expected 2027
          </motion.p>
          <motion.p className="cgpa" variants={variants}>
            CGPA 7.65 / 10
          </motion.p>
          <motion.p variants={variants}>
            I use Python to clean data, reshape it, and turn it into charts. The same care shows up in small tools: a resume builder, a hospital booking site, and a PDF to Excel converter.
          </motion.p>
          <motion.p variants={variants}>
            At Code Alpha I was a backend developer intern. I designed server-side logic and RESTful APIs for web applications, integrated databases, and worked on back-end performance.
          </motion.p>
          <motion.p variants={variants}>
            <MagneticLink className="text-link" href="/projects">
              See the four projects
            </MagneticLink>
          </motion.p>
        </motion.div>
      </section>
    </>
  );
}

export { MagneticLink };
