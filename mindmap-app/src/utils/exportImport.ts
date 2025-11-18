import domtoimage from 'dom-to-image-more';
import type { MindMap, MindMapNode } from '../types/index';

/**
 * Export mindmap to JSON file
 */
export async function exportToJSON(mindMap: MindMap): Promise<void> {
  const jsonString = JSON.stringify(mindMap, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${mindMap.name}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import mindmap from JSON file
 */
export async function importFromJSON(file: File): Promise<MindMap> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const mindMap = JSON.parse(content) as MindMap;

        // Validate structure
        if (!mindMap.id || !mindMap.nodes || !mindMap.rootNodeId) {
          throw new Error('Invalid mindmap format');
        }

        // Validate root node exists
        if (!mindMap.nodes[mindMap.rootNodeId]) {
          throw new Error('Root node not found');
        }

        resolve(mindMap);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Export canvas to PNG image
 */
export async function exportToPNG(
  canvasElement: HTMLElement,
  filename: string,
  options?: {
    backgroundColor?: string;
    scale?: number;
  }
): Promise<void> {
  try {
    // Use dom-to-image-more which supports modern CSS including oklch
    const dataUrl = await domtoimage.toPng(canvasElement, {
      bgcolor: options?.backgroundColor || '#ffffff',
      quality: 1.0,
      width: canvasElement.scrollWidth * (options?.scale || 2),
      height: canvasElement.scrollHeight * (options?.scale || 2),
      style: {
        transform: 'scale(' + (options?.scale || 2) + ')',
        transformOrigin: 'top left',
        width: canvasElement.scrollWidth + 'px',
        height: canvasElement.scrollHeight + 'px'
      }
    });

    // Convert data URL to blob and download
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PNG export failed:', error);
    throw error;
  }
}

/**
 * Generate connection path (same as Connection component)
 */
function generateConnectionPath(
  from: MindMapNode,
  to: MindMapNode,
  style: 'curved' | 'straight' | 'angled'
): string {
  const startX = from.x + from.width / 2;
  const startY = from.y + from.height / 2;
  const endX = to.x + to.width / 2;
  const endY = to.y + to.height / 2;

  if (style === 'straight') {
    return `M ${startX},${startY} L ${endX},${endY}`;
  } else if (style === 'angled') {
    const midX = (startX + endX) / 2;
    return `M ${startX},${startY} L ${midX},${startY} L ${midX},${endY} L ${endX},${endY}`;
  } else {
    // curved (default)
    const dx = endX - startX;
    const controlPointOffset = Math.abs(dx) * 0.5;

    const cp1x = startX + controlPointOffset;
    const cp1y = startY;
    const cp2x = endX - controlPointOffset;
    const cp2y = endY;

    return `M ${startX},${startY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;
  }
}

/**
 * Export mindmap to SVG (complete with nodes and connections)
 */
export async function exportToSVG(
  mindMap: MindMap,
  filename: string
): Promise<void> {
  try {
    // Calculate bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    Object.values(mindMap.nodes).forEach(node => {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + node.width);
      maxY = Math.max(maxY, node.y + node.height);
    });

    const padding = 50;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;
    const offsetX = -minX + padding;
    const offsetY = -minY + padding;

    // Create SVG
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${mindMap.theme === 'dark' ? '#111827' : '#f9fafb'}"/>

  <!-- Connections -->
  <g id="connections">
`;

    // Draw connections
    Object.values(mindMap.nodes).forEach(node => {
      node.children.forEach(childId => {
        const childNode = mindMap.nodes[childId];
        if (childNode) {
          const path = generateConnectionPath(
            { ...node, x: node.x + offsetX, y: node.y + offsetY } as MindMapNode,
            { ...childNode, x: childNode.x + offsetX, y: childNode.y + offsetY } as MindMapNode,
            mindMap.connectionStyle
          );
          svgContent += `    <path d="${path}" stroke="${mindMap.connectionColor}" stroke-width="${mindMap.connectionWidth}" fill="none" stroke-linecap="round"/>\n`;
        }
      });
    });

    svgContent += `  </g>

  <!-- Nodes -->
  <g id="nodes">
`;

    // Draw nodes
    Object.values(mindMap.nodes).forEach(node => {
      const x = node.x + offsetX;
      const y = node.y + offsetY;
      const borderRadius = node.shape === 'ellipse'
        ? Math.min(node.width, node.height) / 2
        : node.shape === 'rounded' ? 8 : 0;

      // Node background
      if (node.shape === 'ellipse') {
        svgContent += `    <ellipse cx="${x + node.width / 2}" cy="${y + node.height / 2}" rx="${node.width / 2}" ry="${node.height / 2}" fill="${node.color}" stroke="${node.borderColor || '#000000'}" stroke-width="${node.borderWidth}" stroke-dasharray="${node.borderStyle === 'dashed' ? '5,5' : '0'}"/>\n`;
      } else {
        svgContent += `    <rect x="${x}" y="${y}" width="${node.width}" height="${node.height}" rx="${borderRadius}" fill="${node.color}" stroke="${node.borderColor || '#000000'}" stroke-width="${node.borderWidth}" stroke-dasharray="${node.borderStyle === 'dashed' ? '5,5' : '0'}"/>\n`;
      }

      // Text (simplified - SVG text handling is complex)
      const textX = x + node.width / 2;
      const textY = y + node.height / 2;
      const fontSize = node.fontSize || 14;

      svgContent += `    <text x="${textX}" y="${textY}" font-size="${fontSize}" font-weight="${node.fontWeight}" font-style="${node.fontStyle}" fill="${node.textColor}" text-anchor="middle" dominant-baseline="middle">${escapeXml(node.text)}</text>\n`;
    });

    svgContent += `  </g>
</svg>`;

    // Create blob and download
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('SVG export failed:', error);
    throw error;
  }
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
