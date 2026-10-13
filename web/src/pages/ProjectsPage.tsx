import { motion, useReducedMotion } from "framer-motion";
import { TiltProjectCard, type ProjectCard } from "../components/TiltProjectCard";
import { Shell, SiteFooter } from "../components/SiteChrome";
import { rise, stagger } from "../motion";

const projects: ProjectCard[] = [
  {
    id: "unemployment",
    num: "01",
    title: "Global unemployment trends",
    tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    summary: "A data study of a real-world unemployment dataset. I cleaned the records and transformed them from wide to long format with Pandas and NumPy.",
    points: [
      "Ran statistical summaries on the cleaned table.",
      "Made more than ten charts of patterns by country, gender, age group, and time.",
    ],
    image: "/images/unemployment-cover.png",
    alt: "Charts of unemployment over time, by gender, age group, and country.",
  },
  {
    id: "resume-builder",
    num: "02",
    title: "Resume builder",
    tags: ["Python", "File handling", "Graphical interface"],
    summary: "A desktop application that turns structured user input into a formatted resume.",
    points: [
      "Collected details through a simple graphical interface.",
      "Handled formatting and export with Python file handling.",
    ],
    image: "/images/resume-cover.png",
    alt: "Resume Builder window with a details form and a resume preview.",
    flip: true,
  },
  {
    id: "hospital",
    num: "03",
    title: "Hospital appointment booking",
    tags: ["Flask", "MySQL", "HTML"],
    summary: "A Flask site for a hospital: home, about, services, registration, login, and booking.",
    points: [
      "The appointment form takes a name, a doctor, and a date.",
      "Users and appointments are stored in MySQL.",
    ],
    image: "/images/hospital-cover.png",
    alt: "Our New Hospital page with navigation and the appointment form.",
    href: "https://github.com/dhanushpsoorya/hospital-booking-project",
  },
  {
    id: "pdf-excel",
    num: "04",
    title: "PDF to Excel converter",
    tags: ["Python", "pdfplumber", "Pandas", "Streamlit"],
    summary: "A web tool that extracts structured tables from PDF files and writes them to Excel.",
    points: [
      "Pandas fixes column alignment, removes duplicate rows, and formats numbers.",
      "Streamlit provides drag-and-drop upload and an immediate download.",
    ],
    image: "/images/pdf-cover.png",
    alt: "PDF to Excel screen with a file drop area, a cleaned table, and a download button.",
    flip: true,
  },
];

export function ProjectsPage() {
  const reduce = useReducedMotion();
  const variants = reduce ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : rise;
  return (
    <Shell page="projects">
      <main className="projects-page" id="list">
        <motion.header
          className="page-intro"
          initial="hidden"
          animate="show"
          variants={reduce ? { hidden: {}, show: {} } : stagger}
        >
          <motion.p className="kicker" variants={variants}>Selected work</motion.p>
          <motion.h1 variants={variants}>Four <em>separate</em> pieces.</motion.h1>
          <motion.p variants={variants}>Each one is a small tool with a clear result. The screens below are views of those tools.</motion.p>
        </motion.header>
        {projects.map((project) => (
          <TiltProjectCard key={project.id} {...project} />
        ))}
      </main>
      <SiteFooter line="Back to the profile." action={{ href: "/", label: "Profile" }} />
    </Shell>
  );
}
