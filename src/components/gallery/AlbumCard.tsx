
import { Album } from "@/pages/Index";
import { Camera, Map, Heart, Tag } from "lucide-react";

interface AlbumCardProps {
  album: Album;
  index: number;
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
};

const fontStyles = {
  handwritten: 'font-handwritten',
  typewriter: 'font-mono',
  bubble: 'font-black',
};

export const AlbumCard = ({ album, index }: AlbumCardProps) => {
  const CategoryIcon = categoryIcons[album.category];
  
  return (
    <div 
      className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-rotate-1 comic-shadow ${
        index % 2 === 0 ? 'rotate-1' : '-rotate-1'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`rounded-3xl p-6 border-4 border-black ${themeStyles[album.theme]} min-h-[250px] relative overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute top-2 right-2 text-2xl opacity-50">
          {album.theme === 'comic-noir' && '🖤'}
          {album.theme === 'pastel-doodle' && '🌸'}
          {album.theme === 'sticker-burst' && '⭐'}
        </div>
        
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <CategoryIcon className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wide opacity-80">
            {album.category}
          </span>
        </div>

        {/* Album title */}
        <h3 className={`text-2xl font-bold mb-4 ${fontStyles[album.font]} line-clamp-2`}>
          {album.title}
        </h3>

        {/* Photo count and preview */}
        <div className="absolute bottom-4 left-6 right-6">
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
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 font-bold text-gray-800">
            OPEN
          </div>
        </div>

        {/* Comic-style decorations */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-2 border-black transform rotate-45"></div>
        <div className="absolute bottom-2 right-8 w-4 h-4 bg-red-400 rounded-full border-2 border-black"></div>
      </div>
    </div>
  );
};
