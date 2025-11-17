import { useMindMap } from '../../context/MindMapContext';

export function SidePanel() {
  const { mindMap, viewState, dispatch } = useMindMap();

  const selectedNode = viewState.selectedNodeId
    ? mindMap.nodes[viewState.selectedNodeId]
    : null;

  const handleAddChild = () => {
    if (viewState.selectedNodeId) {
      dispatch({
        type: 'ADD_NODE',
        payload: {
          parentId: viewState.selectedNodeId,
          node: {},
        },
      });
    }
  };

  const handleDelete = () => {
    if (viewState.selectedNodeId && viewState.selectedNodeId !== mindMap.rootNodeId) {
      dispatch({
        type: 'DELETE_NODE',
        payload: { id: viewState.selectedNodeId },
      });
    }
  };

  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">Node Properties</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedNode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Node ID
              </label>
              <p className="text-sm text-gray-800 font-mono bg-gray-50 px-2 py-1 rounded">
                {selectedNode.id}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Text
              </label>
              <p className="text-sm text-gray-800 bg-gray-50 px-2 py-1 rounded">
                {selectedNode.text}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Position
              </label>
              <p className="text-sm text-gray-800 bg-gray-50 px-2 py-1 rounded">
                X: {Math.round(selectedNode.x)}, Y: {Math.round(selectedNode.y)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Children
              </label>
              <p className="text-sm text-gray-800 bg-gray-50 px-2 py-1 rounded">
                {selectedNode.children.length} node(s)
              </p>
            </div>

            <div className="pt-4 space-y-2 border-t border-gray-200">
              <button
                onClick={handleAddChild}
                className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
              >
                Add Child Node
              </button>

              {selectedNode.id !== mindMap.rootNodeId && (
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
                >
                  Delete Node
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm mt-8">
            Select a node to view its properties
          </div>
        )}
      </div>
    </div>
  );
}
