import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { MindMap, MindMapNode, MindMapAction, ViewState } from '../types';

// Initial state
const createInitialNode = (): MindMapNode => ({
  id: 'root',
  text: 'Central Idea',
  x: 600,
  y: 400,
  width: 200,
  height: 60,
  parentId: null,
  children: [],
  color: '#3b82f6',
  textColor: '#ffffff',
  fontSize: 16,
  fontWeight: 'bold',
  fontStyle: 'normal',
  shape: 'rounded',
  borderStyle: 'solid',
  borderWidth: 2,
});

const createInitialMindMap = (): MindMap => {
  const rootNode = createInitialNode();
  return {
    id: 'mindmap-1',
    name: 'My MindMap',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: {
      [rootNode.id]: rootNode,
    },
    rootNodeId: 'root',
    theme: 'light',
    colorScheme: 'default',
    defaultNodeColor: '#e0e7ff',
    connectionStyle: 'curved',
    connectionColor: '#94a3b8',
    connectionWidth: 2,
  };
};

const initialViewState: ViewState = {
  zoom: 1,
  panX: 0,
  panY: 0,
  selectedNodeId: null,
};

interface MindMapContextType {
  mindMap: MindMap;
  viewState: ViewState;
  dispatch: React.Dispatch<MindMapAction>;
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
}

const MindMapContext = createContext<MindMapContextType | undefined>(undefined);

// Reducer function
function mindMapReducer(state: MindMap, action: MindMapAction): MindMap {
  switch (action.type) {
    case 'ADD_NODE': {
      const { parentId, node } = action.payload;
      const newNodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const parentNode = state.nodes[parentId];
      if (!parentNode) return state;

      // Calculate position for new node
      const childCount = parentNode.children.length;
      const angle = (childCount * Math.PI) / 4;
      const distance = 250;
      const newX = parentNode.x + Math.cos(angle) * distance;
      const newY = parentNode.y + Math.sin(angle) * distance;

      const newNode: MindMapNode = {
        id: newNodeId,
        text: node.text || 'New Idea',
        x: newX,
        y: newY,
        width: node.width || 150,
        height: node.height || 50,
        parentId,
        children: [],
        color: node.color || state.defaultNodeColor,
        textColor: node.textColor || '#1f2937',
        fontSize: node.fontSize || 14,
        fontWeight: node.fontWeight || 'normal',
        fontStyle: node.fontStyle || 'normal',
        shape: node.shape || 'rounded',
        borderStyle: node.borderStyle || 'solid',
        borderWidth: node.borderWidth || 1,
      };

      return {
        ...state,
        nodes: {
          ...state.nodes,
          [newNodeId]: newNode,
          [parentId]: {
            ...parentNode,
            children: [...parentNode.children, newNodeId],
          },
        },
        updatedAt: new Date().toISOString(),
      };
    }

    case 'UPDATE_NODE': {
      const { id, updates } = action.payload;
      const node = state.nodes[id];
      if (!node) return state;

      return {
        ...state,
        nodes: {
          ...state.nodes,
          [id]: { ...node, ...updates },
        },
        updatedAt: new Date().toISOString(),
      };
    }

    case 'DELETE_NODE': {
      const { id } = action.payload;
      const node = state.nodes[id];
      if (!node || id === state.rootNodeId) return state;

      // Remove from parent's children
      const newNodes = { ...state.nodes };
      if (node.parentId) {
        const parent = newNodes[node.parentId];
        if (parent) {
          newNodes[node.parentId] = {
            ...parent,
            children: parent.children.filter((childId) => childId !== id),
          };
        }
      }

      // Delete node and all its children recursively
      const deleteNodeRecursive = (nodeId: string) => {
        const nodeToDelete = newNodes[nodeId];
        if (nodeToDelete) {
          nodeToDelete.children.forEach(deleteNodeRecursive);
          delete newNodes[nodeId];
        }
      };
      deleteNodeRecursive(id);

      return {
        ...state,
        nodes: newNodes,
        updatedAt: new Date().toISOString(),
      };
    }

    case 'MOVE_NODE': {
      const { id, x, y } = action.payload;
      const node = state.nodes[id];
      if (!node) return state;

      return {
        ...state,
        nodes: {
          ...state.nodes,
          [id]: { ...node, x, y },
        },
        updatedAt: new Date().toISOString(),
      };
    }

    case 'UPDATE_CONNECTION': {
      const { connectionStyle, connectionColor, connectionWidth } = action.payload;
      return {
        ...state,
        ...(connectionStyle && { connectionStyle: connectionStyle as 'curved' | 'straight' | 'angled' }),
        ...(connectionColor && { connectionColor }),
        ...(connectionWidth !== undefined && { connectionWidth }),
        updatedAt: new Date().toISOString(),
      };
    }

    case 'SET_THEME': {
      const { theme } = action.payload;
      return {
        ...state,
        theme,
        updatedAt: new Date().toISOString(),
      };
    }

    case 'LOAD_MINDMAP': {
      return action.payload.mindMap;
    }

    default:
      return state;
  }
}

// Provider component
export function MindMapProvider({ children }: { children: ReactNode }) {
  const [mindMap, dispatch] = useReducer(mindMapReducer, null, createInitialMindMap);
  const [viewState, setViewState] = React.useState<ViewState>(initialViewState);

  return (
    <MindMapContext.Provider value={{ mindMap, viewState, dispatch, setViewState }}>
      {children}
    </MindMapContext.Provider>
  );
}

// Custom hook to use the context
export function useMindMap() {
  const context = useContext(MindMapContext);
  if (!context) {
    throw new Error('useMindMap must be used within a MindMapProvider');
  }
  return context;
}
