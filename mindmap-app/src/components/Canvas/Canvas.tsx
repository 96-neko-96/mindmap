import { useRef, useState, useEffect } from 'react';
import { useMindMap } from '../../context/MindMapContext';
import { Node } from '../Node/Node';
import { Connection } from '../Connection/Connection';

export function Canvas() {
  const { mindMap, viewState, setViewState, dispatch } = useMindMap();
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Handle node drag start
  const handleNodeDragStart = (nodeId: string, clientX: number, clientY: number) => {
    const node = mindMap.nodes[nodeId];
    if (!node) return;

    setIsDraggingNode(true);
    setDraggingNodeId(nodeId);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const canvasX = (clientX - rect.left - viewState.panX) / viewState.zoom;
      const canvasY = (clientY - rect.top - viewState.panY) / viewState.zoom;
      setDragOffset({
        x: canvasX - node.x,
        y: canvasY - node.y,
      });
    }
  };

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingNode && draggingNodeId && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left - viewState.panX) / viewState.zoom;
        const canvasY = (e.clientY - rect.top - viewState.panY) / viewState.zoom;

        const newX = canvasX - dragOffset.x;
        const newY = canvasY - dragOffset.y;

        dispatch({
          type: 'MOVE_NODE',
          payload: { id: draggingNodeId, x: newX, y: newY },
        });
      } else if (isPanning) {
        const deltaX = e.clientX - panStart.x;
        const deltaY = e.clientY - panStart.y;

        setViewState((prev) => ({
          ...prev,
          panX: prev.panX + deltaX,
          panY: prev.panY + deltaY,
        }));

        setPanStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingNode(false);
      setDraggingNodeId(null);
      setIsPanning(false);
    };

    if (isDraggingNode || isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingNode, draggingNodeId, dragOffset, isPanning, panStart, viewState, dispatch, setViewState]);

  // Handle canvas mouse down (for panning)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && e.target === canvasRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setViewState((prev) => ({ ...prev, selectedNodeId: null }));
    }
  };

  // Handle wheel for zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const newZoom = Math.max(0.5, Math.min(2, viewState.zoom + delta));

    setViewState((prev) => ({ ...prev, zoom: newZoom }));
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewState.selectedNodeId) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (viewState.selectedNodeId !== mindMap.rootNodeId) {
            dispatch({
              type: 'DELETE_NODE',
              payload: { id: viewState.selectedNodeId },
            });
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          dispatch({
            type: 'ADD_NODE',
            payload: {
              parentId: viewState.selectedNodeId,
              node: {},
            },
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewState.selectedNodeId, mindMap.rootNodeId, dispatch]);

  // Render connections
  const connections: React.JSX.Element[] = [];
  Object.values(mindMap.nodes).forEach((node) => {
    node.children.forEach((childId) => {
      const childNode = mindMap.nodes[childId];
      if (childNode) {
        connections.push(
          <Connection
            key={`${node.id}-${childId}`}
            from={node}
            to={childNode}
            color={mindMap.connectionColor}
            width={mindMap.connectionWidth}
            style={mindMap.connectionStyle}
          />
        );
      }
    });
  });

  return (
    <div
      ref={canvasRef}
      className="flex-1 overflow-hidden relative transition-colors bg-gray-50 dark:bg-gray-900"
      onMouseDown={handleCanvasMouseDown}
      onWheel={handleWheel}
      style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
    >
      <div
        style={{
          transform: `translate(${viewState.panX}px, ${viewState.panY}px) scale(${viewState.zoom})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
        }}
      >
        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          {connections}
        </svg>

        {/* Render nodes */}
        <div className="relative w-full h-full">
          {Object.values(mindMap.nodes).map((node) => (
            <Node key={node.id} node={node} onDragStart={handleNodeDragStart} />
          ))}
        </div>
      </div>
    </div>
  );
}
