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
    case 'source': return '#e91e63';
    case 'effect': return '#9c27b0';
    case 'output': return '#ff9800';
    default: return '#666666';
  }
};

const CustomNode = ({ data }: CustomNodeProps) => {
  const { label, nodeData, kind } = data;
  const nodeColor = getNodeColor(kind);
  
  return (
    <div 
      style={{
        background: 'linear-gradient(145deg, rgba(45, 45, 45, 0.9), rgba(30, 30, 30, 0.9))',
        border: `1px solid rgba(${kind === 'source' ? '233, 30, 99' : kind === 'effect' ? '156, 39, 176' : '255, 152, 0'}, 0.3)`,
        borderRadius: '16px',
        padding: '16px 20px',
        minWidth: '140px',
        color: '#ffffff',
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(${kind === 'source' ? '233, 30, 99' : kind === 'effect' ? '156, 39, 176' : '255, 152, 0'}, 0.1)`,
        backdropFilter: 'blur(10px)',
        position: 'relative',
      }}
    >
      {/* Input handle for effects and output */}
      {(kind === 'effect' || kind === 'output') && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ 
            background: nodeColor,
            width: '12px',
            height: '12px',
            border: '2px solid rgba(0, 0, 0, 0.3)',
            left: '-6px'
          }}
        />
      )}
      
      <div style={{ 
        fontSize: '14px', 
        fontWeight: '600', 
        marginBottom: '8px',
        color: nodeColor,
        textShadow: `0 0 8px ${nodeColor}40`
      }}>
        {label}
      </div>
      
      {/* Show key params with better styling */}
      <div style={{ 
        fontSize: '11px', 
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: '1.4'
      }}>
        {kind === 'source' && nodeData.params.position && (
          <div>x:{nodeData.params.position.x.toFixed(1)} y:{nodeData.params.position.y.toFixed(1)} z:{nodeData.params.position.z.toFixed(1)}</div>
        )}
        {nodeData.params.scale && (
          <div>scale: {nodeData.params.scale}</div>
        )}
        {nodeData.params.sensitivity && (
          <div>sensitivity: {nodeData.params.sensitivity}</div>
        )}
        {nodeData.params.enabled !== undefined && (
          <div>{nodeData.params.enabled ? 'enabled' : 'disabled'}</div>
        )}
      </div>
      
      {/* Output handle for sources and effects */}
      {(kind === 'source' || kind === 'effect') && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ 
            background: nodeColor,
            width: '12px',
            height: '12px',
            border: '2px solid rgba(0, 0, 0, 0.3)',
            right: '-6px'
          }}
        />
      )}
    </div>
  );
};

export default CustomNode;