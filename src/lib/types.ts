export type Page =
  | 'login' | 'signup' | 'forgot-password' | 'onboarding'
  | 'dashboard' | 'generator' | 'batch' | 'editor' | 'upscaler'
  | 'background-remover' | 'variations' | 'image-to-image'
  | 'projects' | 'gallery' | 'favorites' | 'history'
  | 'templates' | 'models' | 'collections'
  | 'profile' | 'settings' | 'billing' | 'usage' | 'api-keys' | 'team'
  | 'notifications' | 'help' | 'changelog';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  negativePrompt?: string;
  model: string;
  resolution: string;
  aspectRatio: string;
  seed: number;
  steps: number;
  cfg: number;
  style: string;
  generationTime: number;
  credits: number;
  createdAt: string;
  isFavorite: boolean;
  projectId?: string;
  tags: string[];
  width: number;
  height: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  imageCount: number;
  lastUpdated: string;
  owner: string;
  storage: string;
  color: string;
}

export interface BatchJob {
  id: string;
  name: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'paused';
  total: number;
  completed: number;
  failed: number;
  processing: number;
  model: string;
  credits: number;
  creditsUsed: number;
  startedAt: string;
  eta: string;
  prompts: string[];
  outputImages: string[];
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  version: string;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'standard' | 'high' | 'ultra';
  costPerImage: number;
  tags: string[];
  previewImage: string;
  recommended?: boolean;
  new?: boolean;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  prompt: string;
  negativePrompt: string;
  model: string;
  resolution: string;
  aspectRatio: string;
  style: string;
  category: string;
  previewImage: string;
  usageCount: number;
  rating: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar: string;
  joinedAt: string;
  lastActive: string;
  imagesGenerated: number;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  requestCount: number;
  status: 'active' | 'revoked';
  permissions: string[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
