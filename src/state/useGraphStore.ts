import { create } from 'zustand';
import type { VisualNode, GraphEdge } from '../types';

interface GraphState {
  nodes: VisualNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  
  // Actions
  addNode: (node: VisualNode) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, updates: Partial<VisualNode>) => void;
  updateNodeParams: (id: string, params: Record<string, any>) => void;
  
  addEdge: (edge: GraphEdge) => void;
  removeEdge: (id: string) => void;
  
  setSelectedNode: (id: string | null) => void;
  
  // Utility
  getNode: (id: string) => VisualNode | undefined;
  getNodesByType: (type: string) => VisualNode[];
  clearGraph: () => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: [
    // Default output node
    {
      id: 'output-1',
      kind: 'output',
      type: 'OutputNode',
      params: { cameraPosition: { x: 0, y: 0, z: 5 } },
      inputs: [],
      position: { x: 600, y: 200 }
    }
  ],
  edges: [],
  selectedNodeId: null,

  addNode: (node: VisualNode) => {
    set((state) => ({
      nodes: [...state.nodes, node]
    }));
  },

  removeNode: (id: string) => {
    set((state) => ({
      nodes: state.nodes.filter(n => n.id !== id),
      edges: state.edges.filter(e => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId
    }));
  },

  updateNode: (id: string, updates: Partial<VisualNode>) => {
    set((state) => ({
      nodes: state.nodes.map(node => 
        node.id === id ? { ...node, ...updates } : node
      )
    }));
  },

  updateNodeParams: (id: string, params: Record<string, any>) => {
    set((state) => ({
      nodes: state.nodes.map(node => 
        node.id === id ? { ...node, params: { ...node.params, ...params } } : node
      )
    }));
  },

  addEdge: (edge: GraphEdge) => {
    set((state) => {
      // Update target node's inputs
      const updatedNodes = state.nodes.map(node => {
        if (node.id === edge.target) {
          return {
            ...node,
            inputs: [...node.inputs, edge.source]
          };
        }
        return node;
      });

      return {
        edges: [...state.edges, edge],
        nodes: updatedNodes
      };
    });
  },

  removeEdge: (id: string) => {
    set((state) => {
      const edgeToRemove = state.edges.find(e => e.id === id);
      if (!edgeToRemove) return state;

      // Update target node's inputs
      const updatedNodes = state.nodes.map(node => {
        if (node.id === edgeToRemove.target) {
          return {
            ...node,
            inputs: node.inputs.filter(input => input !== edgeToRemove.source)
          };
        }
        return node;
      });

      return {
        edges: state.edges.filter(e => e.id !== id),
        nodes: updatedNodes
      };
    });
  },

  setSelectedNode: (id: string | null) => {
    set({ selectedNodeId: id });
  },

  getNode: (id: string) => {
    return get().nodes.find(n => n.id === id);
  },

  getNodesByType: (type: string) => {
    return get().nodes.filter(n => n.type === type);
  },

  clearGraph: () => {
    set({
      nodes: [{
        id: 'output-1',
        kind: 'output',
        type: 'OutputNode',
        params: { cameraPosition: { x: 0, y: 0, z: 5 } },
        inputs: [],
        position: { x: 600, y: 200 }
      }],
      edges: [],
      selectedNodeId: null
    });
  }
}));