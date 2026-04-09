import type { Project } from "../types";

const STORAGE_KEY = "drafter-drafter-projects";

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function loadProjects(): Project[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data === null) return [];
  return JSON.parse(data) as Project[];
}
