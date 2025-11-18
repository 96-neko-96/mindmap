import { MindMapProvider, useMindMap } from './context/MindMapContext';
import { Toolbar } from './components/Toolbar/Toolbar';
import { Canvas } from './components/Canvas/Canvas';
import { SidePanel } from './components/SidePanel/SidePanel';

function AppContent() {
  const { mindMap } = useMindMap();
  const isDark = mindMap.theme === 'dark';

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <Canvas />
        <SidePanel />
      </div>
    </div>
  );
}

function App() {
  return (
    <MindMapProvider>
      <AppContent />
    </MindMapProvider>
  );
}

export default App;
