import { useRef, useMemo } from 'react';
import { useGraphStore } from '../state/useGraphStore';
import type { VisualNode } from '../types';
import SphereNode from './nodes/SphereNode';
import ImagePlaneNode from './nodes/ImagePlaneNode';
import GLBModelNode from './nodes/GLBModelNode';
import AudioFileNode from './nodes/AudioFileNode';
import AudioReactiveNode from './nodes/AudioReactiveNode';
import ShaderEffectNode from './nodes/ShaderEffectNode';
import AsciiEffectNode from './nodes/AsciiEffectNode';

const SceneGraph = () => {
  const { nodes, getNode } = useGraphStore();
  
  // Store refs for all nodes so effects can access them
  const nodeRefs = useRef<Map<string, React.RefObject<any>>>(new Map());
  
  // Ensure all nodes have refs
  useMemo(() => {
    nodes.forEach(node => {
      if (!nodeRefs.current.has(node.id)) {
        nodeRefs.current.set(node.id, { current: null });
      }
    });
  }, [nodes]);
  
  const renderNode = (node: VisualNode): React.ReactElement | null => {
    const nodeRef = nodeRefs.current.get(node.id);
    
    switch (node.type) {
      case 'SphereNode':
        return <SphereNode key={node.id} node={node} ref={nodeRef} />;
      case 'ImagePlaneNode':
        return <ImagePlaneNode key={node.id} node={node} ref={nodeRef} />;
      case 'GLBModelNode':
        return <GLBModelNode key={node.id} node={node} ref={nodeRef} />;
      case 'AudioFileNode':
        return <AudioFileNode key={node.id} node={node} />;
      case 'AudioReactiveNode':
        return <AudioReactiveNode key={node.id} node={node} targetRefs={nodeRefs.current} />;
      case 'ShaderEffectNode':
        return <ShaderEffectNode key={node.id} node={node} />;
      case 'AsciiEffectNode':
        return <AsciiEffectNode key={node.id} node={node} />;
      default:
        return null;
    }
  };

  // Find the output node and render all connected nodes
  const outputNode = nodes.find(n => n.kind === 'output');
  
  const renderConnectedNodes = (nodeIds: string[]): React.ReactElement[] => {
    return nodeIds.flatMap(id => {
      const node = getNode(id);
      if (!node) return [];
      
      const renderedNode = renderNode(node);
      const childNodes = renderConnectedNodes(node.inputs);
      
      return renderedNode ? [renderedNode, ...childNodes] : childNodes;
    });
  };

  if (!outputNode) {
    return null;
  }

  // Render all effect nodes first (they don't render visually but set up behaviors)
  const effectNodes = nodes.filter(n => n.kind === 'effect');
  
  return (
    <>
      {effectNodes.map(node => renderNode(node))}
      {renderConnectedNodes(outputNode.inputs)}
    </>
  );
};

export default SceneGraph;