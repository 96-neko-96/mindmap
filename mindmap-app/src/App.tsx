import { MindMapProvider } from './context/MindMapContext';
import { Toolbar } from './components/Toolbar/Toolbar';
import { Canvas } from './components/Canvas/Canvas';
import { SidePanel } from './components/SidePanel/SidePanel';

function App() {
  return (
    <MindMapProvider>
      <div className="h-screen flex flex-col">
        <Toolbar />
        <div className="flex-1 flex overflow-hidden">
          <Canvas />
          <SidePanel />
        </div>
      </div>
    </MindMapProvider>
  );
}

export default App;
