import { X, Download, Edit3, Layers, Maximize2, Share2, Copy, Heart, Eraser } from 'lucide-react';
import type { GeneratedImage } from '@/lib/types';
import { useApp } from '@/contexts/AppContext';

interface Props {
  image: GeneratedImage | null;
  onClose: () => void;
}

export default function ImageDetailModal({ image, onClose }: Props) {
  const { toggleFavorite, showToast } = useApp();
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Image */}
        <div className="flex-1 bg-black/50 flex items-center justify-center min-h-[300px] lg:min-h-0">
          <img
            src={image.url}
            alt={image.prompt}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Info panel */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white">Image Details</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 p-4 space-y-4">
            {/* Actions */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Download, label: 'Download', action: () => showToast('Downloading...') },
                { icon: Edit3, label: 'Edit', action: () => showToast('Opening editor...') },
                { icon: Layers, label: 'Variations', action: () => showToast('Generating variations...') },
                { icon: Maximize2, label: 'Upscale', action: () => showToast('Upscaling...') },
                { icon: Eraser, label: 'Remove BG', action: () => showToast('Removing background...') },
                { icon: Share2, label: 'Share', action: () => showToast('Link copied!') },
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <Icon size={16} />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>

            {/* Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Prompt</p>
                <button onClick={() => showToast('Prompt copied!')} className="text-gray-600 hover:text-gray-400 transition-colors">
                  <Copy size={12} />
                </button>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{image.prompt}</p>
            </div>

            {image.negativePrompt && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Negative Prompt</p>
                <p className="text-xs text-gray-500 leading-relaxed">{image.negativePrompt}</p>
              </div>
            )}

            {/* Metadata */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              {[
                { label: 'Model', value: image.model },
                { label: 'Resolution', value: image.resolution },
                { label: 'Aspect Ratio', value: image.aspectRatio },
                { label: 'Seed', value: image.seed.toLocaleString() },
                { label: 'Steps', value: image.steps },
                { label: 'CFG Scale', value: image.cfg },
                { label: 'Style', value: image.style },
                { label: 'Gen Time', value: `${image.generationTime}s` },
                { label: 'Credits Used', value: image.credits },
                { label: 'Created', value: new Date(image.createdAt).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-medium text-gray-300">{value}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {image.tags.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {image.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => { toggleFavorite(image.id); showToast(image.isFavorite ? 'Removed from favorites' : 'Added to favorites'); }}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${image.isFavorite ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'}`}
            >
              <Heart size={16} fill={image.isFavorite ? 'currentColor' : 'none'} />
              {image.isFavorite ? 'Unfavorite' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
