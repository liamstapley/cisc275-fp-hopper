import type { Project, Dataclass, StateAttribute, UIComponent, AttributeType } from "../types";

function pythonType(attrType: AttributeType): string {
  switch (attrType) {
    case "str": return "str";
    case "int": return "int";
    case "float": return "float";
    case "bool": return "bool";
    case "list[str]": return "List[str]";
    case "list[int]": return "List[int]";
  }
}

function pythonDefault(attr: StateAttribute): string {
  switch (attr.type) {
    case "str": return `"${attr.defaultValue}"`;
    case "int": return attr.defaultValue === "" ? "0" : attr.defaultValue;
    case "float": return attr.defaultValue === "" ? "0.0" : attr.defaultValue;
    case "bool": return attr.defaultValue === "true" ? "True" : "False";
    case "list[str]": return "field(default_factory=list)";
    case "list[int]": return "field(default_factory=list)";
  }
}

function toSnakeCase(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

function componentToPython(comp: UIComponent): string {
  switch (comp.type) {
    case "header": {
      const text = comp.props["text"] ?? "Header";
      return `Header("${String(text)}")`;
    }
    case "text": {
      const text = comp.props["text"] ?? "";
      return `Text("${String(text)}")`;
    }
    case "button": {
      const text = comp.props["text"] ?? "Button";
      return `Button("${String(text)}", lambda state: state)`;
    }
    case "textbox": {
      const placeholder = comp.props["placeholder"] ?? "";
      return `TextBox("${String(placeholder)}", "")`;
    }
    case "textarea": {
      const placeholder = comp.props["placeholder"] ?? "";
      return `TextArea("${String(placeholder)}", "")`;
    }
    case "checkbox": {
      const label = comp.props["label"] ?? "Check";
      return `CheckBox("${String(label)}", False)`;
    }
    case "select": {
      const label = comp.props["label"] ?? "Select";
      return `SelectBox("${String(label)}", [])`;
    }
  }
}

function dataclassToPython(dc: Dataclass): string[] {
  const lines: string[] = [];
  lines.push("@dataclass");
  lines.push(`class ${dc.name}:`);
  if (dc.attributes.length === 0) {
    lines.push("    pass");
  } else {
    for (const attr of dc.attributes) {
      lines.push(`    ${attr.name}: ${pythonType(attr.type)} = ${pythonDefault(attr)}`);
    }
  }
  return lines;
}

export function generatePythonCode(project: Project): string {
  const lines: string[] = [];

  lines.push("from drafter import *");
  lines.push("from dataclasses import dataclass, field");
  lines.push("from typing import List");
  lines.push("");

  for (const dc of project.stateModel.secondaryDataclasses) {
    lines.push(...dataclassToPython(dc));
    lines.push("");
  }

  lines.push(...dataclassToPython(project.stateModel.primaryState));
  lines.push("");

  for (const page of Object.values(project.pages)) {
    const funcName = toSnakeCase(page.name);
    const stateName = project.stateModel.primaryState.name;
    lines.push("@route");
    lines.push(`def ${funcName}(state: ${stateName}) -> Page:`);
    lines.push(`    return Page(state, [`);
    for (const comp of page.components) {
      lines.push(`        ${componentToPython(comp)},`);
    }
    lines.push("    ])");
    lines.push("");
  }

  lines.push(`start_server(${project.stateModel.primaryState.name})`);

  return lines.join("\n");
}
