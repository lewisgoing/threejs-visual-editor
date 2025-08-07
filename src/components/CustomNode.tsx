import { Handle, Position } from 'reactflow';
import type { VisualNode } from '../types';

interface CustomNodeProps {
  data: {
    label: string;
    nodeData: VisualNode;
    kind: string;
  };
}

const getNodeColor = (kind: string) => {
  switch (kind) {
    case 'source': return '#4CAF50';
    case 'effect': return '#2196F3';
    case 'output': return '#FF9800';
    default: return '#757575';
  }
};

const CustomNode = ({ data }: CustomNodeProps) => {
  const { label, nodeData, kind } = data;
  
  return (
    <div 
      style={{
        background: '#2d2d2d',
        border: `2px solid ${getNodeColor(kind)}`,
        borderRadius: '8px',
        padding: '10px',
        minWidth: '100px',
        color: '#ffffff',
      }}
    >
      {/* Input handle for effects and output */}
      {(kind === 'effect' || kind === 'output') && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: getNodeColor(kind) }}
        />
      )}
      
      <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
        {label}
      </div>
      
      {/* Show some key params */}
      <div style={{ fontSize: '10px', color: '#aaa' }}>
        {kind === 'source' && nodeData.params.position && (
          <div>Pos: ({nodeData.params.position.x}, {nodeData.params.position.y}, {nodeData.params.position.z})</div>
        )}
        {nodeData.params.scale && (
          <div>Scale: {nodeData.params.scale}</div>
        )}
      </div>
      
      {/* Output handle for sources and effects */}
      {(kind === 'source' || kind === 'effect') && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: getNodeColor(kind) }}
        />
      )}
    </div>
  );
};

export default CustomNode;