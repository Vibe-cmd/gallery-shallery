import { useState, useEffect } from "react";
import { Plus, Camera, Map, Heart, Tag, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlbumGrid } from "@/components/gallery/AlbumGrid";
import { CreateAlbumModal } from "@/components/gallery/CreateAlbumModal";
import { ComicHeader } from "@/components/ui/ComicHeader";
import { FloatingMascot } from "@/components/ui/FloatingMascot";
import { AlbumView } from "@/components/gallery/AlbumView";
import { AppSettingsModal, HomeCustomization } from "@/components/settings/AppSettingsModal";
import { WelcomeModal } from "@/components/ui/WelcomeModal";
import { localStorageService } from "@/services/localStorage";

export interface Album {
  id: string;
  title: string;
  category: 'clicks' | 'travel' | 'personal' | 'custom';
  theme: 'comic-noir' | 'pastel-doodle' | 'sticker-burst' | 'neon-pop' | 'vintage-sketch' | 'kawaii-burst' | 'retro-wave' | 'forest-nature' | 'ocean-depths' | 'sunset-glow' | 'minimalist-white' | 'galaxy-space';
  font: 'handwritten' | 'typewriter' | 'bubble' | 'google-font' | 'serif-classic' | 'sans-modern' | 'script-elegant' | 'display-bold';
  googleFont?: string;
  layout: 'panel' | 'vertical' | 'grid' | 'collage' | 'masonry' | 'timeline' | 'polaroid' | 'magazine' | 'circular' | 'stack' | 'infinite-scroll' | 'infinite-menu';
  coverIcon?: string;
  photos: Photo[];
  createdAt: Date;
  isFavorite?: boolean;
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
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
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

  // Load data from localStorage on component mount
  useEffect(() => {
    console.log('Loading data from localStorage...');
    
    // Check if this is the user's first visit
    const hasVisited = localStorage.getItem('gallery_shallery_has_visited');
    if (!hasVisited) {
      console.log('First time visitor - showing welcome modal');
      setShowWelcomeModal(true);
      localStorage.setItem('gallery_shallery_has_visited', 'true');
    }

    // Load albums - no default albums for new users
    const savedAlbums = localStorageService.loadAlbums();
    if (savedAlbums.length > 0) {
      setAlbums(savedAlbums);
      console.log('Loaded albums from localStorage:', savedAlbums);
    }

    // Load app theme
    const savedTheme = localStorageService.loadAppTheme();
    if (savedTheme) {
      setAppTheme(savedTheme);
      console.log('Loaded theme from localStorage:', savedTheme);
    }

    // Load home customization
    const savedHomeCustomization = localStorageService.loadHomeCustomization();
    if (savedHomeCustomization) {
      setHomeCustomization(savedHomeCustomization);
      console.log('Loaded home customization from localStorage:', savedHomeCustomization);
    }

    // Load custom font
    const savedFont = localStorageService.loadCustomFont();
    if (savedFont) {
      setCustomFont(savedFont);
      console.log('Loaded custom font from localStorage:', savedFont);
      
      // Re-load the font
      const fontLink = document.createElement('link');
      fontLink.href = `https://fonts.googleapis.com/css2?family=${savedFont.replace(' ', '+')}&display=swap`;
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (albums.length > 0) {
      localStorageService.saveAlbums(albums);
      console.log('Saved albums to localStorage:', albums);
    }
  }, [albums]);

  useEffect(() => {
    localStorageService.saveAppTheme(appTheme);
    console.log('Saved theme to localStorage:', appTheme);
  }, [appTheme]);

  useEffect(() => {
    localStorageService.saveHomeCustomization(homeCustomization);
    console.log('Saved home customization to localStorage:', homeCustomization);
  }, [homeCustomization]);

  useEffect(() => {
    if (customFont) {
      localStorageService.saveCustomFont(customFont);
      console.log('Saved custom font to localStorage:', customFont);
    }
  }, [customFont]);

  const categories = [
    { id: 'clicks', name: 'Clicks', icon: Camera, color: 'bg-yellow-400', description: 'Random photos & selfies' },
    { id: 'travel', name: 'Travel', icon: Map, color: 'bg-green-400', description: 'Locations & journeys' },
    { id: 'personal', name: 'Personal', icon: Heart, color: 'bg-pink-400', description: 'Life moments & people' },
    { id: 'custom', name: 'Custom', icon: Tag, color: 'bg-purple-400', description: 'Your own tags' }
  ];

  const filteredAlbums = selectedCategory === 'favorites'
    ? albums.filter(album => album.isFavorite)
    : selectedCategory 
    ? albums.filter(album => album.category === selectedCategory)
    : albums;

  const handleCreateAlbum = (newAlbum: Omit<Album, 'id' | 'createdAt'>) => {
    const album: Album = {
      ...newAlbum,
      id: Date.now().toString(),
      createdAt: new Date(),
      isFavorite: false
    };
    setAlbums([...albums, album]);
    setShowCreateModal(false);
    console.log('Created new album:', album);
  };

  const handleToggleFavorite = (albumId: string) => {
    setAlbums(albums.map(album => 
      album.id === albumId 
        ? { ...album, isFavorite: !album.isFavorite }
        : album
    ));
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
    console.log('Updated album:', updatedAlbum);
  };

  const handleDeleteAlbum = (albumId: string) => {
    setAlbums(albums.filter(album => album.id !== albumId));
    console.log('Deleted album:', albumId);
  };

  const handleImportBackupData = (backupData: any) => {
    try {
      // Import albums
      if (backupData.albums) {
        const importedAlbums = backupData.albums.map((album: any) => ({
          ...album,
          createdAt: new Date(album.createdAt),
          photos: album.photos.map((photo: any) => ({
            ...photo,
            date: photo.date ? new Date(photo.date) : undefined
          }))
        }));
        setAlbums(importedAlbums);
      }

      // Import app theme
      if (backupData.appTheme) {
        setAppTheme(backupData.appTheme);
      }

      // Import home customization
      if (backupData.homeCustomization) {
        setHomeCustomization(backupData.homeCustomization);
      }

      // Import custom font
      if (backupData.customFont) {
        setCustomFont(backupData.customFont);
        
        // Re-load the font
        const fontLink = document.createElement('link');
        fontLink.href = `https://fonts.googleapis.com/css2?family=${backupData.customFont.replace(' ', '+')}&display=swap`;
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }

      console.log('Successfully imported backup data:', backupData);
    } catch (error) {
      console.error('Error importing backup data:', error);
      throw error;
    }
  };

  const handleWelcomeThemeSelect = (theme: AppTheme) => {
    console.log('Selected theme from welcome modal:', theme);
    setAppTheme(theme);
  };

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
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
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          fontWeight: 'bold'
        };
      }
      return {
        backgroundColor: 'rgba(255,255,255,0.95)',
        color: appTheme.customColors.primary,
        border: `2px solid ${appTheme.customColors.primary}`,
        fontWeight: 'bold',
        backdropFilter: 'blur(10px)'
      };
    }
    
    // Improved styling for default theme
    if (isSelected) {
      return {
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        border: '2px solid rgba(255,255,255,0.3)',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        fontWeight: 'bold'
      };
    }
    
    return {
      backgroundColor: 'rgba(255,255,255,0.95)',
      color: 'rgba(0,0,0,0.8)',
      border: '2px solid rgba(255,255,255,0.5)',
      fontWeight: 'bold',
      backdropFilter: 'blur(10px)',
      textShadow: 'none'
    };
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
        fontSize: '1.5em' // Increased size
      };
    }
    return {
      fontSize: '1.5em' // Increased size for default theme too
    };
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
          {/* Main 4 corner emojis - increased sizes */}
          <div 
            className="absolute top-10 left-10 text-8xl transform rotate-12"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[0] || '💫'}
          </div>
          <div 
            className="absolute top-32 right-20 text-6xl transform -rotate-12"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[1] || '⭐'}
          </div>
          <div 
            className="absolute bottom-20 left-32 text-7xl transform rotate-45"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[2] || '✨'}
          </div>
          <div 
            className="absolute bottom-32 right-10 text-5xl transform -rotate-45"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[3] || '🎨'}
          </div>
          
          {/* Additional scattered emojis for moderate level - increased sizes */}
          <div 
            className="absolute top-1/4 left-1/4 text-5xl transform rotate-45"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[4] || '🌈'}
          </div>
          <div 
            className="absolute top-1/3 right-1/3 text-4xl transform -rotate-30"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[5] || '🎪'}
          </div>
          <div 
            className="absolute bottom-1/3 left-1/5 text-6xl transform rotate-15"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[6] || '🎭'}
          </div>
          <div 
            className="absolute bottom-1/4 right-1/4 text-5xl transform -rotate-60"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[7] || '🎨'}
          </div>
          <div 
            className="absolute top-1/2 left-10 text-4xl transform rotate-90"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[8] || '🌟'}
          </div>
          <div 
            className="absolute top-1/2 right-10 text-4xl transform -rotate-90"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[9] || '💖'}
          </div>
          <div 
            className="absolute top-20 left-1/2 text-5xl transform rotate-30"
            style={getEmojiStyle()}
          >
            {decorativeEmojis[10] || '🦄'}
          </div>
          <div 
            className="absolute bottom-20 left-1/2 text-5xl transform -rotate-30"
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
            className="rounded-full bg-white hover:bg-gray-100 border-2 border-white shadow-lg"
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
            className="rounded-full font-bold transition-all duration-200 hover:scale-105"
            style={getButtonStyle(selectedCategory === null)}
          >
            All Albums
          </Button>
          <Button
            variant={selectedCategory === 'favorites' ? "default" : "outline"}
            onClick={() => setSelectedCategory('favorites')}
            className="rounded-full font-bold flex items-center gap-2 transition-all duration-200 hover:scale-105"
            style={getButtonStyle(selectedCategory === 'favorites')}
          >
            <Heart className="w-4 h-4" />
            Favorites
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="rounded-full font-bold flex items-center gap-2 transition-all duration-200 hover:scale-105"
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
            className={`text-white font-bold py-4 px-8 rounded-full text-lg transform hover:scale-105 transition-all duration-200 hover:opacity-90 ${
              appTheme.customColors ? '' : `bg-gradient-to-r ${appTheme.accentColor}`
            }`}
            style={appTheme.customColors ? getCreateButtonStyle() : {}}
          >
            <Plus className="w-6 h-6 mr-2" />
            Create New Album
          </Button>
        </div>

        {/* Albums Grid */}
        <AlbumGrid 
          albums={filteredAlbums} 
          onAlbumClick={handleAlbumClick}
          onToggleFavorite={handleToggleFavorite}
          onDeleteAlbum={handleDeleteAlbum}
        />

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
          albums={albums}
          onImportData={handleImportBackupData}
        />

        {/* Welcome Modal */}
        <WelcomeModal
          isOpen={showWelcomeModal}
          onClose={handleCloseWelcomeModal}
          onThemeSelect={handleWelcomeThemeSelect}
        />

        {/* Floating Mascot */}
        <FloatingMascot />
      </div>
    </div>
  );
};

export default Index;
