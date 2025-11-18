import type { MindMap, MindMapNode } from '../types/index';

/**
 * Create a blank mindmap template
 */
export function createBlankTemplate(): MindMap {
  const rootNode: MindMapNode = {
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
    borderColor: '#1e40af',
  };

  return {
    id: `mindmap-${Date.now()}`,
    name: 'New MindMap',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: {
      [rootNode.id]: rootNode,
    },
    rootNodeId: 'root',
    theme: 'light',
    language: 'ja',
    colorScheme: 'default',
    defaultNodeColor: '#e0e7ff',
    connectionStyle: 'curved',
    connectionColor: '#94a3b8',
    connectionWidth: 2,
  };
}

/**
 * Create a project planning template
 */
export function createProjectPlanningTemplate(): MindMap {
  const rootNode: MindMapNode = {
    id: 'root',
    text: 'Project Plan',
    x: 600,
    y: 400,
    width: 220,
    height: 70,
    parentId: null,
    children: ['goals', 'timeline', 'resources', 'risks'],
    color: '#8b5cf6',
    textColor: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    shape: 'rounded',
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#6d28d9',
    icon: 'Target',
  };

  const goals: MindMapNode = {
    id: 'goals',
    text: 'Goals',
    x: 400,
    y: 250,
    width: 150,
    height: 50,
    parentId: 'root',
    children: [],
    color: '#10b981',
    textColor: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    shape: 'rounded',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#059669',
    icon: 'Flag',
  };

  const timeline: MindMapNode = {
    id: 'timeline',
    text: 'Timeline',
    x: 800,
    y: 250,
    width: 150,
    height: 50,
    parentId: 'root',
    children: [],
    color: '#3b82f6',
    textColor: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    shape: 'rounded',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#2563eb',
    icon: 'Calendar',
  };

  const resources: MindMapNode = {
    id: 'resources',
    text: 'Resources',
    x: 400,
    y: 550,
    width: 150,
    height: 50,
    parentId: 'root',
    children: [],
    color: '#f59e0b',
    textColor: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    shape: 'rounded',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#d97706',
    icon: 'Users',
  };

  const risks: MindMapNode = {
    id: 'risks',
    text: 'Risks',
    x: 800,
    y: 550,
    width: 150,
    height: 50,
    parentId: 'root',
    children: [],
    color: '#ef4444',
    textColor: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    shape: 'rounded',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#dc2626',
    icon: 'AlertTriangle',
  };

  return {
    id: `mindmap-${Date.now()}`,
    name: 'Project Planning',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: {
      root: rootNode,
      goals,
      timeline,
      resources,
      risks,
    },
    rootNodeId: 'root',
    theme: 'light',
    language: 'ja',
    colorScheme: 'default',
    defaultNodeColor: '#e0e7ff',
    connectionStyle: 'curved',
    connectionColor: '#94a3b8',
    connectionWidth: 2,
  };
}

/**
 * Create a brainstorming template
 */
export function createBrainstormingTemplate(): MindMap {
  const rootNode: MindMapNode = {
    id: 'root',
    text: 'Brainstorming',
    x: 600,
    y: 400,
    width: 220,
    height: 70,
    parentId: null,
    children: ['ideas', 'challenges', 'solutions'],
    color: '#ec4899',
    textColor: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    shape: 'ellipse',
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#db2777',
    icon: 'Lightbulb',
  };

  const ideas: MindMapNode = {
    id: 'ideas',
    text: 'Ideas',
    x: 400,
    y: 300,
    width: 150,
    height: 50,
    parentId: 'root',
    children: [],
    color: '#fbbf24',
    textColor: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    shape: 'ellipse',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#f59e0b',
    icon: 'Sparkles',
  };

  const challenges: MindMapNode = {
    id: 'challenges',
    text: 'Challenges',
    x: 600,
    y: 200,
    width: 150,
    height: 50,
    parentId: 'root',
    children: [],
    color: '#f87171',
    textColor: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    shape: 'ellipse',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#ef4444',
    icon: 'AlertCircle',
  };

  const solutions: MindMapNode = {
    id: 'solutions',
    text: 'Solutions',
    x: 800,
    y: 300,
    width: 150,
    height: 50,
    parentId: 'root',
    children: [],
    color: '#34d399',
    textColor: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    shape: 'ellipse',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#10b981',
    icon: 'CheckCircle',
  };

  return {
    id: `mindmap-${Date.now()}`,
    name: 'Brainstorming Session',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: {
      root: rootNode,
      ideas,
      challenges,
      solutions,
    },
    rootNodeId: 'root',
    theme: 'light',
    language: 'ja',
    colorScheme: 'default',
    defaultNodeColor: '#e0e7ff',
    connectionStyle: 'curved',
    connectionColor: '#94a3b8',
    connectionWidth: 2,
  };
}

/**
 * Create a learning roadmap template
 */
export function createLearningRoadmapTemplate(): MindMap {
  const rootNode: MindMapNode = {
    id: 'root',
    text: 'Learning Path',
    x: 600,
    y: 400,
    width: 220,
    height: 70,
    parentId: null,
    children: ['basics', 'intermediate', 'advanced'],
    color: '#6366f1',
    textColor: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    shape: 'rounded',
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#4f46e5',
    icon: 'BookOpen',
  };

  const basics: MindMapNode = {
    id: 'basics',
    text: 'Basics',
    x: 350,
    y: 400,
    width: 150,
    height: 50,
    parentId: 'root',
    children: [],
    color: '#a5f3fc',
    textColor: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    shape: 'rounded',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#06b6d4',
    icon: 'Star',
  };

  const intermediate: MindMapNode = {
    id: 'intermediate',
    text: 'Intermediate',
    x: 600,
    y: 250,
    width: 150,
    height: 50,
    parentId: 'root',
    children: [],
    color: '#c4b5fd',
    textColor: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    shape: 'rounded',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    icon: 'TrendingUp',
  };

  const advanced: MindMapNode = {
    id: 'advanced',
    text: 'Advanced',
    x: 850,
    y: 400,
    width: 150,
    height: 50,
    parentId: 'root',
    children: [],
    color: '#fda4af',
    textColor: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    shape: 'rounded',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#f43f5e',
    icon: 'Award',
  };

  return {
    id: `mindmap-${Date.now()}`,
    name: 'Learning Roadmap',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: {
      root: rootNode,
      basics,
      intermediate,
      advanced,
    },
    rootNodeId: 'root',
    theme: 'light',
    language: 'ja',
    colorScheme: 'default',
    defaultNodeColor: '#e0e7ff',
    connectionStyle: 'curved',
    connectionColor: '#94a3b8',
    connectionWidth: 2,
  };
}

/**
 * Get all available templates
 */
export interface Template {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  descriptionJa: string;
  icon: string;
  create: () => MindMap;
}

export const TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Blank',
    nameJa: '空白',
    description: 'Start with a blank canvas',
    descriptionJa: '空白のキャンバスから始める',
    icon: 'FileText',
    create: createBlankTemplate,
  },
  {
    id: 'project',
    name: 'Project Planning',
    nameJa: 'プロジェクト計画',
    description: 'Organize project goals, timeline, and resources',
    descriptionJa: 'プロジェクトの目標、タイムライン、リソースを整理',
    icon: 'Target',
    create: createProjectPlanningTemplate,
  },
  {
    id: 'brainstorm',
    name: 'Brainstorming',
    nameJa: 'ブレインストーミング',
    description: 'Capture ideas, challenges, and solutions',
    descriptionJa: 'アイデア、課題、解決策をキャプチャ',
    icon: 'Lightbulb',
    create: createBrainstormingTemplate,
  },
  {
    id: 'learning',
    name: 'Learning Roadmap',
    nameJa: '学習ロードマップ',
    description: 'Structure your learning journey',
    descriptionJa: '学習の道のりを構造化',
    icon: 'BookOpen',
    create: createLearningRoadmapTemplate,
  },
];
