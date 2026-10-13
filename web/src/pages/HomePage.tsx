import { motion, useReducedMotion } from "framer-motion";
import { HeroMotion } from "../components/HeroMotion";
import { ScrollTimeline } from "../components/ScrollTimeline";
import { ContactBand, Shell, SiteFooter } from "../components/SiteChrome";
import { spring } from "../motion";

const photos = [
  {
    src: "/assets/IMG-20261013-WA0032.webp",
    alt: "Dhanush P. Soorya standing outdoors in a red shirt.",
    className: "photo-stand",
  },
  {
    src: "/assets/IMG-20260729-WA0059.webp",
    alt: "Dhanush P. Soorya in front of a dark wall with sculpted wings.",
    className: "photo-wings",
  },
  {
    src: "/assets/IMG-20240813-WA0019.webp",
    alt: "Dhanush P. Soorya in profile against a hilly landscape.",
    className: "photo-hill",
  },
];

export function HomePage() {
  const reduce = useReducedMotion();
  return (
    <Shell page="profile">
      <main id="top">
        <HeroMotion />
        <section className="film" aria-label="Photographs">
          {photos.map((photo, index) => (
            <motion.figure
              key={photo.src}
              initial={reduce ? false : { opacity: 0, y: 56 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...spring, delay: reduce ? 0 : index * 0.12 }}
            >
              <img className={photo.className} src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
            </motion.figure>
          ))}
        </section>
        <section id="facts" className="intro">
          <h2>Study <em>as a starting point.</em></h2>
          <div className="fact-columns">
            <div>
              <p className="label">Record</p>
              <ul>
                <li>Smart India Hackathon, participant</li>
                <li>
                  <a href="https://coursera.org/verify/CKYER2RU6302" target="_blank" rel="noopener noreferrer">Google AI Essentials</a>, Coursera, January 2025
                </li>
                <li>Postman API Fundamentals Student Expert</li>
                <li>Forage virtual experience</li>
              </ul>
              <p className="minor">Class XII, State Board, 88.6%. Class X, CBSE, 81%.</p>
            </div>
            <div>
              <p className="label">Tools</p>
              <p>Python, C, Java, HTML, CSS, JavaScript, Flask, Streamlit, SQL, MySQL, Pandas, pdfplumber, NumPy, Matplotlib, Seaborn, Git, Linux, Postman, data structures.</p>
            </div>
          </div>
          <motion.figure
            className="certificate"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={spring}
          >
            <a href="https://coursera.org/verify/CKYER2RU6302" target="_blank" rel="noopener noreferrer">
              <img src="/assets/google-ai-essentials.webp" alt="Coursera certificate: Dhanush P Soorya completed Google AI Essentials on January 18, 2025." loading="lazy" decoding="async" />
            </a>
            <figcaption>
              Google AI Essentials · 18 January 2025 · <a href="https://coursera.org/verify/CKYER2RU6302" target="_blank" rel="noopener noreferrer">Verify</a>
            </figcaption>
          </motion.figure>
        </section>
        <ScrollTimeline
          title={<>I build. <em>Then I show it.</em></>}
          items={[
            { label: "01", text: "Clean the data before a chart or an export." },
            { label: "02", text: "Build the working piece: a Python tool, a Flask page, or a REST API." },
            { label: "03", text: "Leave something a person can read, submit, or download." },
          ]}
        />
        <ContactBand />
      </main>
      <SiteFooter line="The work is on the page." action={{ href: "/projects", label: "Projects" }} />
    </Shell>
  );
}
