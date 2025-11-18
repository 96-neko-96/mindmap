import { useState, useRef, useEffect } from 'react';
import type { MindMapNode } from '../../types/index';
import { useMindMap } from '../../context/MindMapContext';
import * as Icons from 'lucide-react';

interface NodeProps {
  node: MindMapNode;
  onDragStart: (nodeId: string, x: number, y: number) => void;
}

export function Node({ node, onDragStart }: NodeProps) {
  const { viewState, setViewState, dispatch } = useMindMap();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(node.text);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSelected = viewState.selectedNodeId === node.id;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;

    e.stopPropagation();
    setViewState((prev) => ({ ...prev, selectedNodeId: node.id }));

    // Start drag
    onDragStart(node.id, e.clientX, e.clientY);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    if (editText !== node.text) {
      dispatch({
        type: 'UPDATE_NODE',
        payload: {
          id: node.id,
          updates: { text: editText },
        },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditComplete();
    } else if (e.key === 'Escape') {
      setEditText(node.text);
      setIsEditing(false);
    }
  };

  const borderRadius = node.shape === 'rounded' ? '8px' : node.shape === 'ellipse' ? '50%' : '0px';

  const getIconComponent = (iconName: string | undefined) => {
    if (!iconName) return null;
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;
    return IconComponent ? <IconComponent size={node.fontSize} className="flex-shrink-0" /> : null;
  };

  return (
    <div
      className="absolute cursor-move select-none animate-fadeIn"
      style={{
        left: node.x - node.width / 2,
        top: node.y - node.height / 2,
        width: node.width,
        height: node.height,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className="w-full h-full flex items-center justify-center px-4 py-2 shadow-md transition-all duration-200 hover:shadow-lg"
        style={{
          backgroundColor: node.color,
          color: node.textColor,
          borderRadius,
          borderWidth: node.borderWidth,
          borderStyle: node.borderStyle,
          borderColor: isSelected ? '#3b82f6' : (node.borderColor || '#000000'),
          boxShadow: isSelected
            ? '0 0 0 3px rgba(59, 130, 246, 0.3)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditComplete}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent outline-none text-center"
            style={{
              fontSize: node.fontSize,
              fontFamily: node.fontFamily || 'system-ui, -apple-system, sans-serif',
              fontWeight: node.fontWeight,
              fontStyle: node.fontStyle,
              color: node.textColor,
            }}
          />
        ) : (
          <div
            className="flex items-center justify-center gap-2 break-words"
            style={{
              fontSize: node.fontSize,
              fontFamily: node.fontFamily || 'system-ui, -apple-system, sans-serif',
              fontWeight: node.fontWeight,
              fontStyle: node.fontStyle,
            }}
          >
            {node.icon && node.iconPosition === 'before' && getIconComponent(node.icon)}
            <span className="text-center">{node.text}</span>
            {node.icon && node.iconPosition === 'after' && getIconComponent(node.icon)}
          </div>
        )}
      </div>
    </div>
  );
}
