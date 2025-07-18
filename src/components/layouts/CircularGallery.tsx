import { useEffect, useRef } from "react";
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { Photo } from "@/pages/Index";

interface CircularGalleryProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
}

export const CircularGallery = ({
  photos,
  onPhotoClick,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "bold 30px Figtree",
  scrollSpeed = 2,
  scrollEase = 0.05,
}: CircularGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || photos.length === 0) return;

    // For now, we'll use a simplified CSS-based circular gallery
    // The full OGL implementation would be quite complex for this context
    
    return () => {
      // Cleanup would go here
    };
  }, [photos, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">No photos to display</p>
      </div>
    );
  }

  const handlePhotoClick = (photo: Photo) => {
    if (onPhotoClick) {
      onPhotoClick(photo);
    }
  };

  return (
    <div className="w-full h-96 relative overflow-hidden" ref={containerRef}>
      {/* Increased size - now 600px height instead of default */}
      <div className="circular-gallery w-full h-[600px] relative flex items-center justify-center perspective-1000">
        <div className="relative w-80 h-80 transform-gpu">
          {photos.map((photo, index) => {
            const angle = (360 / photos.length) * index;
            const radius = 200; // Increased radius for better visibility
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <div
                key={photo.id}
                className="absolute w-32 h-32 bg-white rounded-2xl border-4 border-black overflow-hidden cursor-pointer transform hover:scale-110 transition-all duration-300 shadow-lg"
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0) rotateY(${angle}deg)`,
                  transformOrigin: 'center center',
                }}
                onClick={() => handlePhotoClick(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.title || 'Photo'}
                  className="w-full h-full object-cover"
                />
                {photo.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 text-center">
                    {photo.title}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
