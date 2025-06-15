
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Photo } from "@/pages/Index";
import { X, MapPin, Calendar, Heart } from "lucide-react";

interface PhotoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo | null;
}

export const PhotoDetailModal = ({ isOpen, onClose, photo }: PhotoDetailModalProps) => {
  if (!photo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Close button */}
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 z-10 rounded-full bg-white/90 backdrop-blur-sm"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Photo */}
          <div className="w-full max-h-[60vh] bg-gray-100 flex items-center justify-center overflow-hidden">
            <img 
              src={photo.url} 
              alt={photo.title || 'Photo'}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Photo details */}
          <div className="p-6 space-y-4">
            {photo.title && (
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-gray-800">
                  {photo.title}
                </DialogTitle>
              </DialogHeader>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {photo.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{photo.date.toLocaleDateString()}</span>
                </div>
              )}
              
              {photo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{photo.location}</span>
                </div>
              )}
            </div>

            {photo.backstory && (
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-gray-700">Story</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{photo.backstory}</p>
              </div>
            )}

            {photo.stickers && photo.stickers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photo.stickers.map((sticker, index) => (
                  <span key={index} className="text-2xl">{sticker}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
