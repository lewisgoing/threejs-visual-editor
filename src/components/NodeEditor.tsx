import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
} from 'reactflow';
import { useGraphStore } from '../state/useGraphStore';
import CustomNode from './CustomNode';
import 'reactflow/dist/style.css';

const nodeTypes = {
  custom: CustomNode,
};

const NodeEditor = () => {
  const { nodes: storeNodes, edges: storeEdges, addEdge: addStoreEdge, removeEdge, setSelectedNode } = useGraphStore();
  
  // Convert store nodes to React Flow format
  const reactFlowNodes = useMemo(() => 
    storeNodes.map(node => ({
      id: node.id,
      type: 'custom',
      position: node.position || { x: Math.random() * 500, y: Math.random() * 300 },
      data: { 
        label: node.type.replace('Node', ''),
        nodeData: node,
        kind: node.kind
      },
    }))
  , [storeNodes]);

  // Convert store edges to React Flow format
  const reactFlowEdges = useMemo(() =>
    storeEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: true,
    }))
  , [storeEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

  // Update React Flow states when store changes
  useMemo(() => {
    setNodes(reactFlowNodes);
  }, [reactFlowNodes, setNodes]);

  useMemo(() => {
    setEdges(reactFlowEdges);
  }, [reactFlowEdges, setEdges]);

  const onConnect = useCallback((params: Connection) => {
    if (params.source && params.target) {
      const edgeId = `${params.source}-${params.target}`;
      addStoreEdge({
        id: edgeId,
        source: params.source,
        target: params.target,
      });
    }
  }, [addStoreEdge]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);

  const onEdgesDelete = useCallback((edgesToDelete: any[]) => {
    edgesToDelete.forEach(edge => {
      removeEdge(edge.id);
    });
  }, [removeEdge]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default NodeEditor;