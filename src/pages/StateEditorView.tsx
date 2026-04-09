import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import type { Dataclass, StateAttribute, AttributeType } from "../types";

const ATTRIBUTE_TYPES: AttributeType[] = ["str", "int", "float", "bool", "list[str]", "list[int]"];

function createAttribute(): StateAttribute {
  return {
    id: `attr-${Date.now()}`,
    name: "new_attribute",
    type: "str",
    description: "",
    defaultValue: ""
  };
}

function createDataclass(): Dataclass {
  return {
    id: `dc-${Date.now()}`,
    name: "NewClass",
    attributes: []
  };
}

interface DataclassEditorProps {
  dataclass: Dataclass;
  onUpdate: (dc: Dataclass) => void;
  onDelete?: () => void;
  label: string;
}

function DataclassEditor({ dataclass, onUpdate, onDelete, label }: DataclassEditorProps) {
  const handleAddAttr = () => {
    onUpdate({ ...dataclass, attributes: [...dataclass.attributes, createAttribute()] });
  };

  const handleUpdateAttr = (attr: StateAttribute) => {
    onUpdate({
      ...dataclass,
      attributes: dataclass.attributes.map(a => a.id === attr.id ? attr : a)
    });
  };

  const handleDeleteAttr = (attrId: string) => {
    onUpdate({
      ...dataclass,
      attributes: dataclass.attributes.filter(a => a.id !== attrId)
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">{label}</h6>
          {onDelete !== undefined && (
            <button className="btn btn-outline-danger btn-sm" onClick={onDelete}>Delete</button>
          )}
        </div>
        <div className="mb-2">
          <label className="form-label small">Class Name</label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={dataclass.name}
            onChange={e => onUpdate({ ...dataclass, name: e.target.value })}
          />
        </div>
        <div className="mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <label className="form-label small mb-0">Attributes</label>
            <button className="btn btn-outline-primary btn-sm" onClick={handleAddAttr}>+ Add</button>
          </div>
        </div>
        {dataclass.attributes.map(attr => (
          <div key={attr.id} className="border rounded p-2 mb-2">
            <div className="row g-2">
              <div className="col-4">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="name"
                  value={attr.name}
                  onChange={e => handleUpdateAttr({ ...attr, name: e.target.value })}
                />
              </div>
              <div className="col-4">
                <select
                  className="form-select form-select-sm"
                  value={attr.type}
                  onChange={e => handleUpdateAttr({ ...attr, type: e.target.value as AttributeType })}
                >
                  {ATTRIBUTE_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="col-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="default"
                  value={attr.defaultValue}
                  onChange={e => handleUpdateAttr({ ...attr, defaultValue: e.target.value })}
                />
              </div>
              <div className="col-1">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDeleteAttr(attr.id)}
                >×</button>
              </div>
            </div>
            <div className="mt-1">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="description"
                value={attr.description}
                onChange={e => handleUpdateAttr({ ...attr, description: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StateEditorView() {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, updateStateModel } = useProjectStore();
  const [saved, setSaved] = useState(false);

  const project = projects.find(p => p.id === projectId);

  if (project === undefined || projectId === undefined) {
    return (
      <div className="container py-4">
        <p>Project not found. <Link to="/">Back to Dashboard</Link></p>
      </div>
    );
  }

  const { stateModel } = project;

  const handleUpdatePrimary = (dc: Dataclass) => {
    updateStateModel(projectId, { ...stateModel, primaryState: dc });
    setSaved(false);
  };

  const handleUpdateSecondary = (dc: Dataclass) => {
    updateStateModel(projectId, {
      ...stateModel,
      secondaryDataclasses: stateModel.secondaryDataclasses.map(d => d.id === dc.id ? dc : d)
    });
    setSaved(false);
  };

  const handleDeleteSecondary = (dcId: string) => {
    updateStateModel(projectId, {
      ...stateModel,
      secondaryDataclasses: stateModel.secondaryDataclasses.filter(d => d.id !== dcId)
    });
  };

  const handleAddDataclass = () => {
    updateStateModel(projectId, {
      ...stateModel,
      secondaryDataclasses: [...stateModel.secondaryDataclasses, createDataclass()]
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-4 gap-2">
        <Link to={`/project/${project.id}`} className="btn btn-outline-secondary btn-sm">
          ← {project.name}
        </Link>
        <h4 className="mb-0">State Model Editor</h4>
        <button className="btn btn-primary btn-sm ms-auto" onClick={handleSave}>
          {saved ? "Saved!" : "Save"}
        </button>
      </div>

      <h6>Primary State Class</h6>
      <DataclassEditor
        dataclass={stateModel.primaryState}
        onUpdate={handleUpdatePrimary}
        label="State (Primary)"
      />

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">Secondary Dataclasses</h6>
        <button className="btn btn-outline-primary btn-sm" onClick={handleAddDataclass}>
          + Add Dataclass
        </button>
      </div>

      {stateModel.secondaryDataclasses.length === 0 ? (
        <p className="text-muted small">No secondary dataclasses defined.</p>
      ) : (
        stateModel.secondaryDataclasses.map(dc => (
          <DataclassEditor
            key={dc.id}
            dataclass={dc}
            onUpdate={handleUpdateSecondary}
            onDelete={() => handleDeleteSecondary(dc.id)}
            label={dc.name}
          />
        ))
      )}
    </div>
  );
}
