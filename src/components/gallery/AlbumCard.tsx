import { Album } from "@/pages/Index";
import { Camera, Map, Heart, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AlbumCardProps {
  album: Album;
  index: number;
  onClick: () => void;
  onToggleFavorite?: (albumId: string) => void;
  onDeleteAlbum?: (albumId: string) => void;
}

const categoryIcons = {
  clicks: Camera,
  travel: Map,
  personal: Heart,
  custom: Tag,
};

const themeStyles = {
  'comic-noir': 'bg-gradient-to-br from-gray-800 to-black text-white',
  'pastel-doodle': 'bg-gradient-to-br from-pink-200 to-purple-200 text-gray-800',
  'sticker-burst': 'bg-gradient-to-br from-yellow-300 to-orange-300 text-gray-800',
  'neon-pop': 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white',
  'vintage-sketch': 'bg-gradient-to-br from-amber-200 to-orange-200 text-gray-800',
  'kawaii-burst': 'bg-gradient-to-br from-pink-300 to-purple-300 text-gray-800',
  'retro-wave': 'bg-gradient-to-br from-purple-600 to-pink-600 text-white',
  'forest-nature': 'bg-gradient-to-br from-green-400 to-emerald-600 text-white',
  'ocean-depths': 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white',
  'sunset-glow': 'bg-gradient-to-br from-orange-400 to-red-500 text-white',
  'minimalist-white': 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800',
  'galaxy-space': 'bg-gradient-to-br from-indigo-900 to-purple-900 text-white',
};

const fontStyles = {
  handwritten: 'font-handwritten',
  typewriter: 'font-mono',
  bubble: 'font-black',
  'google-font': 'font-sans',
  'serif-classic': 'font-serif',
  'sans-modern': 'font-sans',
  'script-elegant': 'font-cursive',
  'display-bold': 'font-black',
};

export const AlbumCard = ({ album, index, onClick, onToggleFavorite, onDeleteAlbum }: AlbumCardProps) => {
  const CategoryIcon = categoryIcons[album.category];
  const [isFavorite, setIsFavorite] = useState(album.isFavorite || false);
  
  const cardStyle = album.googleFont ? {
    fontFamily: album.googleFont
  } : {};

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    onToggleFavorite?.(album.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this album? This action cannot be undone.')) {
      onDeleteAlbum?.(album.id);
    }
  };

  // Ensure we have a valid theme style, fallback to pastel-doodle if not found
  const themeClass = themeStyles[album.theme] || themeStyles['pastel-doodle'];
  
  return (
    <div 
      className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-rotate-1 ${
        index % 2 === 0 ? 'rotate-1' : '-rotate-1'
      }`}
      style={{
        ...cardStyle,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
      }}
    >
      <div 
        className={`rounded-3xl p-6 ${themeClass} min-h-[250px] relative overflow-hidden`}
        style={{
          border: '2px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        }}
        onClick={onClick}
      >
        {/* Action buttons */}
        <div className="absolute top-2 right-2 z-40 flex gap-2">
          <button
            onClick={handleFavoriteClick}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
          >
            <Heart 
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white/70'} transition-all duration-200`}
            />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-red-500/80 transition-all duration-200 group/delete"
          >
            <Trash2 className="w-5 h-5 text-white/70 group-hover/delete:text-white transition-all duration-200" />
          </button>
        </div>

        {/* Decorative elements - positioned within rounded area with proper clipping */}
        <div className="absolute top-4 right-4 text-2xl opacity-50 z-10">
          {album.theme === 'comic-noir' && '🖤'}
          {album.theme === 'pastel-doodle' && '🌸'}
          {album.theme === 'sticker-burst' && '⭐'}
          {album.theme === 'neon-pop' && '💫'}
          {album.theme === 'vintage-sketch' && '🎨'}
          {album.theme === 'kawaii-burst' && '🦄'}
          {album.theme === 'retro-wave' && '🌊'}
          {album.theme === 'forest-nature' && '🌿'}
          {album.theme === 'ocean-depths' && '🌊'}
          {album.theme === 'sunset-glow' && '🌅'}
          {album.theme === 'minimalist-white' && '⚪'}
          {album.theme === 'galaxy-space' && '🌌'}
        </div>
        
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-4 relative z-20">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <CategoryIcon className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wide opacity-80">
            {album.category}
          </span>
        </div>

        {/* Album title */}
        <h3 className={`text-2xl font-bold mb-4 ${album.font !== 'google-font' ? fontStyles[album.font] : ''} line-clamp-2 relative z-20`}>
          {album.title}
        </h3>

        {/* Photo count and layout info */}
        <div className="absolute bottom-4 left-6 right-6 z-20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium opacity-80">
              {album.photos.length} {album.photos.length === 1 ? 'photo' : 'photos'}
            </span>
            <div className="text-xs opacity-60">
              {album.layout.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl flex items-center justify-center z-30">
          <div 
            className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 font-bold text-gray-800"
            style={{
              border: '2px solid rgba(255,255,255,0.4)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            OPEN
          </div>
        </div>

        {/* Comic-style decorations - no borders */}
        <div className="absolute top-8 right-8 w-6 h-6 bg-yellow-400 rounded-full transform rotate-45 z-10" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
        <div className="absolute bottom-8 right-12 w-3 h-3 bg-red-400 rounded-full z-10" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
        <div className="absolute top-1/2 left-6 w-2 h-2 bg-blue-400 rounded-full z-10" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}></div>
      </div>
    </div>
  );
};
