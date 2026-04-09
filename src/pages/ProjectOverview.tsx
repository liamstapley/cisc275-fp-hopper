import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import { generatePythonCode } from "../utils/codeGen";

export function ProjectOverview() {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, updateProject, setCurrentProject } = useProjectStore();

  const project = projects.find(p => p.id === projectId);

  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    if (projectId !== undefined) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);

  useEffect(() => {
    if (project !== undefined) {
      setName(project.name);
      setDescription(project.description);
    }
  }, [project]);

  if (project === undefined) {
    return (
      <div className="container py-4">
        <p>Project not found. <Link to="/">Back to Dashboard</Link></p>
      </div>
    );
  }

  const handleSave = () => {
    updateProject({ ...project, name, description, updatedAt: new Date().toISOString() });
  };

  const pythonCode = generatePythonCode(project);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-4 gap-2">
        <Link to="/" className="btn btn-outline-secondary btn-sm">← Dashboard</Link>
        <h2 className="mb-0">{project.name}</h2>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Project Details</h5>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Page Graph</h5>
              <p className="card-text text-muted">Visual overview of pages and routes</p>
              <Link
                to={`/project/${project.id}/graph`}
                className="btn btn-outline-primary mt-auto"
              >
                Open Graph Editor
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">State Model</h5>
              <p className="card-text text-muted">Define your application state</p>
              <Link
                to={`/project/${project.id}/state`}
                className="btn btn-outline-primary mt-auto"
              >
                Edit State Model
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Pages</h5>
              <p className="card-text text-muted">{Object.keys(project.pages).length} pages defined</p>
              <Link
                to={`/project/${project.id}/graph`}
                className="btn btn-outline-primary mt-auto"
              >
                Manage Pages
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Generated Python Code</h5>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setShowCode(v => !v)}
          >
            {showCode ? "Hide" : "Show"}
          </button>
        </div>
        {showCode && (
          <div className="card-body">
            <pre className="bg-light p-3 rounded" style={{ maxHeight: "400px", overflow: "auto" }}>
              <code>{pythonCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
