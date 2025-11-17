interface ColorPickerProps {
  selectedColor: string;
  selectedTextColor: string;
  onColorChange: (bg: string, text: string) => void;
  colors: Array<{ name: string; bg: string; text: string }>;
}

export function ColorPicker({ selectedColor, selectedTextColor, onColorChange, colors }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-600">Color</label>
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorChange(color.bg, color.text)}
            className={`w-full h-10 rounded border-2 transition-all hover:scale-105 ${
              selectedColor === color.bg
                ? 'border-blue-500 ring-2 ring-blue-200'
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
