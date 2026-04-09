import { useCallback, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useProjectStore } from "../store/projectStore";
import type { PageNode, Route } from "../types";

type PageNodeData = { label: string; pageId: string };
type FlowNode = Node<PageNodeData>;

function pageToFlowNode(page: PageNode): FlowNode {
  return {
    id: page.id,
    position: page.position,
    data: { label: page.name, pageId: page.id },
    type: "default",
  };
}

function routeToFlowEdge(route: Route): Edge {
  return {
    id: route.id,
    source: route.from,
    target: route.to,
    label: route.name,
  };
}

export function PageGraphView() {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, addPage, updatePage, deletePage, addRoute, deleteRoute } = useProjectStore();
  const navigate = useNavigate();

  const project = projects.find(p => p.id === projectId);

  const initialNodes: FlowNode[] = project
    ? Object.values(project.pages).map(pageToFlowNode)
    : [];

  const initialEdges: Edge[] = project
    ? Object.values(project.routes).map(routeToFlowEdge)
    : [];

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  useEffect(() => {
    if (project !== undefined) {
      setNodes(Object.values(project.pages).map(pageToFlowNode));
      setEdges(Object.values(project.routes).map(routeToFlowEdge));
    }
  }, [project, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (projectId === undefined) return;
      const routeId = `route-${Date.now()}`;
      const route: Route = {
        id: routeId,
        name: `route_${routeId.slice(-4)}`,
        from: connection.source,
        to: connection.target,
        ifAnnotation: "",
        forAnnotation: "",
        stateChanges: "",
      };
      addRoute(projectId, route);
      setEdges(eds => addEdge({ ...connection, id: routeId, label: route.name }, eds));
    },
    [projectId, addRoute, setEdges]
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange<FlowNode>[]) => {
      onNodesChange(changes);
      if (projectId === undefined || project === undefined) return;
      for (const change of changes) {
        if (change.type === "position" && change.position !== undefined) {
          const page = project.pages[change.id] as PageNode | undefined;
          if (page !== undefined) {
            updatePage(projectId, { ...page, position: change.position });
          }
        }
        if (change.type === "remove") {
          deletePage(projectId, change.id);
        }
      }
    },
    [onNodesChange, projectId, project, updatePage, deletePage]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      onEdgesChange(changes);
      if (projectId === undefined) return;
      for (const change of changes) {
        if (change.type === "remove") {
          deleteRoute(projectId, change.id);
        }
      }
    },
    [onEdgesChange, projectId, deleteRoute]
  );

  const handleAddPage = () => {
    if (projectId === undefined) return;
    const pageId = `page-${Date.now()}`;
    const newPage: PageNode = {
      id: pageId,
      name: "new_page",
      description: "",
      ifAnnotation: "",
      forAnnotation: "",
      stateChanges: "",
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      style: {},
      components: [],
    };
    addPage(projectId, newPage);
  };

  const handleNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: FlowNode) => {
      if (projectId !== undefined) {
        void navigate(`/project/${projectId}/page/${node.data.pageId}`);
      }
    },
    [projectId, navigate]
  );

  if (project === undefined) {
    return (
      <div className="container py-4">
        <p>Project not found. <Link to="/">Back to Dashboard</Link></p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <div className="d-flex align-items-center p-2 border-bottom gap-2 bg-white">
        <Link to={`/project/${project.id}`} className="btn btn-outline-secondary btn-sm">
          ← {project.name}
        </Link>
        <h5 className="mb-0">Page Graph</h5>
        <button className="btn btn-primary btn-sm ms-auto" onClick={handleAddPage}>
          + Add Page
        </button>
      </div>
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={handleNodeDoubleClick}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}
