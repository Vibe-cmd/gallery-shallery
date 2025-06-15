
import { useState } from "react";
import { Plus, Camera, Map, Heart, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlbumGrid } from "@/components/gallery/AlbumGrid";
import { CreateAlbumModal } from "@/components/gallery/CreateAlbumModal";
import { ComicHeader } from "@/components/ui/ComicHeader";
import { FloatingMascot } from "@/components/ui/FloatingMascot";

export interface Album {
  id: string;
  title: string;
  category: 'clicks' | 'travel' | 'personal' | 'custom';
  theme: 'comic-noir' | 'pastel-doodle' | 'sticker-burst';
  font: 'handwritten' | 'typewriter' | 'bubble';
  layout: 'panel' | 'vertical' | 'grid' | 'collage';
  coverIcon?: string;
  photos: Photo[];
  createdAt: Date;
}

export interface Photo {
  id: string;
  url: string;
  title?: string;
  date?: Date;
  location?: string;
  backstory?: string;
  stickers: string[];
}

const Index = () => {
  const [albums, setAlbums] = useState<Album[]>([
    {
      id: '1',
      title: 'Summer Adventures',
      category: 'travel',
      theme: 'pastel-doodle',
      font: 'handwritten',
      layout: 'grid',
      photos: [],
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Random Clicks',
      category: 'clicks',
      theme: 'sticker-burst',
      font: 'bubble',
      layout: 'collage',
      photos: [],
      createdAt: new Date()
    }
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'clicks', name: 'Clicks', icon: Camera, color: 'bg-yellow-400', description: 'Random photos & selfies' },
    { id: 'travel', name: 'Travel', icon: Map, color: 'bg-green-400', description: 'Locations & journeys' },
    { id: 'personal', name: 'Personal', icon: Heart, color: 'bg-pink-400', description: 'Life moments & people' },
    { id: 'custom', name: 'Custom', icon: Tag, color: 'bg-purple-400', description: 'Your own tags' }
  ];

  const filteredAlbums = selectedCategory 
    ? albums.filter(album => album.category === selectedCategory)
    : albums;

  const handleCreateAlbum = (newAlbum: Omit<Album, 'id' | 'createdAt'>) => {
    const album: Album = {
      ...newAlbum,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setAlbums([...albums, album]);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* Comic background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl transform rotate-12">💫</div>
        <div className="absolute top-32 right-20 text-4xl transform -rotate-12">⭐</div>
        <div className="absolute bottom-20 left-32 text-5xl transform rotate-45">✨</div>
        <div className="absolute bottom-32 right-10 text-3xl transform -rotate-45">🎨</div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <ComicHeader />
        
        {/* Category Filter Bubbles */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="rounded-full font-bold comic-shadow"
          >
            All Albums
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full font-bold comic-shadow flex items-center gap-2 ${
                selectedCategory === category.id ? category.color : ''
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Create Album Button */}
        <div className="text-center mb-8">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg comic-shadow transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-6 h-6 mr-2" />
            Create New Album
          </Button>
        </div>

        {/* Albums Grid */}
        <AlbumGrid albums={filteredAlbums} />

        {/* Create Album Modal */}
        <CreateAlbumModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateAlbum={handleCreateAlbum}
          categories={categories}
        />

        {/* Floating Mascot */}
        <FloatingMascot />
      </div>
    </div>
  );
};

export default Index;
