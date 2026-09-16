import { useState } from 'react';
import { Heart, Download, Wand2, Maximize2, Layers, Trash2, Copy, MoreHorizontal, Edit3, Eraser } from 'lucide-react';
import type { GeneratedImage } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';

interface ImageCardProps {
  image: GeneratedImage;
  onOpen?: (id: string) => void;
}

export default function ImageCard({ image, onOpen }: ImageCardProps) {
  const { toggleFavorite, showToast } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const isPortrait = image.height > image.width;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gray-800/60 border border-white/5 cursor-pointer hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-0.5 ${isPortrait ? 'row-span-2' : ''}`}
      onClick={() => onOpen?.(image.id)}
    >
      <div className={`relative overflow-hidden ${isPortrait ? 'aspect-[2/3]' : 'aspect-video'}`}>
        <img
          src={image.url}
          alt={image.prompt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={e => { e.stopPropagation(); toggleFavorite(image.id); showToast(image.isFavorite ? 'Removed from favorites' : 'Added to favorites'); }}
              className={`p-1.5 rounded-lg backdrop-blur-sm transition-colors ${image.isFavorite ? 'bg-rose-500/80 text-white' : 'bg-black/50 text-gray-300 hover:text-white hover:bg-white/20'}`}
            >
              <Heart size={14} fill={image.isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button onClick={e => { e.stopPropagation(); showToast('Downloading image...'); }} className="p-1.5 rounded-lg bg-black/50 text-gray-300 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-colors">
              <Download size={14} />
            </button>
            <button onClick={e => { e.stopPropagation(); showToast('Opening editor...'); }} className="p-1.5 rounded-lg bg-black/50 text-gray-300 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-colors">
              <Edit3 size={14} />
            </button>
            <button onClick={e => { e.stopPropagation(); showToast('Generating variations...'); }} className="p-1.5 rounded-lg bg-black/50 text-gray-300 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-colors">
              <Layers size={14} />
            </button>
            <button onClick={e => { e.stopPropagation(); showToast('Upscaling image...'); }} className="p-1.5 rounded-lg bg-black/50 text-gray-300 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-colors">
              <Maximize2 size={14} />
            </button>
            <button onClick={e => { e.stopPropagation(); showToast('Removing background...'); }} className="p-1.5 rounded-lg bg-black/50 text-gray-300 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-colors">
              <Eraser size={14} />
            </button>
            <div className="relative ml-auto">
              <button
                onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
                className="p-1.5 rounded-lg bg-black/50 text-gray-300 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
              >
                <MoreHorizontal size={14} />
              </button>
              {menuOpen && (
                <div
                  className="absolute bottom-full right-0 mb-1 w-44 bg-gray-900 border border-white/10 rounded-xl shadow-2xl py-1 z-20"
                  onClick={e => e.stopPropagation()}
                >
                  {[
                    { icon: Copy, label: 'Copy prompt', action: () => showToast('Prompt copied!') },
                    { icon: Wand2, label: 'Remix image', action: () => showToast('Opening remix...') },
                    { icon: Trash2, label: 'Delete', action: () => showToast('Image deleted') },
                  ].map(({ icon: Icon, label, action }) => (
                    <button key={label} onClick={() => { action(); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                      <Icon size={13} />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {image.isFavorite && (
          <div className="absolute top-2 right-2">
            <div className="p-1 rounded-full bg-rose-500/80 backdrop-blur-sm">
              <Heart size={10} fill="white" className="text-white" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{image.prompt}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-600 font-medium">{image.model}</span>
          <span className="text-xs text-gray-600">{image.resolution}</span>
        </div>
      </div>
    </div>
  );
}
