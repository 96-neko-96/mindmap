import html2canvas from 'html2canvas';
import type { MindMap } from '../types/index';

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
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: options?.backgroundColor || '#ffffff',
      scale: options?.scale || 2,
      useCORS: true,
      logging: false,
    });

    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  } catch (error) {
    console.error('PNG export failed:', error);
    throw error;
  }
}

/**
 * Export canvas to SVG
 */
export async function exportToSVG(
  svgElement: SVGSVGElement,
  filename: string
): Promise<void> {
  try {
    // Clone SVG to avoid modifying original
    const clonedSVG = svgElement.cloneNode(true) as SVGSVGElement;

    // Get bounding box to determine SVG size
    const bbox = svgElement.getBBox();
    const padding = 50;

    // Set viewBox to include all content with padding
    clonedSVG.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`);
    clonedSVG.setAttribute('width', `${bbox.width + padding * 2}`);
    clonedSVG.setAttribute('height', `${bbox.height + padding * 2}`);
    clonedSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Serialize SVG to string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSVG);

    // Create blob and download
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
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
