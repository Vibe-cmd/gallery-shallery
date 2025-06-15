
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Photo } from "@/pages/Index";
import { X, MapPin, Calendar, Heart, Download, Share2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo | null;
  onDeletePhoto?: (photoId: string) => void;
}

export const PhotoDetailModal = ({ isOpen, onClose, photo, onDeletePhoto }: PhotoDetailModalProps) => {
  const { toast } = useToast();
  
  if (!photo) return null;

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = photo.url;
      link.download = photo.title || 'photo';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your photo is being downloaded!",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the photo.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share({
          title: photo.title || 'Check out this photo!',
          text: photo.backstory || 'Amazing photo from my gallery',
          url: window.location.href,
        });
        
        toast({
          title: "Shared Successfully!",
          description: "Photo has been shared.",
        });
        return;
      }
      
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Photo link has been copied to your clipboard.",
      });
      
    } catch (error) {
      console.error('Share error:', error);
      
      // Final fallback - manual copy
      try {
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          toast({
            title: "Link Copied!",
            description: "Photo link has been copied to your clipboard.",
          });
        } else {
          throw new Error('Copy command failed');
        }
      } catch (fallbackError) {
        toast({
          title: "Share Failed",
          description: "Unable to share or copy the photo link. Your browser may not support this feature.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      onDeletePhoto?.(photo.id);
      onClose();
      toast({
        title: "Photo Deleted",
        description: "The photo has been removed from your album.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative h-full">
          {/* Close button */}
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 z-20 rounded-full bg-black/80 backdrop-blur-sm text-white border-white/20 hover:bg-black/90"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Action buttons */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="rounded-full bg-black/80 backdrop-blur-sm text-white border-white/20 hover:bg-black/90"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="rounded-full bg-black/80 backdrop-blur-sm text-white border-white/20 hover:bg-black/90"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              size="sm"
              className="rounded-full bg-red-600/80 backdrop-blur-sm text-white border-white/20 hover:bg-red-700/90"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 h-full min-h-[600px]">
            {/* Photo Section */}
            <div className="lg:col-span-2 relative bg-black flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
              <img 
                src={photo.url} 
                alt={photo.title || 'Photo'}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
              
              {/* Photo overlay info */}
              {photo.title && (
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    {photo.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-white/90">
                    {photo.date && (
                      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{photo.date.toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {photo.location && (
                      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{photo.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="bg-white p-6 overflow-y-auto space-y-6">
              {photo.title && (
                <div>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
                      {photo.title}
                    </DialogTitle>
                  </DialogHeader>
                </div>
              )}

              {/* Metadata */}
              <div className="space-y-3">
                {photo.date && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="bg-blue-500 p-2 rounded-full">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium text-gray-800">{photo.date.toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                
                {photo.location && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="bg-green-500 p-2 rounded-full">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-800">{photo.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Backstory */}
              {photo.backstory && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-full">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">Story Behind the Photo</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                    <p className="text-gray-700 leading-relaxed italic">"{photo.backstory}"</p>
                  </div>
                </div>
              )}

              {/* Stickers */}
              {photo.stickers && photo.stickers.length > 0 && (
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span>✨</span>
                    Decorations
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {photo.stickers.map((sticker, index) => (
                      <div 
                        key={index} 
                        className="text-3xl bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform cursor-pointer"
                      >
                        {sticker}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Stats */}
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                <h4 className="font-bold text-gray-800 mb-2">Photo Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Added on</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Decorations</p>
                    <p className="font-medium">{photo.stickers?.length || 0} items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
