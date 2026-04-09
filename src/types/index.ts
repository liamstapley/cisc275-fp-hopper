import type { CSSProperties } from "react";

export type UIComponentType = "text" | "textbox" | "textarea" | "checkbox" | "select" | "button" | "header";
export type AttributeType = "str" | "int" | "float" | "bool" | "list[str]" | "list[int]";

export interface UIComponent {
  id: string;
  type: UIComponentType;
  props: Record<string, string | number | boolean>;
  style: CSSProperties;
}

export interface PageNode {
  id: string;
  name: string;
  components: UIComponent[];
  style: CSSProperties;
  position: { x: number; y: number };
  description: string;
  ifAnnotation: string;
  forAnnotation: string;
  stateChanges: string;
}

export interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  ifAnnotation: string;
  forAnnotation: string;
  stateChanges: string;
}

export interface StateAttribute {
  id: string;
  name: string;
  type: AttributeType;
  description: string;
  defaultValue: string;
}

export interface Dataclass {
  id: string;
  name: string;
  attributes: StateAttribute[];
}

export interface StateModel {
  primaryState: Dataclass;
  secondaryDataclasses: Dataclass[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  pages: Record<string, PageNode>;
  routes: Record<string, Route>;
  stateModel: StateModel;
  createdAt: string;
  updatedAt: string;
}
