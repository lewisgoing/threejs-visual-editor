export interface AudioSource {
  id: string;
  type: 'microphone' | 'file';
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  audioElement?: HTMLAudioElement;
  stream?: MediaStream;
}

export class AudioManager {
  private audioContext?: AudioContext;
  private audioSources = new Map<string, AudioSource>();
  
  async initializeMicrophone(sourceId: string): Promise<void> {
    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(stream);
      
      const analyser = this.audioContext.createAnalyser();
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      source.connect(analyser);

      this.audioSources.set(sourceId, {
        id: sourceId,
        type: 'microphone',
        analyser,
        dataArray,
        stream
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  async initializeFromFile(sourceId: string, file: File): Promise<void> {
    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      // Create audio element
      const audioElement = document.createElement('audio');
      audioElement.src = URL.createObjectURL(file);
      audioElement.crossOrigin = 'anonymous';
      audioElement.loop = true;
      
      // Wait for audio to be ready
      await new Promise((resolve, reject) => {
        audioElement.addEventListener('loadeddata', resolve);
        audioElement.addEventListener('error', reject);
        audioElement.load();
      });

      const source = this.audioContext.createMediaElementSource(audioElement);
      
      const analyser = this.audioContext.createAnalyser();
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      source.connect(analyser);
      source.connect(this.audioContext.destination); // So we can hear it
      
      this.audioSources.set(sourceId, {
        id: sourceId,
        type: 'file',
        analyser,
        dataArray,
        audioElement
      });

      // Auto-play the audio
      audioElement.play().catch(console.error);
    } catch (error) {
      console.error('Error loading audio file:', error);
      throw error;
    }
  }

  getAudioData(sourceId: string): { amplitude: number; frequencies: Uint8Array; averageFrequency: number } {
    const audioSource = this.audioSources.get(sourceId);
    
    if (!audioSource) {
      return {
        amplitude: 0,
        frequencies: new Uint8Array(0),
        averageFrequency: 0
      };
    }

    audioSource.analyser.getByteFrequencyData(audioSource.dataArray);
    
    const amplitude = Array.from(audioSource.dataArray).reduce((sum, value) => sum + value, 0) / audioSource.dataArray.length;
    const averageFrequency = amplitude; // Simplified for now
    
    return {
      amplitude: amplitude / 255, // Normalize to 0-1
      frequencies: audioSource.dataArray,
      averageFrequency: averageFrequency / 255
    };
  }

  playAudio(sourceId: string): void {
    const audioSource = this.audioSources.get(sourceId);
    if (audioSource?.audioElement) {
      audioSource.audioElement.play().catch(console.error);
    }
  }

  pauseAudio(sourceId: string): void {
    const audioSource = this.audioSources.get(sourceId);
    if (audioSource?.audioElement) {
      audioSource.audioElement.pause();
    }
  }

  removeSource(sourceId: string): void {
    const audioSource = this.audioSources.get(sourceId);
    if (audioSource) {
      if (audioSource.stream) {
        audioSource.stream.getTracks().forEach(track => track.stop());
      }
      if (audioSource.audioElement) {
        audioSource.audioElement.pause();
        URL.revokeObjectURL(audioSource.audioElement.src);
      }
      this.audioSources.delete(sourceId);
    }
  }

  dispose(): void {
    this.audioSources.forEach((_, sourceId) => {
      this.removeSource(sourceId);
    });
    
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  // Legacy methods for backward compatibility with existing microphone usage
  async initializeMicrophoneLegacy(): Promise<void> {
    return this.initializeMicrophone('default-microphone');
  }

  getAudioDataLegacy(): { amplitude: number; frequencies: Uint8Array; averageFrequency: number } {
    return this.getAudioData('default-microphone');
  }
}

// Singleton instance
export const audioManager = new AudioManager();