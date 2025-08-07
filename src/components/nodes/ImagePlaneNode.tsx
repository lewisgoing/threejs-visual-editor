import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useTexture } from '@react-three/drei';
import { Mesh } from 'three';
import type { VisualNode } from '../../types';

interface ImagePlaneNodeProps {
  node: VisualNode;
}

const ImagePlaneNode = forwardRef<Mesh, ImagePlaneNodeProps>(({ node }, ref) => {
  const meshRef = useRef<Mesh>(null);
  
  useImperativeHandle(ref, () => meshRef.current!, []);
  
  const { 
    position = { x: 0, y: 0, z: 0 }, 
    scale = 1, 
    source = '/vite.svg' // Default placeholder
  } = node.params;

  const texture = useTexture(source) as any; // Type assertion to handle drei texture types

  return (
    <mesh 
      ref={meshRef}
      position={[position.x, position.y, position.z]}
      scale={[scale, scale, 1]}
    >
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
});

ImagePlaneNode.displayName = 'ImagePlaneNode';

export default ImagePlaneNode;