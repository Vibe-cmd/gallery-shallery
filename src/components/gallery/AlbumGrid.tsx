
import { Album } from "@/pages/Index";
import { AlbumCard } from "./AlbumCard";

interface AlbumGridProps {
  albums: Album[];
  onAlbumClick: (album: Album) => void;
  onToggleFavorite: (albumId: string) => void;
  onDeleteAlbum: (albumId: string) => void;
}

export const AlbumGrid = ({ albums, onAlbumClick, onToggleFavorite, onDeleteAlbum }: AlbumGridProps) => {
  if (albums.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-8xl mb-4">📚</div>
        <h3 className="text-2xl font-bold text-gray-600 mb-2">No albums yet!</h3>
        <p className="text-gray-500">Create your first album to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {albums.map((album, index) => (
        <AlbumCard 
          key={album.id} 
          album={album} 
          index={index}
          onClick={() => onAlbumClick(album)}
          onToggleFavorite={onToggleFavorite}
          onDeleteAlbum={onDeleteAlbum}
        />
      ))}
    </div>
  );
};
