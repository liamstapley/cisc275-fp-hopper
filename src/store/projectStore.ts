import { create } from "zustand";
import type { Project, PageNode, Route, UIComponent, StateModel } from "../types";
import { saveProjects, loadProjects } from "../utils/storage";

interface ProjectStore {
  projects: Project[];
  currentProjectId: string | null;
  setCurrentProject: (id: string | null) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addPage: (projectId: string, page: PageNode) => void;
  updatePage: (projectId: string, page: PageNode) => void;
  deletePage: (projectId: string, pageId: string) => void;
  addRoute: (projectId: string, route: Route) => void;
  updateRoute: (projectId: string, route: Route) => void;
  deleteRoute: (projectId: string, routeId: string) => void;
  addComponent: (projectId: string, pageId: string, component: UIComponent) => void;
  updateComponent: (projectId: string, pageId: string, component: UIComponent) => void;
  deleteComponent: (projectId: string, pageId: string, componentId: string) => void;
  updateStateModel: (projectId: string, stateModel: StateModel) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

function updateProjectInList(projects: Project[], projectId: string, updater: (p: Project) => Project): Project[] {
  return projects.map(p => p.id === projectId ? updater(p) : p);
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: loadProjects(),
  currentProjectId: null,

  setCurrentProject: (id) => set({ currentProjectId: id }),

  addProject: (project) => {
    set(state => ({ projects: [...state.projects, project] }));
    get().saveToStorage();
  },

  updateProject: (project) => {
    set(state => ({
      projects: state.projects.map(p => p.id === project.id ? project : p)
    }));
    get().saveToStorage();
  },

  deleteProject: (projectId) => {
    set(state => ({
      projects: state.projects.filter(p => p.id !== projectId),
      currentProjectId: state.currentProjectId === projectId ? null : state.currentProjectId
    }));
    get().saveToStorage();
  },

  addPage: (projectId, page) => {
    set(state => ({
      projects: updateProjectInList(state.projects, projectId, p => ({
        ...p,
        pages: { ...p.pages, [page.id]: page },
        updatedAt: new Date().toISOString()
      }))
    }));
    get().saveToStorage();
  },

  updatePage: (projectId, page) => {
    set(state => ({
      projects: updateProjectInList(state.projects, projectId, p => ({
        ...p,
        pages: { ...p.pages, [page.id]: page },
        updatedAt: new Date().toISOString()
      }))
    }));
    get().saveToStorage();
  },

  deletePage: (projectId, pageId) => {
    set(state => ({
      projects: updateProjectInList(state.projects, projectId, p => {
        const newPages = { ...p.pages };
        delete newPages[pageId];
        return { ...p, pages: newPages, updatedAt: new Date().toISOString() };
      })
    }));
    get().saveToStorage();
  },

  addRoute: (projectId, route) => {
    set(state => ({
      projects: updateProjectInList(state.projects, projectId, p => ({
        ...p,
        routes: { ...p.routes, [route.id]: route },
        updatedAt: new Date().toISOString()
      }))
    }));
    get().saveToStorage();
  },

  updateRoute: (projectId, route) => {
    set(state => ({
      projects: updateProjectInList(state.projects, projectId, p => ({
        ...p,
        routes: { ...p.routes, [route.id]: route },
        updatedAt: new Date().toISOString()
      }))
    }));
    get().saveToStorage();
  },

  deleteRoute: (projectId, routeId) => {
    set(state => ({
      projects: updateProjectInList(state.projects, projectId, p => {
        const newRoutes = { ...p.routes };
        delete newRoutes[routeId];
        return { ...p, routes: newRoutes, updatedAt: new Date().toISOString() };
      })
    }));
    get().saveToStorage();
  },

  addComponent: (projectId, pageId, component) => {
    set(state => ({
      projects: updateProjectInList(state.projects, projectId, p => {
        const page = p.pages[pageId] as PageNode | undefined;
        if (page === undefined) return p;
        const updatedPage: PageNode = {
          ...page,
          components: [...page.components, component]
        };
        return { ...p, pages: { ...p.pages, [pageId]: updatedPage }, updatedAt: new Date().toISOString() };
      })
    }));
    get().saveToStorage();
  },

  updateComponent: (projectId, pageId, component) => {
    set(state => ({
      projects: updateProjectInList(state.projects, projectId, p => {
        const page = p.pages[pageId] as PageNode | undefined;
        if (page === undefined) return p;
        const updatedPage: PageNode = {
          ...page,
          components: page.components.map(c => c.id === component.id ? component : c)
        };
        return { ...p, pages: { ...p.pages, [pageId]: updatedPage }, updatedAt: new Date().toISOString() };
      })
    }));
    get().saveToStorage();
  },

  deleteComponent: (projectId, pageId, componentId) => {
    set(state => ({
      projects: updateProjectInList(state.projects, projectId, p => {
        const page = p.pages[pageId] as PageNode | undefined;
        if (page === undefined) return p;
        const updatedPage: PageNode = {
          ...page,
          components: page.components.filter(c => c.id !== componentId)
        };
        return { ...p, pages: { ...p.pages, [pageId]: updatedPage }, updatedAt: new Date().toISOString() };
      })
    }));
    get().saveToStorage();
  },

  updateStateModel: (projectId, stateModel) => {
    set(state => ({
      projects: updateProjectInList(state.projects, projectId, p => ({
        ...p,
        stateModel,
        updatedAt: new Date().toISOString()
      }))
    }));
    get().saveToStorage();
  },

  loadFromStorage: () => {
    const projects = loadProjects();
    set({ projects });
  },

  saveToStorage: () => {
    saveProjects(get().projects);
  }
}));
