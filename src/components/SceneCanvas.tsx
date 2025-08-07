import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGraphStore } from '../state/useGraphStore';
import SceneGraph from './SceneGraph';

const SceneCanvas = () => {
  const outputNode = useGraphStore(state => 
    state.nodes.find(n => n.kind === 'output')
  );

  return (
    <div style={{ width: '100%', height: '100%', background: '#000' }}>
      <Canvas
        camera={{
          position: outputNode?.params.cameraPosition 
            ? [outputNode.params.cameraPosition.x, outputNode.params.cameraPosition.y, outputNode.params.cameraPosition.z]
            : [0, 0, 5],
          fov: 75
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls makeDefault />
        
        <SceneGraph />
      </Canvas>
    </div>
  );
};

export default SceneCanvas;