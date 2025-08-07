import { useRef, Suspense, forwardRef, useImperativeHandle } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';
import type { VisualNode } from '../../types';

interface GLBModelNodeProps {
  node: VisualNode;
}

const ModelLoader = forwardRef<Group, { source: string; position: any; scale: number }>(({ source, position, scale }, ref) => {
  const { scene } = useGLTF(source);
  
  return (
    <primitive 
      ref={ref}
      object={scene.clone()} 
      position={[position.x, position.y, position.z]}
      scale={[scale, scale, scale]}
    />
  );
});

ModelLoader.displayName = 'ModelLoader';

const GLBModelNode = forwardRef<Group, GLBModelNodeProps>(({ node }, ref) => {
  const groupRef = useRef<Group>(null);
  
  useImperativeHandle(ref, () => groupRef.current!, []);
  
  const { 
    position = { x: 0, y: 0, z: 0 }, 
    scale = 1, 
    source 
  } = node.params;

  if (!source) {
    // Fallback cube when no model is loaded
    return (
      <mesh 
        ref={groupRef as any}
        position={[position.x, position.y, position.z]}
        scale={[scale, scale, scale]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
    );
  }

  return (
    <Suspense fallback={
      <mesh 
        position={[position.x, position.y, position.z]}
        scale={[scale, scale, scale]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#444444" wireframe />
      </mesh>
    }>
      <ModelLoader source={source} position={position} scale={scale} ref={groupRef} />
    </Suspense>
  );
});

GLBModelNode.displayName = 'GLBModelNode';

export default GLBModelNode;