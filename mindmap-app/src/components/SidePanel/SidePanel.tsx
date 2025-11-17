import { useState } from 'react';
import { useMindMap } from '../../context/MindMapContext';
import { ColorPicker } from '../ColorPicker/ColorPicker';
import { IconPicker } from '../IconPicker/IconPicker';
import { PRESET_COLORS, NODE_SIZES, FONT_SIZES } from '../../utils/constants';
import * as Icons from 'lucide-react';

export function SidePanel() {
  const { mindMap, viewState, dispatch } = useMindMap();
  const [activeTab, setActiveTab] = useState<'style' | 'info'>('style');

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

  const updateNodeStyle = (updates: Record<string, unknown>) => {
    if (viewState.selectedNodeId) {
      dispatch({
        type: 'UPDATE_NODE',
        payload: {
          id: viewState.selectedNodeId,
          updates,
        },
      });
    }
  };

  const isDark = mindMap.theme === 'dark';

  return (
    <div className={`w-80 border-l flex flex-col shadow-sm transition-colors ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Node Properties</h2>

        {selectedNode && (
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('style')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'style'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Style
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'info'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Info
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedNode ? (
          <div className="space-y-4">
            {activeTab === 'style' ? (
              <>
                {/* Color Picker */}
                <ColorPicker
                  selectedColor={selectedNode.color}
                  selectedTextColor={selectedNode.textColor}
                  onColorChange={(bg, text) => updateNodeStyle({ color: bg, textColor: text })}
                  colors={PRESET_COLORS}
                />

                {/* Shape Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">Shape</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['rectangle', 'rounded', 'ellipse'] as const).map((shape) => (
                      <button
                        key={shape}
                        onClick={() => updateNodeStyle({ shape })}
                        className={`px-3 py-2 text-xs font-medium rounded transition-all ${
                          selectedNode.shape === shape
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {shape.charAt(0).toUpperCase() + shape.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(NODE_SIZES).map(([size, dimensions]) => (
                      <button
                        key={size}
                        onClick={() => updateNodeStyle(dimensions)}
                        className={`px-3 py-2 text-xs font-medium rounded transition-all ${
                          selectedNode.width === dimensions.width
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size.charAt(0).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">Font Size</label>
                  <select
                    value={selectedNode.fontSize}
                    onChange={(e) => updateNodeStyle({ fontSize: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {FONT_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}px
                      </option>
                    ))}
                  </select>
                </div>

                {/* Text Styling */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">Text Style</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateNodeStyle({
                        fontWeight: selectedNode.fontWeight === 'bold' ? 'normal' : 'bold'
                      })}
                      className={`flex-1 px-3 py-2 text-xs font-bold rounded transition-all ${
                        selectedNode.fontWeight === 'bold'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icons.Bold size={16} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => updateNodeStyle({
                        fontStyle: selectedNode.fontStyle === 'italic' ? 'normal' : 'italic'
                      })}
                      className={`flex-1 px-3 py-2 text-xs italic rounded transition-all ${
                        selectedNode.fontStyle === 'italic'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icons.Italic size={16} className="mx-auto" />
                    </button>
                  </div>
                </div>

                {/* Border Style */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">Border</label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {(['solid', 'dashed'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateNodeStyle({ borderStyle: style })}
                        className={`px-3 py-2 text-xs font-medium rounded transition-all ${
                          selectedNode.borderStyle === style
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={selectedNode.borderWidth}
                    onChange={(e) => updateNodeStyle({ borderWidth: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-center">
                    Width: {selectedNode.borderWidth}px
                  </div>
                </div>

                {/* Icon Picker */}
                <IconPicker
                  selectedIcon={selectedNode.icon}
                  onIconSelect={(icon) => updateNodeStyle({ icon })}
                />

                {selectedNode.icon && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">Icon Position</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['before', 'after'] as const).map((position) => (
                        <button
                          key={position}
                          onClick={() => updateNodeStyle({ iconPosition: position })}
                          className={`px-3 py-2 text-xs font-medium rounded transition-all ${
                            selectedNode.iconPosition === position
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {position.charAt(0).toUpperCase() + position.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Info Tab */}
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
              </>
            )}

            <div className="pt-4 space-y-2 border-t border-gray-200">
              <button
                onClick={handleAddChild}
                className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Icons.Plus size={16} />
                Add Child Node
              </button>

              {selectedNode.id !== mindMap.rootNodeId && (
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Icons.Trash2 size={16} />
                  Delete Node
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm mt-8">
            <Icons.MousePointerClick size={48} className="mx-auto mb-4 text-gray-400" />
            <p>Select a node to customize its appearance</p>
          </div>
        )}
      </div>
    </div>
  );
}
