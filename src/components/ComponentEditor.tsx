import { useState } from "react";
import type { UIComponent, UIComponentType } from "../types";

interface ComponentEditorProps {
  component: UIComponent;
  onUpdate: (component: UIComponent) => void;
  onDelete: (componentId: string) => void;
}

const COMPONENT_TYPES: UIComponentType[] = ["text", "textbox", "textarea", "checkbox", "select", "button", "header"];

function getPropKey(type: UIComponentType): string {
  switch (type) {
    case "header":
    case "text":
    case "button":
      return "text";
    case "textbox":
    case "textarea":
      return "placeholder";
    case "checkbox":
    case "select":
      return "label";
  }
}

export function ComponentEditor({ component, onUpdate, onDelete }: ComponentEditorProps) {
  const propKey = getPropKey(component.type);
  const [propValue, setPropValue] = useState<string>(String(component.props[propKey] ?? ""));

  const handleTypeChange = (newType: UIComponentType) => {
    const newPropKey = getPropKey(newType);
    onUpdate({
      ...component,
      type: newType,
      props: { [newPropKey]: propValue }
    });
  };

  const handlePropChange = (value: string) => {
    setPropValue(value);
    onUpdate({
      ...component,
      props: { ...component.props, [propKey]: value }
    });
  };

  return (
    <div className="card mb-2">
      <div className="card-body p-2">
        <div className="d-flex gap-2 align-items-center">
          <select
            className="form-select form-select-sm"
            style={{ width: "120px" }}
            value={component.type}
            onChange={e => handleTypeChange(e.target.value as UIComponentType)}
          >
            {COMPONENT_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder={propKey}
            value={propValue}
            onChange={e => handlePropChange(e.target.value)}
          />
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(component.id)}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
