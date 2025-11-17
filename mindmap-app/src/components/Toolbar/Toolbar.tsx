import { useMindMap } from '../../context/MindMapContext';

export function Toolbar() {
  const { mindMap, viewState, setViewState } = useMindMap();

  const handleZoomIn = () => {
    setViewState((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 0.1, 2) }));
  };

  const handleZoomOut = () => {
    setViewState((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 0.1, 0.5) }));
  };

  const handleResetView = () => {
    setViewState({ zoom: 1, panX: 0, panY: 0, selectedNodeId: null });
  };

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-800">{mindMap.name}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleZoomOut}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
          title="Zoom Out"
        >
          −
        </button>
        <span className="text-sm text-gray-600 min-w-[60px] text-center">
          {Math.round(viewState.zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleResetView}
          className="ml-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
          title="Reset View"
        >
          Reset View
        </button>
      </div>
    </div>
  );
}
