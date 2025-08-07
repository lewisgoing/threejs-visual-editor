import { useMemo } from 'react';
import { ShaderMaterial } from 'three';
import type { VisualNode } from '../../types';

interface ShaderEffectNodeProps {
  node: VisualNode;
}

const defaultVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const defaultFragmentShader = `
  uniform float time;
  uniform vec3 color;
  varying vec2 vUv;
  
  void main() {
    vec3 finalColor = color * (0.5 + 0.5 * sin(time + vUv.x * 10.0));
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const ShaderEffectNode = ({ node }: ShaderEffectNodeProps) => {
  const { 
    vertexShader = defaultVertexShader,
    fragmentShader = defaultFragmentShader,
    uniforms = { time: { value: 0 }, color: { value: [1, 1, 1] } }
  } = node.params;

  const shaderMaterial = useMemo(() => {
    try {
      return new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          time: { value: 0 },
          color: { value: [1, 1, 1] },
          ...uniforms
        }
      });
    } catch (error) {
      console.error('Shader compilation error:', error);
      // Return a fallback material on error
      return new ShaderMaterial({
        vertexShader: defaultVertexShader,
        fragmentShader: defaultFragmentShader,
        uniforms: {
          time: { value: 0 },
          color: { value: [1, 0, 0] } // Red to indicate error
        }
      });
    }
  }, [vertexShader, fragmentShader, uniforms]);

  // Update time uniform
  useMemo(() => {
    const interval = setInterval(() => {
      if (shaderMaterial.uniforms.time) {
        shaderMaterial.uniforms.time.value = Date.now() * 0.001;
      }
    }, 16); // ~60fps
    
    return () => clearInterval(interval);
  }, [shaderMaterial]);

  // This component provides the shader material to be used by source nodes
  // The actual application is handled in the SceneGraph
  return null;
};

export default ShaderEffectNode;