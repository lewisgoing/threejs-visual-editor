# Node-Based 3D Visual Programming Tool

A browser-based visual programming environment for 3D graphics and audio-reactive visuals, inspired by TouchDesigner. Built with React, Three.js, and React Flow.

## Features

### Core Functionality
- **Node-based visual programming**: Drag and drop nodes to create complex 3D scenes
- **Real-time 3D rendering**: Powered by React Three Fiber and Three.js
- **Audio reactivity**: Make objects respond to microphone input or audio files
- **Custom shaders**: Write and apply custom GLSL shaders to objects
- **Live editing**: All changes reflect immediately in the 3D scene

### Node Types

#### Source Nodes (Create 3D Objects)
- **Sphere Node**: Creates a 3D sphere with customizable position, scale, and color
- **Image Plane Node**: Creates a textured plane from an image URL
- **GLB Model Node**: Load 3D models in GLB/GLTF format

#### Effect Nodes (Modify Objects)
- **Audio Reactive Node**: Makes objects respond to audio with configurable:
  - Target property (scale, rotation, color)
  - Sensitivity level
  - Requires microphone permission for live audio
- **Shader Effect Node**: Apply custom GLSL shaders with:
  - Custom vertex and fragment shaders
  - Configurable uniforms
  - Real-time shader compilation

#### Output Node
- **Output Node**: Final render destination with camera controls

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Modern web browser with WebGL support

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   bun install
   ```
3. Start the development server:
   ```bash
   bun run dev
   ```
4. Open http://localhost:5173 in your browser

### Building for Production
```bash
bun run build
```

## Usage Guide

### Basic Workflow

1. **Create Source Nodes**: Click on source nodes in the left sidebar to add 3D objects
2. **Add Effect Nodes**: Add audio reactive or shader effect nodes to modify objects
3. **Connect Nodes**: Drag connections between node outputs and inputs
4. **Edit Properties**: Select nodes to edit their parameters in the right panel
5. **View Results**: The 3D scene updates in real-time in the bottom panel

### Audio Reactivity

1. Add an Audio Reactive Node
2. Connect a source node (sphere, image plane, etc.) to its input
3. Connect the Audio Reactive Node to the Output Node
4. Grant microphone permission when prompted
5. The object will now respond to audio input

### Custom Shaders

1. Add a Shader Effect Node
2. Connect a source node to its input
3. Connect the Shader Effect Node to the Output Node
4. Edit the vertex and fragment shader code in the properties panel
5. The shader will compile and apply in real-time

### Presets

Use the preset system to quickly load example scenes:
- **Audio Reactive Sphere**: A sphere that pulses with audio
- **Shader Sphere**: A sphere with animated shader effects
- **Save Current**: Export your current node graph as JSON

### Navigation

- **3D Scene**: Use mouse to orbit, zoom, and pan around the scene
- **Node Editor**: Drag nodes to reposition, connect outputs to inputs
- **Properties Panel**: Select nodes to edit their parameters

## Technical Architecture

### Key Technologies
- **React 18**: UI framework
- **React Three Fiber**: React renderer for Three.js
- **React Flow**: Node-based editor
- **Zustand**: State management
- **Three.js**: 3D graphics library
- **Web Audio API**: Audio processing
- **TypeScript**: Type safety

### Project Structure
```
src/
├── components/          # React components
│   ├── nodes/          # Node type implementations
│   ├── NodeEditor.tsx  # React Flow integration
│   ├── SceneCanvas.tsx # 3D scene rendering
│   └── ...
├── state/              # Zustand store
├── audio/              # Audio processing
├── presets/            # Preset configurations
└── types.ts           # TypeScript definitions
```

### Data Flow

1. **Node Graph State**: Stored in Zustand store with nodes and edges
2. **Scene Rendering**: SceneGraph component interprets node data to create 3D objects
3. **Effect Processing**: Effect nodes modify source nodes each frame
4. **Audio Integration**: AudioManager provides real-time audio data to reactive nodes

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 90+
- Safari 14+
- Edge 90+

Requires WebGL 2.0 and Web Audio API support.

## Performance Considerations

- Audio analysis runs at 60fps for smooth visuals
- Large 3D models may impact performance
- Custom shaders are compiled in real-time
- Use browser developer tools to monitor performance

## Extending the System

### Adding New Node Types

1. Create a new component in `src/components/nodes/`
2. Add the node type to `NodeSidebar.tsx`
3. Update `SceneGraph.tsx` to render the new node type
4. Define default parameters and behavior

### Custom Audio Processing

Modify `AudioManager.ts` to add new audio analysis features:
- Beat detection
- Frequency band analysis
- Multiple audio sources

### Advanced Effects

The system is designed for extensibility:
- Post-processing effects
- Complex material systems
- Animation systems
- Physics integration

## License

This project is provided as a technical demonstration. Feel free to use and modify for your projects.
