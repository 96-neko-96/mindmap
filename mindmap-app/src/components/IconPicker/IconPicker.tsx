import { useState } from 'react';
import * as Icons from 'lucide-react';

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
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-600">Icon</label>

      <div className="flex gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors flex items-center justify-center gap-2"
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
            'Select Icon'
          )}
        </button>

        {selectedIcon && (
          <button
            onClick={() => onIconSelect(undefined)}
            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
            title="Remove icon"
          >
            <Icons.X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="border border-gray-300 rounded-lg p-3 bg-white shadow-lg max-h-64 overflow-y-auto">
          <input
            type="text"
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-6 gap-2">
            {filteredIcons.map((iconName) => {
              const IconComponent = getIconComponent(iconName);
              return (
                <button
                  key={iconName}
                  onClick={() => {
                    onIconSelect(iconName);
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                    selectedIcon === iconName ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                  }`}
                  title={iconName}
                >
                  <IconComponent size={20} className="mx-auto" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
