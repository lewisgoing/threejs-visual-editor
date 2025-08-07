import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import type { VisualNode } from '../../types';

interface AsciiEffectNodeProps {
  node: VisualNode;
}

const AsciiEffectNode = ({ node }: AsciiEffectNodeProps) => {
  const { gl, scene, camera, size } = useThree();
  const asciiEffectRef = useRef<AsciiEffect | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const {
    backgroundColor = '#000000',
    color = '#ffffff',
    characters = ' .:-=+*#%@',
    fontSize = 15,
    enabled = true
  } = node.params;

  useEffect(() => {
    if (!enabled) return;

    // Create ASCII effect
    const effect = new AsciiEffect(gl, characters, { 
      invert: false
    });
    effect.setSize(size.width, size.height);
    
    // Create container for ASCII output
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.fontFamily = 'Courier New, monospace';
    container.style.fontSize = `${fontSize}px`;
    container.style.lineHeight = '1';
    container.style.letterSpacing = '1px';
    container.style.color = color;
    container.style.backgroundColor = backgroundColor;
    container.style.overflow = 'hidden';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1000';
    
    // Find the scene canvas container and add ASCII overlay
    const canvasContainer = gl.domElement.parentElement;
    if (canvasContainer) {
      canvasContainer.style.position = 'relative';
      canvasContainer.appendChild(container);
      containerRef.current = container;
    }
    
    asciiEffectRef.current = effect;
    
    return () => {
      if (container && canvasContainer) {
        canvasContainer.removeChild(container);
      }
    };
  }, [gl, size, characters, color, backgroundColor, fontSize, enabled]);

  useFrame(() => {
    if (asciiEffectRef.current && containerRef.current && enabled) {
      // Render ASCII
      asciiEffectRef.current.render(scene, camera);
      
      // Get the ASCII output and display it
      const asciiOutput = (asciiEffectRef.current as any).domElement.innerHTML;
      if (containerRef.current) {
        containerRef.current.innerHTML = asciiOutput;
      }
    }
  });

  return null; // This effect doesn't render anything in the 3D scene
};

export default AsciiEffectNode;