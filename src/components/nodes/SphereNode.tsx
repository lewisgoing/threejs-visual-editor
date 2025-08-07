import { useRef, forwardRef, useImperativeHandle } from 'react';
import { Mesh } from 'three';
import type { VisualNode } from '../../types';

interface SphereNodeProps {
  node: VisualNode;
}

const SphereNode = forwardRef<Mesh, SphereNodeProps>(({ node }, ref) => {
  const meshRef = useRef<Mesh>(null);
  
  useImperativeHandle(ref, () => meshRef.current!, []);
  
  const { position = { x: 0, y: 0, z: 0 }, scale = 1, color = '#ffffff' } = node.params;

  return (
    <mesh 
      ref={meshRef}
      position={[position.x, position.y, position.z]}
      scale={[scale, scale, scale]}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
});

SphereNode.displayName = 'SphereNode';

export default SphereNode;