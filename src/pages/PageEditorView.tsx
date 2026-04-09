import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import { ComponentEditor } from "../components/ComponentEditor";
import { ComponentPreview } from "../components/ComponentPreview";
import type { UIComponent, UIComponentType } from "../types";

function createComponent(type: UIComponentType): UIComponent {
  const propKey = type === "header" || type === "text" || type === "button" ? "text" :
    type === "textbox" || type === "textarea" ? "placeholder" : "label";
  return {
    id: `comp-${Date.now()}`,
    type,
    props: { [propKey]: "" },
    style: {}
  };
}

export function PageEditorView() {
  const { projectId, pageId } = useParams<{ projectId: string; pageId: string }>();
  const { projects, updatePage, addComponent, updateComponent, deleteComponent } = useProjectStore();

  const project = projects.find(p => p.id === projectId);
  const page = projectId !== undefined && pageId !== undefined && project !== undefined
    ? project.pages[pageId]
    : undefined;

  const [pageName, setPageName] = useState(page?.name ?? "");
  const [pageDescription, setPageDescription] = useState(page?.description ?? "");
  const [nameSaved, setNameSaved] = useState(false);

  if (project === undefined || page === undefined || projectId === undefined || pageId === undefined) {
    return (
      <div className="container py-4">
        <p>Page not found. <Link to="/">Back to Dashboard</Link></p>
      </div>
    );
  }

  const handleSaveName = () => {
    updatePage(projectId, { ...page, name: pageName, description: pageDescription });
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleAddComponent = () => {
    addComponent(projectId, pageId, createComponent("text"));
  };

  const handleUpdateComponent = (component: UIComponent) => {
    updateComponent(projectId, pageId, component);
  };

  const handleDeleteComponent = (componentId: string) => {
    deleteComponent(projectId, pageId, componentId);
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex align-items-center mb-3 gap-2">
        <Link to={`/project/${project.id}/graph`} className="btn btn-outline-secondary btn-sm">
          ← Graph
        </Link>
        <h4 className="mb-0">Page Editor: {page.name}</h4>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h6>Page Settings</h6>
              <div className="mb-2">
                <label className="form-label small">Function Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={pageName}
                  onChange={e => setPageName(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label className="form-label small">Description</label>
                <textarea
                  className="form-control form-control-sm"
                  rows={2}
                  value={pageDescription}
                  onChange={e => setPageDescription(e.target.value)}
                />
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleSaveName}>
                {nameSaved ? "Saved!" : "Save"}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Components</h6>
                <button className="btn btn-primary btn-sm" onClick={handleAddComponent}>
                  + Add
                </button>
              </div>
              {page.components.length === 0 ? (
                <p className="text-muted small">No components yet.</p>
              ) : (
                page.components.map(component => (
                  <ComponentEditor
                    key={component.id}
                    component={component}
                    onUpdate={handleUpdateComponent}
                    onDelete={handleDeleteComponent}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Preview</h6>
            </div>
            <div className="card-body">
              {page.components.length === 0 ? (
                <p className="text-muted">Add components to see a preview.</p>
              ) : (
                <div className="border rounded p-3 bg-white">
                  {page.components.map(component => (
                    <div key={component.id} className="mb-2">
                      <ComponentPreview component={component} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
