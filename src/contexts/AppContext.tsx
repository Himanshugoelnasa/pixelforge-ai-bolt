import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Page, ToastMessage, GeneratedImage } from '@/lib/types';
import { MOCK_IMAGES } from '@/lib/mockData';

interface AppContextValue {
  currentPage: Page;
  navigate: (page: Page) => void;
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;
  onboardingDone: boolean;
  setOnboardingDone: (v: boolean) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  images: GeneratedImage[];
  toggleFavorite: (id: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  selectedImageId: string | null;
  setSelectedImageId: (id: string | null) => void;
  credits: number;
  setCredits: (v: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [images, setImages] = useState<GeneratedImage[]>(MOCK_IMAGES);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [credits, setCredits] = useState(8420);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setImages(prev =>
      prev.map(img =>
        img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
      )
    );
  }, []);

  return (
    <AppContext.Provider value={{
      currentPage, navigate,
      isAuthenticated, setAuthenticated,
      onboardingDone, setOnboardingDone,
      toasts, showToast,
      images, toggleFavorite,
      sidebarCollapsed, setSidebarCollapsed,
      selectedImageId, setSelectedImageId,
      credits, setCredits,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
