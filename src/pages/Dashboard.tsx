import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import { demoProjects } from "../utils/demoProjects";
import type { Project } from "../types";

function createNewProject(): Project {
  const id = `project-${Date.now()}`;
  return {
    id,
    name: "New Project",
    description: "A new Drafter project",
    pages: {},
    routes: {},
    stateModel: {
      primaryState: {
        id: `state-${Date.now()}`,
        name: "State",
        attributes: []
      },
      secondaryDataclasses: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function Dashboard() {
  const { projects, addProject, deleteProject, loadFromStorage, setCurrentProject } = useProjectStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const handleNewProject = () => {
    const project = createNewProject();
    addProject(project);
    setCurrentProject(project.id);
    void navigate(`/project/${project.id}`);
  };

  const handleOpenProject = (projectId: string) => {
    setCurrentProject(projectId);
    void navigate(`/project/${projectId}`);
  };

  const handleDeleteProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    deleteProject(projectId);
  };

  const handleLoadDemo = (demo: Project) => {
    const existing = projects.find(p => p.id === demo.id);
    if (existing === undefined) {
      addProject(demo);
    }
    setCurrentProject(demo.id);
    void navigate(`/project/${demo.id}`);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Drafter Drafter</h1>
        <button className="btn btn-primary" onClick={handleNewProject}>
          + New Project
        </button>
      </div>

      <div className="row mb-4">
        <div className="col">
          <h5>Demo Projects</h5>
          <div className="d-flex gap-2">
            {demoProjects.map(demo => (
              <button
                key={demo.id}
                className="btn btn-outline-secondary"
                onClick={() => handleLoadDemo(demo)}
              >
                Load: {demo.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <h4>Your Projects</h4>
      {projects.length === 0 ? (
        <p className="text-muted">No projects yet. Create a new project or load a demo.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-3">
          {projects.map(project => (
            <div key={project.id} className="col">
              <div
                className="card h-100 cursor-pointer"
                style={{ cursor: "pointer" }}
                onClick={() => handleOpenProject(project.id)}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title">{project.name}</h5>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={e => handleDeleteProject(e, project.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <p className="card-text text-muted small">{project.description}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      {Object.keys(project.pages).length} pages · {Object.keys(project.routes).length} routes
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
