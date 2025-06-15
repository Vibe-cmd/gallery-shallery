
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

  // Fixed theme styling functions
  const getMainBackgroundStyle = () => {
    if (appTheme.customColors) {
      // Create a darker gradient for better contrast
      return {
        background: `linear-gradient(135deg, 
          ${appTheme.customColors.primary}90, 
          ${appTheme.customColors.secondary}90, 
          ${appTheme.customColors.accent}70)`,
        minHeight: '100vh'
      };
    }
    return {};
  };

  const getMainBackgroundClass = () => {
    if (appTheme.customColors) {
      return '';
    }
    return `bg-gradient-to-br ${appTheme.primaryColor}`;
  };

  const getButtonStyle = (isSelected: boolean = false) => {
    if (appTheme.customColors) {
      if (isSelected) {
        return {
          background: `linear-gradient(to right, ${appTheme.customColors.primary}, ${appTheme.customColors.secondary})`,
          color: 'white',
          border: `2px solid ${appTheme.customColors.accent}`,
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
          fontWeight: 'bold'
        };
      }
      return {
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: appTheme.customColors.primary,
        border: `2px solid ${appTheme.customColors.primary}`,
        fontWeight: 'bold'
      };
    }
    return {};
  };

  const getCreateButtonStyle = () => {
    if (appTheme.customColors) {
      return {
        background: `linear-gradient(to right, ${appTheme.customColors.primary}, ${appTheme.customColors.accent})`,
        color: 'white',
        textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
        fontWeight: 'bold'
      };
    }
    return {};
  };

  const getTitleStyle = () => {
    const baseStyle = customFont ? { fontFamily: customFont } : {};
    
    if (appTheme.customColors) {
      return {
        ...baseStyle,
        color: 'white',
        textShadow: '3px 3px 6px rgba(0,0,0,0.9), 1px 1px 3px rgba(0,0,0,0.7)',
        fontWeight: 'bold'
      };
    }
    return baseStyle;
  };

  const getComicHeaderTheme = () => {
    if (appTheme.customColors) {
      return {
        name: appTheme.name,
        primaryColor: appTheme.primaryColor,
        backgroundColor: appTheme.backgroundColor,
        accentColor: `linear-gradient(to right, ${appTheme.customColors.primary}, ${appTheme.customColors.accent})`,
        customColors: appTheme.customColors
      };
    }
    return appTheme;
  };

  const getEmojiStyle = () => {
    if (appTheme.customColors) {
      return {
        filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.9)) drop-shadow(1px 1px 3px rgba(255,255,255,0.6))',
        opacity: 0.9,
        fontSize: '1.2em'
      };
    }
    return {};
  };

  const getTextColorClass = () => {
    if (appTheme.customColors) {
      return 'text-white';
    }
    return 'text-gray-800';
  };

  return (
    <div 
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${getMainBackgroundClass()}`}
      style={getMainBackgroundStyle()}
    >
      {/* Background Image Overlay */}
      {homeCustomization.backgroundImage && (
        <div 
          className="absolute inset-0 opacity-30"
          style={backgroundStyle}
        ></div>
      )}

      {/* Comic background elements - increased quantity */}
      {homeCustomization.showDecorations && (
        <div className="absolute inset-0 opacity-30">
          {/* Main 4 corner emojis */}
          <div 
            className="absolute top-10 left-10 text-6xl transform rotate-12"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[0] || '💫'}
          </div>
          <div 
            className="absolute top-32 right-20 text-4xl transform -rotate-12"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[1] || '⭐'}
          </div>
          <div 
            className="absolute bottom-20 left-32 text-5xl transform rotate-45"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[2] || '✨'}
          </div>
          <div 
            className="absolute bottom-32 right-10 text-3xl transform -rotate-45"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[3] || '🎨'}
          </div>
          
          {/* Additional scattered emojis for moderate level */}
          <div 
            className="absolute top-1/4 left-1/4 text-3xl transform rotate-45"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[4] || '🌈'}
          </div>
          <div 
            className="absolute top-1/3 right-1/3 text-2xl transform -rotate-30"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[5] || '🎪'}
          </div>
          <div 
            className="absolute bottom-1/3 left-1/5 text-4xl transform rotate-15"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[6] || '🎭'}
          </div>
          <div 
            className="absolute bottom-1/4 right-1/4 text-3xl transform -rotate-60"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[7] || '🎨'}
          </div>
          <div 
            className="absolute top-1/2 left-10 text-2xl transform rotate-90"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[8] || '🌟'}
          </div>
          <div 
            className="absolute top-1/2 right-10 text-2xl transform -rotate-90"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[9] || '💖'}
          </div>
          <div 
            className="absolute top-20 left-1/2 text-3xl transform rotate-30"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[10] || '🦄'}
          </div>
          <div 
            className="absolute bottom-20 left-1/2 text-3xl transform -rotate-30"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[11] || '🌸'}
          </div>
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

        <div style={getTitleStyle()}>
          <ComicHeader appTheme={getComicHeaderTheme()} customFont={customFont} />
        </div>
        
        {/* Category Filter Bubbles */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full font-bold comic-shadow transition-all duration-200 ${getTextColorClass()}`}
            style={getButtonStyle(selectedCategory === null)}
          >
            All Albums
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full font-bold comic-shadow flex items-center gap-2 transition-all duration-200 ${getTextColorClass()} ${
                selectedCategory === category.id && !appTheme.customColors ? category.color : ''
              }`}
              style={getButtonStyle(selectedCategory === category.id)}
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
            style={appTheme.customColors ? getCreateButtonStyle() : {}}
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
