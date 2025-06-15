import { useState } from "react";
import { Plus, Camera, Map, Heart, Tag, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlbumGrid } from "@/components/gallery/AlbumGrid";
import { CreateAlbumModal } from "@/components/gallery/CreateAlbumModal";
import { ComicHeader } from "@/components/ui/ComicHeader";
import { FloatingMascot } from "@/components/ui/FloatingMascot";
import { AlbumView } from "@/components/gallery/AlbumView";
import { AppSettingsModal, HomeCustomization } from "@/components/settings/AppSettingsModal";

export interface Album {
  id: string;
  title: string;
  category: 'clicks' | 'travel' | 'personal' | 'custom';
  theme: 'comic-noir' | 'pastel-doodle' | 'sticker-burst' | 'neon-pop' | 'vintage-sketch' | 'kawaii-burst';
  font: 'handwritten' | 'typewriter' | 'bubble' | 'google-font';
  googleFont?: string;
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

export interface AppTheme {
  name: string;
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [appTheme, setAppTheme] = useState<AppTheme>({
    name: 'Comic Classic',
    primaryColor: 'from-yellow-100 via-pink-50 to-purple-100',
    backgroundColor: 'bg-white',
    accentColor: 'from-pink-500 to-purple-600'
  });
  const [homeCustomization, setHomeCustomization] = useState<HomeCustomization>({
    blurIntensity: 0,
    customEmojis: ['⭐', '✨', '🎨', '📸'],
    showDecorations: true
  });
  const [customFont, setCustomFont] = useState<string>("");

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

  const handleAlbumClick = (album: Album) => {
    setCurrentAlbum(album);
  };

  const handleBackToGallery = () => {
    setCurrentAlbum(null);
  };

  const handleUpdateAlbum = (updatedAlbum: Album) => {
    setAlbums(albums.map(album => 
      album.id === updatedAlbum.id ? updatedAlbum : album
    ));
    setCurrentAlbum(updatedAlbum);
  };

  if (currentAlbum) {
    return (
      <AlbumView 
        album={currentAlbum}
        onBack={handleBackToGallery}
        onUpdateAlbum={handleUpdateAlbum}
        appTheme={appTheme}
      />
    );
  }

  const backgroundStyle = homeCustomization.backgroundImage 
    ? {
        backgroundImage: `url(${homeCustomization.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: `blur(${homeCustomization.blurIntensity}px)`,
      }
    : {};

  const decorativeEmojis = homeCustomization.showDecorations 
    ? homeCustomization.customEmojis 
    : [];

  // Get dynamic styles for custom themes
  const getDynamicBackgroundStyle = () => {
    if (appTheme.customColors) {
      return {
        background: `linear-gradient(to bottom right, ${appTheme.customColors.primary}20, ${appTheme.customColors.secondary}10, ${appTheme.customColors.accent}20)`
      };
    }
    return {};
  };

  const getDynamicButtonStyle = () => {
    if (appTheme.customColors) {
      return {
        background: `linear-gradient(to right, ${appTheme.customColors.primary}, ${appTheme.customColors.secondary})`
      };
    }
    return {};
  };

  return (
    <div 
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
        appTheme.customColors ? '' : `bg-gradient-to-br ${appTheme.primaryColor}`
      }`}
      style={appTheme.customColors ? getDynamicBackgroundStyle() : {}}
    >
      {/* Background Image Overlay */}
      {homeCustomization.backgroundImage && (
        <div 
          className="absolute inset-0 opacity-30"
          style={backgroundStyle}
        ></div>
      )}

      {/* Comic background elements */}
      {homeCustomization.showDecorations && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl transform rotate-12">
            {decorativeEmojis[0] || '💫'}
          </div>
          <div className="absolute top-32 right-20 text-4xl transform -rotate-12">
            {decorativeEmojis[1] || '⭐'}
          </div>
          <div className="absolute bottom-20 left-32 text-5xl transform rotate-45">
            {decorativeEmojis[2] || '✨'}
          </div>
          <div className="absolute bottom-32 right-10 text-3xl transform -rotate-45">
            {decorativeEmojis[3] || '🎨'}
          </div>
          {decorativeEmojis.slice(4).map((emoji, index) => (
            <div 
              key={index}
              className={`absolute text-4xl transform ${
                index % 2 === 0 ? 'rotate-12' : '-rotate-12'
              }`}
              style={{
                top: `${20 + (index * 15)}%`,
                left: `${10 + (index * 20)}%`,
                zIndex: 1
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Settings Button */}
        <div className="fixed top-6 right-6 z-50">
          <Button
            onClick={() => setShowSettingsModal(true)}
            variant="outline"
            size="sm"
            className="rounded-full comic-shadow bg-white hover:bg-gray-100 border-2 border-black shadow-lg"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <ComicHeader appTheme={appTheme} customFont={customFont} />
        
        {/* Category Filter Bubbles */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="rounded-full font-bold comic-shadow transition-all duration-200"
          >
            All Albums
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full font-bold comic-shadow flex items-center gap-2 transition-all duration-200 ${
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
            className={`text-white font-bold py-4 px-8 rounded-full text-lg comic-shadow transform hover:scale-105 transition-all duration-200 hover:opacity-90 ${
              appTheme.customColors ? '' : `bg-gradient-to-r ${appTheme.accentColor}`
            }`}
            style={appTheme.customColors ? getDynamicButtonStyle() : {}}
          >
            <Plus className="w-6 h-6 mr-2" />
            Create New Album
          </Button>
        </div>

        {/* Albums Grid */}
        <AlbumGrid albums={filteredAlbums} onAlbumClick={handleAlbumClick} />

        {/* Create Album Modal */}
        <CreateAlbumModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateAlbum={handleCreateAlbum}
          categories={categories}
        />

        {/* App Settings Modal */}
        <AppSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          currentTheme={appTheme}
          onThemeChange={setAppTheme}
          homeCustomization={homeCustomization}
          onHomeCustomizationChange={setHomeCustomization}
          customFont={customFont}
          onFontChange={setCustomFont}
        />

        {/* Floating Mascot */}
        <FloatingMascot />
      </div>
    </div>
  );
};

export default Index;
