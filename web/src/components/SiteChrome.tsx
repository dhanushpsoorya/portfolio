import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { MagneticLink } from "./HeroMotion";
import { spring } from "../motion";

const dockEase = [0.22, 1, 0.36, 1] as const;

function externalProps(href: string) {
  if (/^https?:\/\//i.test(href)) {
    return { target: "_blank" as const, rel: "noopener noreferrer" };
  }
  return {};
}

function DockLink({
  href,
  current,
  children,
}: {
  href: string;
  current?: boolean;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 100, damping: 20 });
  const sy = useSpring(y, { stiffness: 100, damping: 20 });

  function pull(event: MouseEvent<HTMLAnchorElement>) {
    if (reduce) return;
    const box = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (box.left + box.width / 2);
    const dy = event.clientY - (box.top + box.height / 2);
    x.set(Math.max(-4, Math.min(4, dx * 0.35)));
    y.set(Math.max(-4, Math.min(4, dy * 0.45)));
  }

  return (
    <motion.a
      href={href}
      aria-current={current ? "page" : undefined}
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

function ripple(event: MouseEvent<HTMLAnchorElement>) {
  const box = event.currentTarget.getBoundingClientRect();
  const dot = document.createElement("span");
  dot.className = "ripple";
  dot.style.left = `${event.clientX - box.left}px`;
  dot.style.top = `${event.clientY - box.top}px`;
  event.currentTarget.appendChild(dot);
  dot.addEventListener("animationend", () => dot.remove());
}

export function SiteNav({ page }: { page: "profile" | "projects" }) {
  const reduce = useReducedMotion();
  const [hot, setHot] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const links = [
    { href: "/", label: "Profile", current: page === "profile" },
    { href: "/projects", label: "Projects", current: page === "projects" },
    { href: page === "profile" ? "#facts" : "/#facts", label: "Facts" },
    { href: page === "profile" ? "#contact" : "/#contact", label: "Contact" },
  ];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function light(event: MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--gx", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--gy", `${event.clientY - box.top}px`);
    setHot(true);
  }

  return (
    <header className="nav">
      <div
        className={hot ? "navbar is-hot" : "navbar"}
        onMouseMove={light}
        onMouseLeave={() => setHot(false)}
      >
        <a className="wordmark" href="/">Dhanush</a>
        <nav aria-label="Primary">
          {links.map((link) => (
            <DockLink key={link.label} href={link.href} current={link.current}>
              {link.label}
            </DockLink>
          ))}
        </nav>
        <div
          ref={menuRef}
          className="resume-menu dock"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
          }}
        >
          <a
            className="pill"
            href="/resume"
            aria-haspopup="true"
            aria-expanded={open}
            onMouseEnter={reduce ? undefined : ripple}
            onClick={(event) => {
              if (!reduce) ripple(event);
              if (!open) {
                event.preventDefault();
                setOpen(true);
              }
            }}
          >
            Resume
            <svg className="caret" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <motion.div
            className="resume-pop"
            initial={false}
            animate={open ? "open" : "closed"}
            variants={{
              closed: { clipPath: "inset(0 0 100% 42% round 12px)", y: -8, opacity: 0 },
              open: { clipPath: "inset(0% round 12px)", y: 0, opacity: 1 },
            }}
            transition={reduce ? { duration: 0 } : { duration: 0.45, ease: dockEase }}
            style={{ pointerEvents: open ? "auto" : "none" }}
            aria-hidden={!open}
            {...(!open ? { inert: true } : {})}
          >
            {[
              { href: "/resume", label: "View" },
              { href: "/resume.pdf", label: "Download PDF", download: "Dhanush-P-Soorya-Resume.pdf" },
            ].map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                download={item.download}
                tabIndex={open ? 0 : -1}
                initial={false}
                animate={open ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.3, ease: "easeOut", delay: open ? 0.08 + index * 0.06 : 0 }
                }
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({
  line,
  action,
}: {
  line: string;
  action: { href: string; label: string };
}) {
  const reduce = useReducedMotion();
  return (
    <motion.footer
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring}
    >
      <div className="footer-top">
        <p className="footer-line">{line}</p>
        <a className="pill" href={action.href}>{action.label}</a>
      </div>
      <div className="footer-grid">
        <div>
          <p className="label">Pages</p>
          <a href="/">Profile</a>
          <a href="/projects">Projects</a>
          <a href="/resume">View resume</a>
          <MagneticLink href="/resume.pdf" download="Dhanush-P-Soorya-Resume.pdf">Download PDF</MagneticLink>
        </div>
        <div>
          <p className="label">Contact</p>
          <MagneticLink href="mailto:dhanush.soorya@s.amity.edu">dhanush.soorya@s.amity.edu</MagneticLink>
          <a href="tel:+919880124105">+91 9880124105</a>
          <a href="https://www.linkedin.com/in/dhanush-p-soorya-100808298/" {...externalProps("https://www.linkedin.com/in/dhanush-p-soorya-100808298/")}>LinkedIn</a>
          <a href="https://github.com/dhanushpsoorya" {...externalProps("https://github.com/dhanushpsoorya")}>GitHub</a>
        </div>
      </div>
    </motion.footer>
  );
}

export function ContactBand() {
  return (
    <section id="contact" className="cta">
      <div className="frame cta-frame">
        <div>
          <h2>Ready <em>to talk?</em></h2>
          <p>Send a note, or open the one-page resume.</p>
          <div className="contact-row">
            <MagneticLink className="pill" href="mailto:dhanush.soorya@s.amity.edu">Email</MagneticLink>
            <MagneticLink className="pill ghost" href="tel:+919880124105">+91 9880124105</MagneticLink>
            <MagneticLink className="pill ghost" href="https://www.linkedin.com/in/dhanush-p-soorya-100808298/">LinkedIn</MagneticLink>
            <MagneticLink className="pill ghost" href="https://github.com/dhanushpsoorya">GitHub</MagneticLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Shell({ page, children }: { page: "profile" | "projects"; children: ReactNode }) {
  return (
    <>
      <a className="skip" href={page === "profile" ? "#profile" : "#list"}>Skip to content</a>
      <SiteNav page={page} />
      {children}
    </>
  );
}
