import { MindMapNode } from '../../types';

interface ConnectionProps {
  from: MindMapNode;
  to: MindMapNode;
  color: string;
  width: number;
  style: 'curved' | 'straight' | 'angled';
}

export function Connection({ from, to, color, width, style }: ConnectionProps) {
  const startX = from.x;
  const startY = from.y;
  const endX = to.x;
  const endY = to.y;

  let path = '';

  if (style === 'curved') {
    // Bezier curve
    const controlPointOffset = Math.abs(endX - startX) / 2;
    const cp1x = startX + controlPointOffset;
    const cp1y = startY;
    const cp2x = endX - controlPointOffset;
    const cp2y = endY;

    path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
  } else if (style === 'straight') {
    // Straight line
    path = `M ${startX} ${startY} L ${endX} ${endY}`;
  } else {
    // Angled line (right angle)
    const midX = (startX + endX) / 2;
    path = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
  }

  return (
    <path
      d={path}
      stroke={color}
      strokeWidth={width}
      fill="none"
      className="pointer-events-none"
    />
  );
}
