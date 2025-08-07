export type NodeKind = 'source' | 'effect' | 'output';

export interface VisualNode {
  id: string;
  kind: NodeKind;
  type: string;
  params: Record<string, any>;
  inputs: string[];
  position?: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface AudioData {
  amplitude: number;
  frequencies: Float32Array;
  averageFrequency: number;
}