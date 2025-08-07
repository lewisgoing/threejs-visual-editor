import { useGraphStore } from '../state/useGraphStore';
import './PropertiesPanel.css';

const PropertiesPanel = () => {
  const { selectedNodeId, getNode, updateNodeParams } = useGraphStore();
  const selectedNode = selectedNodeId ? getNode(selectedNodeId) : null;

  if (!selectedNode) {
    return (
      <div className="properties-panel">
        <h3>Properties</h3>
        <p className="no-selection">Select a node to edit its properties</p>
      </div>
    );
  }

  const handleParamChange = (key: string, value: any) => {
    updateNodeParams(selectedNode.id, { [key]: value });
  };

  const handleVectorChange = (key: string, axis: 'x' | 'y' | 'z', value: number) => {
    const currentVector = selectedNode.params[key] || { x: 0, y: 0, z: 0 };
    handleParamChange(key, { ...currentVector, [axis]: value });
  };

  const renderParamInput = (key: string, value: any) => {
    if (typeof value === 'number') {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => handleParamChange(key, parseFloat(e.target.value) || 0)}
          step="0.1"
        />
      );
    }

    if (typeof value === 'string') {
      if (key === 'color') {
        return (
          <input
            type="color"
            value={value}
            onChange={(e) => handleParamChange(key, e.target.value)}
          />
        );
      }
      
      if (key === 'targetProperty') {
        return (
          <select
            value={value}
            onChange={(e) => handleParamChange(key, e.target.value)}
          >
            <option value="scale">Scale</option>
            <option value="rotation">Rotation</option>
            <option value="color">Color</option>
          </select>
        );
      }
      
      if (key === 'vertexShader' || key === 'fragmentShader') {
        return (
          <textarea
            value={value}
            onChange={(e) => handleParamChange(key, e.target.value)}
            rows={10}
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          />
        );
      }
      
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => handleParamChange(key, e.target.value)}
        />
      );
    }

    // Handle file input for AudioFileNode
    if (key === 'file') {
      return (
        <div>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleParamChange(key, file);
              }
            }}
          />
          {value && (
            <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>
              {value instanceof File ? value.name : 'File selected'}
            </div>
          )}
        </div>
      );
    }

    // Handle audioSourceId selection for AudioReactiveNode
    if (key === 'audioSourceId') {
      return (
        <select
          value={value || ''}
          onChange={(e) => handleParamChange(key, e.target.value || undefined)}
        >
          <option value="">Use Microphone (Legacy)</option>
          {/* In a full implementation, this would list available audio file nodes */}
          <option value="audio-file-1">Audio File Node 1</option>
        </select>
      );
    }

    if (value && typeof value === 'object' && 'x' in value && 'y' in value && 'z' in value) {
      return (
        <div className="vector-input">
          <label>X:</label>
          <input
            type="number"
            value={value.x}
            onChange={(e) => handleVectorChange(key, 'x', parseFloat(e.target.value) || 0)}
            step="0.1"
          />
          <label>Y:</label>
          <input
            type="number"
            value={value.y}
            onChange={(e) => handleVectorChange(key, 'y', parseFloat(e.target.value) || 0)}
            step="0.1"
          />
          <label>Z:</label>
          <input
            type="number"
            value={value.z}
            onChange={(e) => handleVectorChange(key, 'z', parseFloat(e.target.value) || 0)}
            step="0.1"
          />
        </div>
      );
    }

    return (
      <input
        type="text"
        value={JSON.stringify(value)}
        onChange={(e) => {
          try {
            handleParamChange(key, JSON.parse(e.target.value));
          } catch {
            // Invalid JSON, ignore
          }
        }}
      />
    );
  };

  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      
      <div className="node-info">
        <div className="node-title">{selectedNode.type.replace('Node', '')}</div>
        <div className="node-kind">{selectedNode.kind}</div>
      </div>

      <div className="params-section">
        <h4>Parameters</h4>
        {Object.entries(selectedNode.params).map(([key, value]) => (
          <div key={key} className="param-group">
            <label className="param-label">
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            {renderParamInput(key, value)}
          </div>
        ))}
      </div>

      <div className="connections-section">
        <h4>Connections</h4>
        <div className="connection-info">
          <strong>Inputs:</strong> {selectedNode.inputs.length > 0 ? selectedNode.inputs.join(', ') : 'None'}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;