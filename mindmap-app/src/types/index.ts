// Node type definition
export interface MindMapNode {
  id: string;              // Unique ID
  text: string;            // Display text
  x: number;               // X coordinate
  y: number;               // Y coordinate
  width: number;           // Node width
  height: number;          // Node height
  parentId: string | null; // Parent node ID
  children: string[];      // Array of child node IDs

  // Style
  color: string;           // Background color
  textColor: string;       // Text color
  fontSize: number;        // Font size
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  shape: 'rectangle' | 'rounded' | 'ellipse';
  borderStyle: 'solid' | 'dashed';
  borderWidth: number;

  // Icon (for future phases)
  icon?: string;           // lucide-react icon name
  iconPosition?: 'before' | 'after';

  // Content (for future phases)
  note?: string;           // Detailed notes
  tags?: string[];         // Array of tags
  image?: string;          // Base64 image data

  // State
  collapsed?: boolean;     // Collapse state
}

// MindMap overall type definition
export interface MindMap {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  nodes: { [id: string]: MindMapNode };
  rootNodeId: string;

  // Settings
  theme: 'light' | 'dark';
  colorScheme: string;
  defaultNodeColor: string;
  connectionStyle: 'curved' | 'straight' | 'angled';
  connectionColor: string;
  connectionWidth: number;
}

// Action types for reducer
export type MindMapAction =
  | { type: 'ADD_NODE'; payload: { parentId: string; node: Partial<MindMapNode> } }
  | { type: 'UPDATE_NODE'; payload: { id: string; updates: Partial<MindMapNode> } }
  | { type: 'DELETE_NODE'; payload: { id: string } }
  | { type: 'MOVE_NODE'; payload: { id: string; x: number; y: number } }
  | { type: 'SELECT_NODE'; payload: { id: string | null } }
  | { type: 'UPDATE_CONNECTION'; payload: { connectionStyle?: string; connectionColor?: string; connectionWidth?: number } }
  | { type: 'SET_THEME'; payload: { theme: 'light' | 'dark' } }
  | { type: 'LOAD_MINDMAP'; payload: { mindMap: MindMap } };

// View state
export interface ViewState {
  zoom: number;
  panX: number;
  panY: number;
  selectedNodeId: string | null;
}
