import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useMindMap } from '../../context/MindMapContext';

// Popular icons selection
const AVAILABLE_ICONS = [
  'Lightbulb', 'Star', 'Heart', 'Zap', 'Sparkles', 'Award', 'Target', 'Flag',
  'BookOpen', 'FileText', 'Folder', 'File', 'Database', 'Server', 'Cloud', 'HardDrive',
  'Users', 'User', 'UserPlus', 'UserCheck', 'Mail', 'MessageSquare', 'Phone', 'Video',
  'Calendar', 'Clock', 'Timer', 'AlarmClock', 'TrendingUp', 'TrendingDown', 'BarChart', 'PieChart',
  'CheckCircle', 'XCircle', 'AlertCircle', 'Info', 'HelpCircle', 'AlertTriangle',
  'Settings', 'Tool', 'Wrench', 'Code', 'Terminal', 'GitBranch', 'Github', 'Globe',
  'Home', 'MapPin', 'Navigation', 'Compass', 'Map', 'Briefcase', 'ShoppingCart', 'CreditCard',
  'Tag', 'Bookmark', 'Link', 'Lock', 'Unlock', 'Key', 'Shield', 'Eye',
] as const;

interface IconPickerProps {
  selectedIcon?: string;
  onIconSelect: (iconName: string | undefined) => void;
}

export function IconPicker({ selectedIcon, onIconSelect }: IconPickerProps) {
  const { t } = useTranslation();
  const { mindMap } = useMindMap();
  const isDark = mindMap.theme === 'dark';

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = AVAILABLE_ICONS.filter((iconName) =>
    iconName.toLowerCase().includes(search.toLowerCase())
  );

  const getIconComponent = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;
    return IconComponent;
  };

  return (
    <>
      <div className="space-y-2">
        <label className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('icon')}
        </label>

        <div className="flex gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className={`flex-1 px-3 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2 ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {selectedIcon ? (
              <>
                {(() => {
                  const IconComponent = getIconComponent(selectedIcon);
                  return <IconComponent size={16} />;
                })()}
                <span>{selectedIcon}</span>
              </>
            ) : (
              t('selectIcon')
            )}
          </button>

          {selectedIcon && (
            <button
              onClick={() => onIconSelect(undefined)}
              className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
              title={t('removeIcon')}
            >
              <Icons.X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => {
            setIsOpen(false);
            setSearch('');
          }}
        >
          {/* 背景オーバーレイ */}
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />

          {/* モーダルコンテンツ */}
          <div
            className={`relative w-full max-w-2xl mx-4 rounded-lg shadow-2xl ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {t('selectIcon')}
              </h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`p-1 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icons.X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4">
              <input
                type="text"
                placeholder={t('searchIcons')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Icons Grid */}
            <div className="px-4 pb-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-8 gap-2">
                {filteredIcons.map((iconName) => {
                  const IconComponent = getIconComponent(iconName);
                  return (
                    <button
                      key={iconName}
                      onClick={() => {
                        onIconSelect(iconName);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`p-3 rounded-lg transition-all ${
                        selectedIcon === iconName
                          ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                          : isDark
                          ? 'hover:bg-gray-700 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      title={iconName}
                    >
                      <IconComponent size={24} className="mx-auto" />
                    </button>
                  );
                })}
              </div>
              {filteredIcons.length === 0 && (
                <div className={`text-center py-8 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {t('noIconsFound')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
