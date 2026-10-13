import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";

export function App() {
  const projects = window.location.pathname.includes("projects");
  return projects ? <ProjectsPage /> : <HomePage />;
}
