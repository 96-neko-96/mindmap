import { useTranslation } from '../../hooks/useTranslation';
import { useMindMap } from '../../context/MindMapContext';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (bg: string, text: string) => void;
  colors: Array<{ name: string; bg: string; text: string }>;
}

export function ColorPicker({ selectedColor, onColorChange, colors }: ColorPickerProps) {
  const { t } = useTranslation();
  const { mindMap } = useMindMap();
  const isDark = mindMap.theme === 'dark';

  return (
    <div className="space-y-2">
      <label className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {t('color')}
      </label>
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorChange(color.bg, color.text)}
            className={`w-full h-10 rounded border-2 transition-all hover:scale-105 ${
              selectedColor === color.bg
                ? 'border-blue-500 ring-2 ring-blue-200'
                : isDark
                ? 'border-gray-600'
                : 'border-gray-300'
            }`}
            style={{ backgroundColor: color.bg }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          >
            {selectedColor === color.bg && (
              <span className="text-xs" style={{ color: color.text }}>✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
