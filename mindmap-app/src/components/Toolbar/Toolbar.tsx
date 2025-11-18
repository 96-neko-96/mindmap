import { useState } from 'react';
import { useMindMap } from '../../context/MindMapContext';
import { useTranslation } from '../../hooks/useTranslation';
import { CONNECTION_COLORS } from '../../utils/constants';
import * as Icons from 'lucide-react';

export function Toolbar() {
  const { mindMap, viewState, setViewState, dispatch } = useMindMap();
  const { t } = useTranslation();
  const [showConnectionPanel, setShowConnectionPanel] = useState(false);

  const handleZoomIn = () => {
    setViewState((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 0.1, 2) }));
  };

  const handleZoomOut = () => {
    setViewState((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 0.1, 0.5) }));
  };

  const handleResetView = () => {
    setViewState({ zoom: 1, panX: 0, panY: 0, selectedNodeId: null });
  };

  const handleThemeToggle = () => {
    dispatch({
      type: 'SET_THEME',
      payload: { theme: mindMap.theme === 'light' ? 'dark' : 'light' },
    });
  };

  const handleLanguageToggle = () => {
    dispatch({
      type: 'SET_LANGUAGE',
      payload: { language: mindMap.language === 'ja' ? 'en' : 'ja' },
    });
  };

  const updateConnection = (updates: {
    connectionStyle?: 'curved' | 'straight' | 'angled';
    connectionColor?: string;
    connectionWidth?: number;
  }) => {
    dispatch({
      type: 'UPDATE_CONNECTION',
      payload: updates,
    });
  };

  const isDark = mindMap.theme === 'dark';

  return (
    <div className={`h-14 border-b flex items-center justify-between px-4 shadow-sm transition-colors ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Icons.Brain className={`${isDark ? 'text-blue-400' : 'text-blue-500'}`} size={24} />
          <h1 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            {mindMap.name}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Connection Line Settings */}
        <div className="relative">
          <button
            onClick={() => setShowConnectionPanel(!showConnectionPanel)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title={t('connectionSettings')}
          >
            <Icons.GitBranch size={16} />
            {t('lines')}
          </button>

          {showConnectionPanel && (
            <div className={`absolute right-0 top-12 p-4 rounded-lg shadow-xl border z-50 w-64 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {t('style')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['curved', 'straight', 'angled'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateConnection({ connectionStyle: style })}
                        className={`px-2 py-1.5 text-xs rounded transition-all ${
                          mindMap.connectionStyle === style
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
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {t('color')}
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {CONNECTION_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateConnection({ connectionColor: color })}
                        className={`w-8 h-8 rounded border-2 transition-all ${
                          mindMap.connectionColor === color
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {t('width')}: {mindMap.connectionWidth}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={mindMap.connectionWidth}
                    onChange={(e) => updateConnection({ connectionWidth: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={() => setShowConnectionPanel(false)}
                  className={`w-full px-3 py-1.5 rounded text-xs transition-colors ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {t('close')}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-300"></div>

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
        </button>

        {/* Language Toggle */}
        <button
          onClick={handleLanguageToggle}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          title="Toggle Language"
        >
          <Icons.Languages size={16} />
          {mindMap.language === 'ja' ? '日本語' : 'English'}
        </button>

        <div className="w-px h-8 bg-gray-300"></div>

        {/* Zoom Controls */}
        <button
          onClick={handleZoomOut}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          title="Zoom Out"
        >
          <Icons.ZoomOut size={16} />
        </button>
        <span className={`text-sm min-w-[60px] text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {Math.round(viewState.zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          title="Zoom In"
        >
          <Icons.ZoomIn size={16} />
        </button>

        <button
          onClick={handleResetView}
          className="ml-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors flex items-center gap-2"
          title={t('resetView')}
        >
          <Icons.Maximize2 size={16} />
          {t('reset')}
        </button>
      </div>
    </div>
  );
}
