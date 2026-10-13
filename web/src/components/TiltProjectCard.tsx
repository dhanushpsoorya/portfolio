import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { spring } from "../motion";

export type ProjectCard = {
  id: string;
  num: string;
  title: string;
  tags: string[];
  summary: string;
  points: string[];
  image: string;
  alt: string;
  href?: string;
  flip?: boolean;
};

/**
 * Tilt is rotateX/rotateY on the card, perspective 1000px on the wrapper.
 * The glare is a radial gradient positioned with the pointer, not a moving layout box.
 */
export function TiltProjectCard(project: ProjectCard) {
  const reduce = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const sx = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const sy = useSpring(rotateY, { stiffness: 100, damping: 20 });
  const glare = useRef<HTMLSpanElement>(null);

  function onMove(event: MouseEvent<HTMLElement>) {
    if (reduce) return;
    const box = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    rotateY.set((px - 0.5) * 8);
    rotateX.set((0.5 - py) * 6);
    if (glare.current) {
      glare.current.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      glare.current.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    }
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      className="[perspective:1000px]"
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring}
    >
      <motion.article
        id={project.id}
        className={project.flip ? "project flip" : "project"}
        style={reduce ? undefined : { rotateX: sx, rotateY: sy }}
        onMouseMove={onMove}
        onMouseLeave={reset}
        initial="rest"
        whileHover={reduce ? undefined : "hover"}
      >
        <figure>
          <img src={project.image} alt={project.alt} loading="lazy" decoding="async" />
          <span ref={glare} className="glare" aria-hidden="true" />
        </figure>
        <div>
          <p className="num">{project.num}</p>
          <h2>{project.title}</h2>
          <ul className="pills">
            {project.tags.map((tag, index) => (
              <motion.li
                key={tag}
                variants={{
                  rest: { opacity: reduce ? 1 : 0.65, y: reduce ? 0 : 8 },
                  hover: {
                    opacity: 1,
                    y: 0,
                    transition: { ...spring, delay: index * 0.04 },
                  },
                }}
              >
                {tag}
              </motion.li>
            ))}
          </ul>
          <p>{project.summary}</p>
          <ul className="detail">
            {project.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {project.href ? (
            <p>
              <a
                className="text-link"
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </p>
          ) : null}
        </div>
      </motion.article>
    </motion.div>
  );
}
