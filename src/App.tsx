import { ReactFlowProvider } from 'reactflow';
import NodeEditor from './components/NodeEditor';
import SceneCanvas from './components/SceneCanvas';
import NodeSidebar from './components/NodeSidebar';
import PropertiesPanel from './components/PropertiesPanel';
import './App.css';

function App() {
  return (
    <div className="app">
      <ReactFlowProvider>
        <div className="sidebar">
          <NodeSidebar />
        </div>
        
        <div className="main-content">
          <div className="node-editor">
            <NodeEditor />
          </div>
          
          <div className="right-panel">
            <div className="scene-canvas">
              <SceneCanvas />
            </div>
            
            <div className="properties">
              <PropertiesPanel />
            </div>
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App
