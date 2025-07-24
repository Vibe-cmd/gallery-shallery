import { Photo } from "@/pages/Index";

interface MagazineLayoutProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
}

export const MagazineLayout = ({ photos, onPhotoClick }: MagazineLayoutProps) => {
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
    <div className="magazine-layout grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {photos.map((photo, index) => {
        // Vary photo sizes for magazine style
        const isLarge = index % 7 === 0;
        const isMedium = index % 5 === 0 && !isLarge;
        
        let colSpan = "col-span-1";
        let aspectRatio = "aspect-square";
        
        if (isLarge) {
          colSpan = "col-span-2 row-span-2";
          aspectRatio = "aspect-[4/5]";
        } else if (isMedium) {
          colSpan = "col-span-2";
          aspectRatio = "aspect-[3/2]";
        }

        return (
          <div
            key={photo.id}
            className={`${colSpan} ${aspectRatio} bg-white rounded-2xl border-4 border-black overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg relative`}
            onClick={() => handlePhotoClick(photo)}
          >
            <img
              src={photo.url}
              alt={photo.title || 'Photo'}
              className="w-full h-full object-cover"
            />
            {photo.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-center">
                <h4 className="font-bold text-sm">{photo.title}</h4>
                {photo.location && (
                  <p className="text-xs opacity-80">📍 {photo.location}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};