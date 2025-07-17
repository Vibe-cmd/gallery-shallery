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
  layout: 'panel' | 'vertical' | 'grid' | 'collage' | 'masonry' | 'timeline' | 'polaroid' | 'magazine';
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
    { id: 'clicks', name: 'Clicks', icon: Camera, color: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500', description: 'Random photos & selfies' },
    { id: 'travel', name: 'Travel', icon: Map, color: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600', description: 'Locations & journeys' },
    { id: 'personal', name: 'Personal', icon: Heart, color: 'bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600', description: 'Life moments & people' },
    { id: 'custom', name: 'Custom', icon: Tag, color: 'bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600', description: 'Your own tags' }
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

  // Enhanced theme styling functions with more dynamic effects
  const getMainBackgroundStyle = () => {
    if (appTheme.customColors) {
      return {
        background: `
          radial-gradient(circle at 20% 80%, ${appTheme.customColors.primary}40 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, ${appTheme.customColors.secondary}30 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, ${appTheme.customColors.accent}20 0%, transparent 50%),
          linear-gradient(135deg, 
            ${appTheme.customColors.primary}15, 
            ${appTheme.customColors.secondary}10, 
            ${appTheme.customColors.accent}15)`,
        minHeight: '100vh',
        position: 'relative'
      };
    }
    return {
      background: `
        radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)`
    };
  };

  const getMainBackgroundClass = () => {
    if (appTheme.customColors) {
      return '';
    }
    return `bg-gradient-to-br ${appTheme.primaryColor}`;
  };

  const getButtonStyle = (isSelected: boolean = false) => {
    const baseStyle = {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
      backdropFilter: 'blur(20px)',
      border: '2px solid',
      fontWeight: 'bold',
      textShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
      boxShadow: isSelected 
        ? '0 20px 40px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)' 
        : '0 8px 25px rgba(0,0,0,0.1), 0 3px 10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.1)'
    };

    if (appTheme.customColors) {
      if (isSelected) {
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${appTheme.customColors.primary}, ${appTheme.customColors.secondary}, ${appTheme.customColors.accent})`,
          color: 'white',
          borderColor: 'rgba(255,255,255,0.6)',
        };
      }
      return {
        ...baseStyle,
        background: 'rgba(255,255,255,0.95)',
        color: appTheme.customColors.primary,
        borderColor: `${appTheme.customColors.primary}80`,
      };
    }
    
    if (isSelected) {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7))',
        color: 'white',
        borderColor: 'rgba(255,255,255,0.4)',
      };
    }
    
    return {
      ...baseStyle,
      background: 'rgba(255,255,255,0.95)',
      color: 'rgba(0,0,0,0.8)',
      borderColor: 'rgba(255,255,255,0.6)',
    };
  };

  const getCreateButtonStyle = () => {
    const baseStyle = {
      background: appTheme.customColors
        ? `linear-gradient(135deg, ${appTheme.customColors.primary}, ${appTheme.customColors.secondary}, ${appTheme.customColors.accent})`
        : `linear-gradient(135deg, #a855f7, #ec4899, #3b82f6)`,
      color: 'white',
      textShadow: '0 2px 4px rgba(0,0,0,0.4)',
      fontWeight: 'bold',
      border: '2px solid rgba(255,255,255,0.3)',
      boxShadow: `
        0 25px 50px rgba(0,0,0,0.25), 
        0 10px 20px rgba(0,0,0,0.15),
        inset 0 1px 0 rgba(255,255,255,0.3),
        inset 0 -1px 0 rgba(0,0,0,0.2)`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };
    return baseStyle;
  };

  const getTitleStyle = () => {
    const baseStyle = customFont ? { fontFamily: customFont } : {};
    
    if (appTheme.customColors) {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, ${appTheme.customColors.primary}, ${appTheme.customColors.secondary}, ${appTheme.customColors.accent})`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        textShadow: 'none',
        fontWeight: '900',
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
      };
    }
    return {
      ...baseStyle,
      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
    };
  };

  const getComicHeaderTheme = () => {
    if (appTheme.customColors) {
      return {
        name: appTheme.name,
        primaryColor: appTheme.primaryColor,
        backgroundColor: appTheme.backgroundColor,
        accentColor: `linear-gradient(135deg, ${appTheme.customColors.primary}, ${appTheme.customColors.secondary}, ${appTheme.customColors.accent})`,
        customColors: appTheme.customColors
      };
    }
    return appTheme;
  };

  const getEmojiStyle = () => {
    const baseStyle = {
      fontSize: '2em',
      transition: 'all 0.3s ease',
      animation: 'float 6s ease-in-out infinite'
    };

    if (appTheme.customColors) {
      return {
        ...baseStyle,
        filter: `
          drop-shadow(4px 4px 8px rgba(0,0,0,0.4)) 
          drop-shadow(2px 2px 4px ${appTheme.customColors.primary}40)
          drop-shadow(-2px -2px 4px ${appTheme.customColors.accent}30)`,
        opacity: 0.9,
      };
    }
    return {
      ...baseStyle,
      filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.3))',
      opacity: 0.8
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
      className={`min-h-screen relative overflow-hidden transition-all duration-700 ${getMainBackgroundClass()}`}
      style={getMainBackgroundStyle()}
    >
      {/* Enhanced Background Image Overlay */}
      {homeCustomization.backgroundImage && (
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            ...backgroundStyle,
            mixBlendMode: 'multiply'
          }}
        ></div>
      )}

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 animate-pulse"
          style={{
            background: appTheme.customColors 
              ? `radial-gradient(circle, ${appTheme.customColors.primary}60, transparent)`
              : 'radial-gradient(circle, rgba(168, 85, 247, 0.6), transparent)',
            top: '10%',
            left: '10%',
            animation: 'float 8s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="absolute w-64 h-64 rounded-full opacity-30"
          style={{
            background: appTheme.customColors 
              ? `radial-gradient(circle, ${appTheme.customColors.secondary}50, transparent)`
              : 'radial-gradient(circle, rgba(236, 72, 153, 0.5), transparent)',
            top: '60%',
            right: '15%',
            animation: 'float 10s ease-in-out infinite reverse'
          }}
        ></div>
        <div 
          className="absolute w-80 h-80 rounded-full opacity-25"
          style={{
            background: appTheme.customColors 
              ? `radial-gradient(circle, ${appTheme.customColors.accent}40, transparent)`
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent)',
            bottom: '20%',
            left: '20%',
            animation: 'float 12s ease-in-out infinite'
          }}
        ></div>
      </div>

      {/* Enhanced decorative elements */}
      {homeCustomization.showDecorations && (
        <div className="absolute inset-0 opacity-40">
          {/* Main 4 corner emojis with enhanced styling */}
          <div 
            className="absolute top-10 left-10 transform rotate-12 hover:scale-110 transition-transform duration-300"
            style={{
              ...getEmojiStyle(),
              animationDelay: '0s'
            }}
          >
            {decorativeEmojis[0] || '💫'}
          </div>
          <div 
            className="absolute top-32 right-20 transform -rotate-12 hover:scale-110 transition-transform duration-300"
            style={{
              ...getEmojiStyle(),
              animationDelay: '1s'
            }}
          >
            {decorativeEmojis[1] || '⭐'}
          </div>
          <div 
            className="absolute bottom-20 left-32 transform rotate-45 hover:scale-110 transition-transform duration-300"
            style={{
              ...getEmojiStyle(),
              animationDelay: '2s'
            }}
          >
            {decorativeEmojis[2] || '✨'}
          </div>
          <div 
            className="absolute bottom-32 right-10 transform -rotate-45 hover:scale-110 transition-transform duration-300"
            style={{
              ...getEmojiStyle(),
              animationDelay: '3s'
            }}
          >
            {decorativeEmojis[3] || '🎨'}
          </div>
          
          {/* Additional scattered emojis with staggered animations */}
          {[4, 5, 6, 7, 8, 9, 10, 11].map((index) => (
            <div
              key={index}
              className={`absolute transform hover:scale-110 transition-transform duration-300 ${
                index % 2 === 0 ? 'animate-pulse' : ''
              }`}
              style={{
                ...getEmojiStyle(),
                top: `${20 + (index * 8)}%`,
                left: `${10 + (index * 10)}%`,
                animationDelay: `${index * 0.5}s`,
                fontSize: '1.5em'
              }}
            >
              {decorativeEmojis[index] || ['🌈', '🎪', '🎭', '🎨', '🌟', '💖', '🦄', '🌸'][index - 4]}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Enhanced Settings Button */}
        <div className="fixed top-6 right-6 z-50">
          <Button
            onClick={() => setShowSettingsModal(true)}
            variant="outline"
            size="sm"
            className="rounded-full hover:scale-110 transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255,255,255,0.5)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)'
            }}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div style={getTitleStyle()}>
          <ComicHeader appTheme={getComicHeaderTheme()} customFont={customFont} />
        </div>
        
        {/* Enhanced Category Filter Bubbles */}
        <div className="flex flex-wrap gap-6 mb-12 justify-center">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="rounded-full font-bold transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            style={getButtonStyle(selectedCategory === null)}
          >
            All Albums
          </Button>
          <Button
            variant={selectedCategory === 'favorites' ? "default" : "outline"}
            onClick={() => setSelectedCategory('favorites')}
            className="rounded-full font-bold flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
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
              className="rounded-full font-bold flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={getButtonStyle(selectedCategory === category.id)}
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Enhanced Create Album Button */}
        <div className="text-center mb-12">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="text-white font-bold py-6 px-12 rounded-full text-xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl relative overflow-hidden group"
            style={getCreateButtonStyle()}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
            <Plus className="w-8 h-8 mr-3" />
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
      
      {/* Enhanced floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-30"
            style={{
              background: appTheme.customColors 
                ? `linear-gradient(45deg, ${appTheme.customColors.primary}, ${appTheme.customColors.accent})`
                : 'linear-gradient(45deg, #a855f7, #ec4899)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Index;
