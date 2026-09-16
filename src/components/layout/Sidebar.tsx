import { useState } from 'react';
import {
  LayoutDashboard, Wand2, Layers, Edit3, Maximize2, Eraser, Shuffle,
  FolderOpen, Images, BookmarkCheck, History, FileCode, Cpu,
  ChevronLeft, ChevronRight, Zap, Bell, HelpCircle, Settings,
  CreditCard, Users, BarChart3, Key, Image, ArrowLeftRight
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { Page } from '@/lib/types';

interface NavItem {
  icon: React.ElementType;
  label: string;
  page: Page;
  badge?: string;
}

const MAIN_NAV: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
  { icon: Wand2, label: 'Generate', page: 'generator' },
  { icon: Layers, label: 'Batch Studio', page: 'batch' },
  { icon: Edit3, label: 'Image Editor', page: 'editor' },
  { icon: Maximize2, label: 'Upscaler', page: 'upscaler' },
  { icon: Eraser, label: 'Background Remover', page: 'background-remover' },
  { icon: Shuffle, label: 'Variations', page: 'variations' },
  { icon: ArrowLeftRight, label: 'Image to Image', page: 'image-to-image' },
];

const LIBRARY_NAV: NavItem[] = [
  { icon: FolderOpen, label: 'Projects', page: 'projects' },
  { icon: Images, label: 'Gallery', page: 'gallery' },
  { icon: BookmarkCheck, label: 'Favorites', page: 'favorites' },
  { icon: History, label: 'History', page: 'history' },
  { icon: FileCode, label: 'Templates', page: 'templates' },
  { icon: Cpu, label: 'Models', page: 'models' },
];

const BOTTOM_NAV: NavItem[] = [
  { icon: BarChart3, label: 'Usage', page: 'usage' },
  { icon: CreditCard, label: 'Billing', page: 'billing' },
  { icon: Bell, label: 'Notifications', page: 'notifications', badge: '3' },
  { icon: HelpCircle, label: 'Help', page: 'help' },
];

const PixelForgeLogo = () => (
  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
    <Image size={16} className="text-white" />
  </div>
);

export default function Sidebar() {
  const { currentPage, navigate, sidebarCollapsed, setSidebarCollapsed, credits } = useApp();

  const NavButton = ({ item }: { item: NavItem }) => {
    const isActive = currentPage === item.page;
    const Icon = item.icon;
    return (
      <button
        onClick={() => navigate(item.page)}
        title={sidebarCollapsed ? item.label : undefined}
        className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
          isActive
            ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/20 text-white border border-violet-500/30'
            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
        }`}
      >
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-violet-500 to-cyan-500 rounded-full" />}
        <Icon size={17} className={`shrink-0 ${isActive ? 'text-violet-400' : ''}`} />
        {!sidebarCollapsed && (
          <span className="truncate">{item.label}</span>
        )}
        {!sidebarCollapsed && item.badge && (
          <span className="ml-auto bg-violet-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {item.badge}
          </span>
        )}
        {sidebarCollapsed && item.badge && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full" />
        )}
      </button>
    );
  };

  const creditsPercent = Math.min((credits / 10000) * 100, 100);

  return (
    <aside className={`flex flex-col h-screen bg-gray-950/95 backdrop-blur-xl border-r border-white/5 shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-white/5 shrink-0`}>
        <PixelForgeLogo />
        {!sidebarCollapsed && (
          <div>
            <span className="text-sm font-bold text-white tracking-tight">PixelForge</span>
            <span className="text-sm font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"> AI</span>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="ml-auto p-1.5 rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/5 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-hide">
        <div className="space-y-1">
          {!sidebarCollapsed && <p className="text-xs font-medium text-gray-700 uppercase tracking-wider px-3 pb-1">Create</p>}
          {MAIN_NAV.map(item => <NavButton key={item.page} item={item} />)}
        </div>
        <div className="space-y-1">
          {!sidebarCollapsed && <p className="text-xs font-medium text-gray-700 uppercase tracking-wider px-3 pb-1">Library</p>}
          {LIBRARY_NAV.map(item => <NavButton key={item.page} item={item} />)}
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-white/5 px-2 py-3 space-y-1">
        {/* Credits */}
        {!sidebarCollapsed && (
          <div className="mx-1 mb-3 p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Zap size={13} className="text-violet-400" />
                <span className="text-xs font-semibold text-gray-300">Credits</span>
              </div>
              <span className="text-xs font-bold text-white">{credits.toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all"
                style={{ width: `${creditsPercent}%` }}
              />
            </div>
            <button
              onClick={() => navigate('billing')}
              className="w-full mt-2 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-xs font-semibold text-white hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20"
            >
              Upgrade Plan
            </button>
          </div>
        )}

        {BOTTOM_NAV.map(item => <NavButton key={item.page} item={item} />)}

        {/* User */}
        <button
          onClick={() => navigate('settings')}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors mt-1"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
            HS
          </div>
          {!sidebarCollapsed && (
            <div className="text-left overflow-hidden">
              <p className="text-sm font-medium text-gray-300 truncate">Himanshu</p>
              <p className="text-xs text-gray-600 truncate">Pro Plan</p>
            </div>
          )}
          {!sidebarCollapsed && <Settings size={14} className="ml-auto text-gray-600 shrink-0" />}
        </button>
      </div>
    </aside>
  );
}
