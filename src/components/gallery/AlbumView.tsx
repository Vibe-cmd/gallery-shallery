
import { useState, useRef } from "react";
import { ArrowLeft, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Album, Photo, AppTheme } from "@/pages/Index";
import { PhotoReviewModal } from "./PhotoReviewModal";
import { PhotoDetailModal } from "./PhotoDetailModal";

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
  };

  const fontStyles = {
    handwritten: 'font-handwritten',
    typewriter: 'font-mono',
    bubble: 'font-black',
    'google-font': 'font-sans',
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
            className="rounded-full comic-shadow"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Button>
          
          <div className={`flex-1 text-center p-4 rounded-2xl border-4 border-black comic-shadow ${themeStyles[album.theme]}`}>
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
            className={`bg-gradient-to-r ${appTheme.accentColor} hover:opacity-90 text-white font-bold py-3 px-6 rounded-full comic-shadow transition-all duration-200`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Photos
          </Button>
        </div>

        {/* Photos Grid */}
        {album.photos.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No photos yet!</h3>
            <p className="text-gray-500 mb-6">Start adding photos to your album</p>
            <Button
              onClick={handleAddPhoto}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full comic-shadow"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload First Photo
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            album.layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            album.layout === 'panel' ? 'grid-cols-1 md:grid-cols-2' :
            album.layout === 'vertical' ? 'grid-cols-1 max-w-2xl mx-auto' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {album.photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-2xl p-4 border-4 border-black comic-shadow cursor-pointer transform hover:scale-105 transition-all duration-200"
                onClick={() => handlePhotoClick(photo)}
              >
                <div className="aspect-square bg-gray-200 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                  <img 
                    src={photo.url} 
                    alt={photo.title || 'Photo'}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                {photo.title && (
                  <h4 className="font-bold text-gray-800">{photo.title}</h4>
                )}
                {photo.location && (
                  <p className="text-sm text-gray-600">📍 {photo.location}</p>
                )}
              </div>
            ))}
          </div>
        )}

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
        />
      </div>
    </div>
  );
};
