import type { VisualNode, GraphEdge } from '../types';

export interface Preset {
  name: string;
  description: string;
  nodes: VisualNode[];
  edges: GraphEdge[];
}

export const presets: Preset[] = [
  {
    name: "Audio Reactive Sphere",
    description: "A sphere that pulses with audio input",
    nodes: [
      {
        id: "sphere-1",
        kind: "source",
        type: "SphereNode",
        params: {
          position: { x: 0, y: 0, z: 0 },
          scale: 1,
          color: "#4CAF50"
        },
        inputs: [],
        position: { x: 100, y: 150 }
      },
      {
        id: "audio-1",
        kind: "effect",
        type: "AudioReactiveNode",
        params: {
          sensitivity: 2.0,
          targetProperty: "scale"
        },
        inputs: ["sphere-1"],
        position: { x: 350, y: 150 }
      },
      {
        id: "output-1",
        kind: "output",
        type: "OutputNode",
        params: {
          cameraPosition: { x: 0, y: 0, z: 5 }
        },
        inputs: ["audio-1"],
        position: { x: 600, y: 150 }
      }
    ],
    edges: [
      { id: "sphere-audio", source: "sphere-1", target: "audio-1" },
      { id: "audio-output", source: "audio-1", target: "output-1" }
    ]
  },
  {
    name: "Shader Sphere",
    description: "A sphere with an animated shader effect",
    nodes: [
      {
        id: "sphere-2",
        kind: "source",
        type: "SphereNode",
        params: {
          position: { x: 0, y: 0, z: 0 },
          scale: 1.5,
          color: "#2196F3"
        },
        inputs: [],
        position: { x: 100, y: 150 }
      },
      {
        id: "shader-1",
        kind: "effect",
        type: "ShaderEffectNode",
        params: {
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            void main() {
              vec3 finalColor = color * (0.5 + 0.5 * sin(time + vUv.x * 10.0));
              gl_FragColor = vec4(finalColor, 1.0);
            }
          `,
          uniforms: {}
        },
        inputs: ["sphere-2"],
        position: { x: 350, y: 150 }
      },
      {
        id: "output-1",
        kind: "output",
        type: "OutputNode",
        params: {
          cameraPosition: { x: 0, y: 0, z: 5 }
        },
        inputs: ["shader-1"],
        position: { x: 600, y: 150 }
      }
    ],
    edges: [
      { id: "sphere-shader", source: "sphere-2", target: "shader-1" },
      { id: "shader-output", source: "shader-1", target: "output-1" }
    ]
  },
  {
    name: "Audio File Visualizer",
    description: "Load an audio file and visualize it with a reactive sphere",
    nodes: [
      {
        id: "audio-file-1",
        kind: "source",
        type: "AudioFileNode",
        params: {
          position: { x: -2, y: 0, z: 0 },
          volume: 0.8,
          file: null
        },
        inputs: [],
        position: { x: 50, y: 100 }
      },
      {
        id: "sphere-3",
        kind: "source",
        type: "SphereNode",
        params: {
          position: { x: 2, y: 0, z: 0 },
          scale: 1,
          color: "#FF5722"
        },
        inputs: [],
        position: { x: 250, y: 150 }
      },
      {
        id: "audio-reactive-2",
        kind: "effect",
        type: "AudioReactiveNode",
        params: {
          sensitivity: 3.0,
          targetProperty: "scale",
          audioSourceId: "audio-file-1"
        },
        inputs: ["sphere-3"],
        position: { x: 450, y: 150 }
      },
      {
        id: "output-1",
        kind: "output",
        type: "OutputNode",
        params: {
          cameraPosition: { x: 0, y: 0, z: 8 }
        },
        inputs: ["audio-reactive-2", "audio-file-1"],
        position: { x: 650, y: 125 }
      }
    ],
    edges: [
      { id: "sphere-audio-reactive", source: "sphere-3", target: "audio-reactive-2" },
      { id: "audio-reactive-output", source: "audio-reactive-2", target: "output-1" },
      { id: "audio-file-output", source: "audio-file-1", target: "output-1" }
    ]
  }
];