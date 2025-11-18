import { useState, useEffect, useRef } from 'react';
import { useMindMap } from '../../context/MindMapContext';
import { useTranslation } from '../../hooks/useTranslation';
import { ColorPicker } from '../ColorPicker/ColorPicker';
import { IconPicker } from '../IconPicker/IconPicker';
import { PRESET_COLORS, NODE_SIZES, FONT_SIZES, FONT_FAMILIES } from '../../utils/constants';
import * as Icons from 'lucide-react';

export function SidePanel() {
  const { mindMap, viewState, dispatch } = useMindMap();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'style' | 'info'>('style');
  const [panelWidth, setPanelWidth] = useState(320); // 初期幅 320px (w-80相当)
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

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

  // リサイズハンドラー
  const handleResizeStart = () => {
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        const newWidth = rect.right - e.clientX;
        // 最小幅250px、最大幅600px
        const clampedWidth = Math.min(Math.max(newWidth, 250), 600);
        setPanelWidth(clampedWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const isDark = mindMap.theme === 'dark';

  return (
    <div
      ref={panelRef}
      className={`border-l flex flex-col shadow-sm transition-colors relative ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
      style={{ width: `${panelWidth}px` }}
    >
      {/* リサイズハンドル */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500 transition-colors ${
          isResizing ? 'bg-blue-500' : ''
        }`}
        onMouseDown={handleResizeStart}
      />
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {t('nodeProperties')}
        </h2>

        {selectedNode && (
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('style')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'style'
                  ? 'bg-blue-500 text-white'
                  : isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('styleTab')}
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'info'
                  ? 'bg-blue-500 text-white'
                  : isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('infoTab')}
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
                  onColorChange={(bg, text) => updateNodeStyle({ color: bg, textColor: text })}
                  colors={PRESET_COLORS}
                />

                {/* Shape Selection */}
                <div className="space-y-2">
                  <label className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('shape')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['rectangle', 'rounded', 'ellipse'] as const).map((shape) => (
                      <button
                        key={shape}
                        onClick={() => updateNodeStyle({ shape })}
                        className={`px-3 py-2 text-xs font-medium rounded transition-all ${
                          selectedNode.shape === shape
                            ? 'bg-blue-500 text-white'
                            : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t(shape)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="space-y-2">
                  <label className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('size')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(NODE_SIZES).map(([size, dimensions]) => (
                      <button
                        key={size}
                        onClick={() => updateNodeStyle(dimensions)}
                        className={`px-3 py-2 text-xs font-medium rounded transition-all ${
                          selectedNode.width === dimensions.width
                            ? 'bg-blue-500 text-white'
                            : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size.charAt(0).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Family */}
                <div className="space-y-2">
                  <label className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('fontFamily')}
                  </label>
                  <select
                    value={selectedNode.fontFamily || FONT_FAMILIES[0].value}
                    onChange={(e) => updateNodeStyle({ fontFamily: e.target.value })}
                    className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-gray-200'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {FONT_FAMILIES.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <label className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('fontSize')}
                  </label>
                  <select
                    value={selectedNode.fontSize}
                    onChange={(e) => updateNodeStyle({ fontSize: Number(e.target.value) })}
                    className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-gray-200'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
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
                  <label className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('textStyle')}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateNodeStyle({
                        fontWeight: selectedNode.fontWeight === 'bold' ? 'normal' : 'bold'
                      })}
                      className={`flex-1 px-3 py-2 text-xs font-bold rounded transition-all ${
                        selectedNode.fontWeight === 'bold'
                          ? 'bg-blue-500 text-white'
                          : isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
                          : isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icons.Italic size={16} className="mx-auto" />
                    </button>
                  </div>
                </div>

                {/* Border Style */}
                <div className="space-y-2">
                  <label className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('border')}
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {(['solid', 'dashed'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateNodeStyle({ borderStyle: style })}
                        className={`px-3 py-2 text-xs font-medium rounded transition-all ${
                          selectedNode.borderStyle === style
                            ? 'bg-blue-500 text-white'
                            : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t(style)}
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
                  <div className={`text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('width')}: {selectedNode.borderWidth}px
                  </div>
                </div>

                {/* Icon Picker */}
                <IconPicker
                  selectedIcon={selectedNode.icon}
                  onIconSelect={(icon) => updateNodeStyle({ icon, iconPosition: icon ? (selectedNode.iconPosition || 'before') : undefined })}
                />

                {selectedNode.icon && (
                  <div className="space-y-2">
                    <label className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t('iconPosition')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['before', 'after'] as const).map((position) => (
                        <button
                          key={position}
                          onClick={() => updateNodeStyle({ iconPosition: position })}
                          className={`px-3 py-2 text-xs font-medium rounded transition-all ${
                            selectedNode.iconPosition === position
                              ? 'bg-blue-500 text-white'
                              : isDark
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {t(position)}
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
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('nodeId')}
                  </label>
                  <p className={`text-sm font-mono px-2 py-1 rounded ${
                    isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-800'
                  }`}>
                    {selectedNode.id}
                  </p>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('text')}
                  </label>
                  <p className={`text-sm px-2 py-1 rounded ${
                    isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-800'
                  }`}>
                    {selectedNode.text}
                  </p>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('position')}
                  </label>
                  <p className={`text-sm px-2 py-1 rounded ${
                    isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-800'
                  }`}>
                    X: {Math.round(selectedNode.x)}, Y: {Math.round(selectedNode.y)}
                  </p>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('children')}
                  </label>
                  <p className={`text-sm px-2 py-1 rounded ${
                    isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-800'
                  }`}>
                    {selectedNode.children.length} node(s)
                  </p>
                </div>
              </>
            )}

            <div className={`pt-4 space-y-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={handleAddChild}
                className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Icons.Plus size={16} />
                {t('addChildNode')}
              </button>

              {selectedNode.id !== mindMap.rootNodeId && (
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Icons.Trash2 size={16} />
                  {t('deleteNode')}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-sm mt-8">
            <Icons.MousePointerClick size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>{t('selectNode')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
