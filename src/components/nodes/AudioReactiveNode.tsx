import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGraphStore } from '../../state/useGraphStore';
import { audioManager } from '../../audio/AudioManager';
import type { VisualNode } from '../../types';

interface AudioReactiveNodeProps {
  node: VisualNode;
  targetRefs: Map<string, React.RefObject<any>>;
}

const AudioReactiveNode = ({ node, targetRefs }: AudioReactiveNodeProps) => {
  const { getNode } = useGraphStore();
  const isInitialized = useRef(false);
  
  useEffect(() => {
    // Initialize microphone on first mount (backward compatibility)
    if (!isInitialized.current && !node.params.audioSourceId) {
      audioManager.initializeMicrophoneLegacy().catch(console.error);
      isInitialized.current = true;
    }
    
    return () => {
      // Cleanup handled by singleton
    };
  }, [node.params.audioSourceId]);

  useFrame(() => {
    if (!node.inputs.length) return;
    
    // Get audio data from specified source or fallback to legacy method
    const audioSourceId = node.params.audioSourceId;
    const audioData = audioSourceId 
      ? audioManager.getAudioData(audioSourceId)
      : audioManager.getAudioDataLegacy();
      
    const { sensitivity = 1.0, targetProperty = 'scale' } = node.params;
    
    // Apply audio reactivity to all input nodes
    node.inputs.forEach(inputId => {
      const targetNode = getNode(inputId);
      const targetRef = targetRefs.get(inputId);
      
      if (!targetNode || !targetRef?.current) return;
      
      const mesh = targetRef.current;
      
      switch (targetProperty) {
        case 'scale':
          const baseScale = targetNode.params.scale || 1;
          const scaleFactor = 1 + (audioData.amplitude * sensitivity);
          mesh.scale.setScalar(baseScale * scaleFactor);
          break;
          
        case 'rotation':
          mesh.rotation.y += audioData.amplitude * sensitivity * 0.1;
          break;
          
        case 'color':
          if (mesh.material && mesh.material.color) {
            const intensity = 0.5 + (audioData.amplitude * sensitivity * 0.5);
            mesh.material.color.setRGB(intensity, intensity, intensity);
          }
          break;
      }
    });
  });

  return null; // This node doesn't render anything visible
};

export default AudioReactiveNode;