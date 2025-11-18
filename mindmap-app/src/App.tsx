import { useEffect } from 'react';
import { MindMapProvider, useMindMap } from './context/MindMapContext';
import { Toolbar } from './components/Toolbar/Toolbar';
import { Canvas } from './components/Canvas/Canvas';
import { SidePanel } from './components/SidePanel/SidePanel';

function AppContent() {
  const { mindMap } = useMindMap();
  const isDark = mindMap.theme === 'dark';

  // HTMLタグのdarkクラスを動的に制御
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // デバッグ用ログ
    console.log('Theme changed to:', mindMap.theme, 'isDark:', isDark, 'HTML has dark class:', html.classList.contains('dark'));
  }, [isDark, mindMap.theme]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
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
