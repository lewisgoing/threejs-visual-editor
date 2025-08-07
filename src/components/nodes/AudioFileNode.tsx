import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { audioManager } from '../../audio/AudioManager';
import type { VisualNode } from '../../types';

interface AudioFileNodeProps {
  node: VisualNode;
}

const AudioFileNode = ({ node }: AudioFileNodeProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { file, volume = 1.0 } = node.params;

  useEffect(() => {
    // Load audio file if provided
    if (file && file instanceof File) {
      loadAudioFile(file);
    }
  }, [file]);

  const loadAudioFile = async (audioFile: File) => {
    try {
      setError(null);
      setIsLoaded(false);
      
      await audioManager.initializeFromFile(node.id, audioFile);
      setIsLoaded(true);
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to load audio file:', error);
      setError('Failed to load audio file');
      setIsLoaded(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // We would normally update the node params here via the store
      // For now, directly load the file
      loadAudioFile(selectedFile);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      audioManager.pauseAudio(node.id);
      setIsPlaying(false);
    } else {
      audioManager.playAudio(node.id);
      setIsPlaying(true);
    }
  };

  // Update volume if it changes
  useFrame(() => {
    const audioSource = (audioManager as any).audioSources?.get(node.id);
    if (audioSource?.audioElement) {
      audioSource.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioManager.removeSource(node.id);
    };
  }, [node.id]);

  // This node provides a UI overlay for the audio controls
  // In a full implementation, this would be rendered in a separate UI layer
  return (
    <group position={[0, 2, 0]}>
      {/* Visual indicator mesh */}
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial 
          color={isLoaded ? (isPlaying ? '#4CAF50' : '#FF9800') : (error ? '#F44336' : '#757575')}
          emissive={isLoaded ? (isPlaying ? '#1B5E20' : '#E65100') : (error ? '#B71C1C' : '#212121')}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Audio waveform visualization */}
      {isLoaded && (
        <AudioWaveform nodeId={node.id} />
      )}
    </group>
  );
};

// Simple waveform visualization component
const AudioWaveform = ({ nodeId }: { nodeId: string }) => {
  const meshRef = useRef<any>(null);
  
  useFrame(() => {
    const audioData = audioManager.getAudioData(nodeId);
    if (meshRef.current && audioData.amplitude > 0) {
      const scale = 1 + audioData.amplitude * 2;
      meshRef.current.scale.setScalar(scale);
      
      // Rotate based on audio
      meshRef.current.rotation.y += audioData.amplitude * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.8, 0]}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial 
        color="#2196F3"
        emissive="#1976D2"
        emissiveIntensity={0.3}
        wireframe
      />
    </mesh>
  );
};

export default AudioFileNode;