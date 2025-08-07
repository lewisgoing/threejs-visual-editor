import { useGraphStore } from '../state/useGraphStore';
import type { VisualNode } from '../types';
import { presets } from '../presets';
import './NodeSidebar.css';

interface NodeType {
  type: string;
  kind: 'source' | 'effect' | 'output';
  label: string;
  defaultParams: Record<string, any>;
  description: string;
}

const nodeTypes: NodeType[] = [
  {
    type: 'SphereNode',
    kind: 'source',
    label: 'Sphere',
    defaultParams: {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      color: '#ffffff'
    },
    description: 'A 3D sphere primitive'
  },
  {
    type: 'ImagePlaneNode',
    kind: 'source',
    label: 'Image Plane',
    defaultParams: {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      source: '/vite.svg'
    },
    description: 'A plane with an image texture'
  },
  {
    type: 'GLBModelNode',
    kind: 'source',
    label: 'GLB Model',
    defaultParams: {
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      source: ''
    },
    description: 'Load a GLB/GLTF 3D model'
  },
  {
    type: 'AudioFileNode',
    kind: 'source',
    label: 'Audio File',
    defaultParams: {
      position: { x: 0, y: 0, z: 0 },
      volume: 1.0,
      file: null
    },
    description: 'Load audio file for visualization'
  },
  {
    type: 'AudioReactiveNode',
    kind: 'effect',
    label: 'Audio Reactive',
    defaultParams: {
      sensitivity: 1.0,
      targetProperty: 'scale',
      audioSourceId: undefined
    },
    description: 'Make objects react to audio'
  },
  {
    type: 'ShaderEffectNode',
    kind: 'effect',
    label: 'Shader Effect',
    defaultParams: {
      vertexShader: '',
      fragmentShader: '',
      uniforms: {}
    },
    description: 'Apply custom GLSL shaders'
  },
];

const NodeSidebar = () => {
  const { addNode, clearGraph, nodes, edges, addEdge } = useGraphStore();
  
  const loadPreset = (presetIndex: number) => {
    const preset = presets[presetIndex];
    if (!preset) return;
    
    clearGraph();
    
    // Add nodes
    preset.nodes.forEach(node => addNode(node));
    
    // Add edges
    preset.edges.forEach(edge => addEdge(edge));
  };
  
  const saveCurrentAsJson = () => {
    const currentState = {
      name: "Custom Preset",
      description: "User created preset",
      nodes,
      edges
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentState, null, 2));
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", dataStr);
    downloadLink.setAttribute("download", "preset.json");
    downloadLink.click();
  };

  const generateId = () => {
    return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleNodeAdd = (nodeType: NodeType) => {
    const newNode: VisualNode = {
      id: generateId(),
      kind: nodeType.kind,
      type: nodeType.type,
      params: { ...nodeType.defaultParams },
      inputs: [],
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 }
    };
    
    addNode(newNode);
  };

  const getNodeColor = (kind: string) => {
    switch (kind) {
      case 'source': return '#4CAF50';
      case 'effect': return '#2196F3';
      case 'output': return '#FF9800';
      default: return '#757575';
    }
  };

  return (
    <div className="node-sidebar">
      <h3>Node Library</h3>
      
      <div className="preset-section">
        <h4>Presets</h4>
        {presets.map((preset, index) => (
          <button
            key={index}
            className="preset-button"
            onClick={() => loadPreset(index)}
            title={preset.description}
          >
            {preset.name}
          </button>
        ))}
        <button
          className="preset-button save-button"
          onClick={saveCurrentAsJson}
          title="Save current graph as JSON"
        >
          Save Current
        </button>
      </div>
      
      <div className="node-category">
        <h4>Sources</h4>
        {nodeTypes.filter(n => n.kind === 'source').map(nodeType => (
          <button
            key={nodeType.type}
            className="node-button"
            style={{ borderLeft: `4px solid ${getNodeColor(nodeType.kind)}` }}
            onClick={() => handleNodeAdd(nodeType)}
            title={nodeType.description}
          >
            <div className="node-label">{nodeType.label}</div>
            <div className="node-description">{nodeType.description}</div>
          </button>
        ))}
      </div>

      <div className="node-category">
        <h4>Effects</h4>
        {nodeTypes.filter(n => n.kind === 'effect').map(nodeType => (
          <button
            key={nodeType.type}
            className="node-button"
            style={{ borderLeft: `4px solid ${getNodeColor(nodeType.kind)}` }}
            onClick={() => handleNodeAdd(nodeType)}
            title={nodeType.description}
          >
            <div className="node-label">{nodeType.label}</div>
            <div className="node-description">{nodeType.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NodeSidebar;