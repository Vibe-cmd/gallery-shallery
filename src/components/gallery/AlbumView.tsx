import { useState, useRef } from "react";
import { ArrowLeft, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Album, Photo, AppTheme } from "@/pages/Index";
import { PhotoReviewModal } from "./PhotoReviewModal";
import { PhotoDetailModal } from "./PhotoDetailModal";
import { MasonryLayout } from "../layouts/MasonryLayout";
import { MagazineLayout } from "../layouts/MagazineLayout";
import { CircularGallery } from "../layouts/CircularGallery";
import { StackLayout } from "../layouts/StackLayout";
import { InfiniteScrollLayout } from "../layouts/InfiniteScrollLayout";
import { InfiniteMenuLayout } from "../layouts/InfiniteMenuLayout";

interface AlbumViewProps {
  album: Album;
  onBack: () => void;
  onUpdateAlbum: (album: Album) => void;
  appTheme: AppTheme;
}

export const AlbumView = ({ album, onBack, onUpdateAlbum, appTheme }: AlbumViewProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pendingPhotoUrl, setPendingPhotoUrl] = useState("");
  const [pendingFileName, setPendingFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setPendingPhotoUrl(e.target?.result as string);
        setPendingFileName(file.name);
        setShowReviewModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = (photoData: Omit<Photo, 'id'>) => {
    const newPhoto: Photo = {
      ...photoData,
      id: Date.now().toString() + Math.random()
    };
    
    const updatedAlbum = {
      ...album,
      photos: [...album.photos, newPhoto]
    };
    onUpdateAlbum(updatedAlbum);
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setShowDetailModal(true);
  };

  const handleDeletePhoto = (photoId: string) => {
    const updatedAlbum = {
      ...album,
      photos: album.photos.filter(photo => photo.id !== photoId)
    };
    onUpdateAlbum(updatedAlbum);
    console.log('Deleted photo:', photoId);
  };

  const getLayoutClasses = () => {
    switch (album.layout) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      case 'panel':
        return 'grid grid-cols-1 md:grid-cols-2 gap-8';
      case 'vertical':
        return 'grid grid-cols-1 max-w-2xl mx-auto gap-6';
      case 'collage':
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6';
      case 'timeline':
        return 'space-y-8 max-w-4xl mx-auto';
      case 'polaroid':
        return 'flex flex-wrap gap-6 justify-center';
      case 'magazine':
        return 'grid grid-cols-1 md:grid-cols-12 gap-6';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  const getPhotoCardClasses = (index: number) => {
    const baseClasses = "bg-white rounded-2xl border-4 border-black cursor-pointer transform hover:scale-105 transition-all duration-200";
    
    switch (album.layout) {
      case 'polaroid':
        return `${baseClasses} p-3 pb-6 transform ${index % 2 === 0 ? 'rotate-2' : '-rotate-2'} hover:rotate-0 shadow-lg min-w-48 max-w-64`;
      case 'timeline':
        return `${baseClasses} p-6 flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-6`;
      case 'magazine':
        return `${baseClasses} p-4 ${index === 0 ? 'md:col-span-8' : index === 1 ? 'md:col-span-4' : index % 3 === 0 ? 'md:col-span-6' : 'md:col-span-3'}`;
      case 'masonry':
        return `${baseClasses} p-4 break-inside-avoid mb-6`;
      case 'panel':
        return `${baseClasses} p-6 border-8 border-black shadow-xl`;
      default:
        return `${baseClasses} p-4`;
    }
  };

  const getImageClasses = (index: number) => {
    switch (album.layout) {
      case 'polaroid':
        return "w-full max-h-40 object-cover rounded-lg";
      case 'timeline':
        return "w-32 h-32 object-cover rounded-xl";
      case 'magazine':
        return `w-full ${index === 0 ? 'h-64' : 'h-40'} object-cover rounded-xl`;
      case 'masonry':
        return "w-full h-auto object-cover rounded-xl";
      default:
        return "w-full aspect-square object-cover rounded-xl";
    }
  };

  const renderPhotoContent = (photo: Photo, index: number) => {
    if (album.layout === 'timeline') {
      return (
        <>
          <img 
            src={photo.url} 
            alt={photo.title || 'Photo'}
            className={getImageClasses(index)}
          />
          <div className="flex-1">
            {photo.title && (
              <h4 className="font-bold text-xl text-gray-800 mb-2">{photo.title}</h4>
            )}
            {photo.location && (
              <p className="text-sm text-gray-600 mb-2">📍 {photo.location}</p>
            )}
            {photo.backstory && (
              <p className="text-gray-700">{photo.backstory}</p>
            )}
            {photo.date && (
              <p className="text-xs text-gray-500 mt-2">{photo.date.toLocaleDateString()}</p>
            )}
          </div>
        </>
      );
    }

    if (album.layout === 'polaroid') {
      return (
        <>
          <div className="bg-gray-200 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
            <img 
              src={photo.url} 
              alt={photo.title || 'Photo'}
              className={getImageClasses(index)}
            />
          </div>
          <p className="text-center text-sm text-gray-800 font-bold mt-2 font-handwritten bg-white/80 rounded px-2 py-1">
            {photo.title || 'Memory'}
          </p>
        </>
      );
    }

    return (
      <>
        <div className={`bg-gray-200 rounded-xl mb-3 flex items-center justify-center overflow-hidden ${album.layout === 'magazine' && index === 0 ? '' : 'aspect-square'}`}>
          <img 
            src={photo.url} 
            alt={photo.title || 'Photo'}
            className={getImageClasses(index)}
          />
        </div>
        {photo.title && (
          <h4 className="font-bold text-gray-800">{photo.title}</h4>
        )}
        {photo.location && (
          <p className="text-sm text-gray-600">📍 {photo.location}</p>
        )}
      </>
    );
  };

  const renderLayoutContent = () => {
    if (album.photos.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-8xl mb-4">📸</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">No photos yet!</h3>
          <p className="text-gray-500 mb-6">Start adding photos to your album</p>
          <Button
            onClick={handleAddPhoto}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload First Photo
          </Button>
        </div>
      );
    }

    switch (album.layout) {
      case 'masonry':
        return (
          <MasonryLayout
            photos={album.photos}
            onPhotoClick={handlePhotoClick}
            scaleOnHover={true}
            hoverScale={1.05}
            blurToFocus={true}
            colorShiftOnHover={false}
            animateFrom="bottom"
          />
        );
        
      case 'circular':
        return (
          <CircularGallery
            photos={album.photos}
            onPhotoClick={handlePhotoClick}
            bend={3}
            textColor="#ffffff"
          />
        );
        
      case 'stack':
        return (
          <StackLayout
            photos={album.photos}
            onPhotoClick={handlePhotoClick}
            randomRotation={true}
            sendToBackOnClick={true}
            cardDimensions={{ width: 300, height: 300 }}
          />
        );

      case 'infinite-scroll':
        return (
          <InfiniteScrollLayout
            photos={album.photos}
            onPhotoClick={handlePhotoClick}
            width="40rem"
            maxHeight="70vh"
            itemMinHeight={250}
            isTilted={true}
            tiltDirection="left"
            autoplay={true}
            autoplaySpeed={0.8}
            pauseOnHover={true}
          />
        );

      case 'infinite-menu':
        return (
          <InfiniteMenuLayout
            photos={album.photos}
            onPhotoClick={handlePhotoClick}
          />
        );

      case 'magazine':
        return (
          <MagazineLayout
            photos={album.photos}
            onPhotoClick={handlePhotoClick}
          />
        );
        
      default:
        return (
          <div className={getLayoutClasses()}>
            {album.photos.map((photo, index) => (
              <div
                key={photo.id}
                className={getPhotoCardClasses(index)}
                onClick={() => handlePhotoClick(photo)}
              >
                {renderPhotoContent(photo, index)}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${appTheme.primaryColor} transition-all duration-500`}>
      <div className="container mx-auto px-4 py-8">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Button>
          
          <div className={`flex-1 text-center p-4 rounded-2xl border-4 border-black ${themeStyles[album.theme] || themeStyles['pastel-doodle']}`}>
            <h1 className={`text-3xl font-bold ${album.font !== 'google-font' ? fontStyles[album.font] : ''}`}
                style={album.googleFont ? { fontFamily: album.googleFont } : {}}>
              {album.title}
            </h1>
            <p className="text-sm opacity-80 mt-2">
              {album.category.toUpperCase()} • {album.layout.toUpperCase()} LAYOUT
            </p>
          </div>
        </div>

        {/* Add Photo Button */}
        <div className="text-center mb-8">
          <Button
            onClick={handleAddPhoto}
            className={`bg-gradient-to-r ${appTheme.accentColor} hover:opacity-90 text-white font-bold py-3 px-6 rounded-full transition-all duration-200`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Photos
          </Button>
        </div>

        {/* Layout Content */}
        {renderLayoutContent()}

        {/* Photo Review Modal */}
        <PhotoReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          photoUrl={pendingPhotoUrl}
          fileName={pendingFileName}
          onSavePhoto={handleSavePhoto}
        />

        {/* Photo Detail Modal */}
        <PhotoDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          photo={selectedPhoto}
          onDeletePhoto={handleDeletePhoto}
        />
      </div>
    </div>
  );
};
