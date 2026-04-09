import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { ProjectOverview } from "./pages/ProjectOverview";
import { PageGraphView } from "./pages/PageGraphView";
import { PageEditorView } from "./pages/PageEditorView";
import { StateEditorView } from "./pages/StateEditorView";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/project/:projectId" element={<ProjectOverview />} />
      <Route path="/project/:projectId/graph" element={<PageGraphView />} />
      <Route path="/project/:projectId/page/:pageId" element={<PageEditorView />} />
      <Route path="/project/:projectId/state" element={<StateEditorView />} />
    </Routes>
  );
}

export default App;
