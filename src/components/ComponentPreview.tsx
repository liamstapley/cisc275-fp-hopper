import type { UIComponent } from "../types";

interface ComponentPreviewProps {
  component: UIComponent;
}

export function ComponentPreview({ component }: ComponentPreviewProps) {
  switch (component.type) {
    case "header":
      return <h3 style={component.style}>{String(component.props["text"] ?? "Header")}</h3>;
    case "text":
      return <p style={component.style}>{String(component.props["text"] ?? "")}</p>;
    case "button":
      return <button className="btn btn-primary btn-sm" style={component.style}>{String(component.props["text"] ?? "Button")}</button>;
    case "textbox":
      return <input type="text" className="form-control" placeholder={String(component.props["placeholder"] ?? "")} style={component.style} readOnly />;
    case "textarea":
      return <textarea className="form-control" placeholder={String(component.props["placeholder"] ?? "")} style={component.style} readOnly />;
    case "checkbox":
      return (
        <div className="form-check" style={component.style}>
          <input type="checkbox" className="form-check-input" readOnly />
          <label className="form-check-label">{String(component.props["label"] ?? "Checkbox")}</label>
        </div>
      );
    case "select":
      return (
        <select className="form-select" style={component.style}>
          <option>{String(component.props["label"] ?? "Select an option")}</option>
        </select>
      );
  }
}
