
import { useEffect, useRef } from "react";
import { Photo } from "@/pages/Index";

// OGL imports and types
type GL = any;

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: number;
  return function (this: any, ...args: Parameters<T>) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: any): void {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof instance[key] === "function") {
      instance[key] = instance[key].bind(instance);
    }
  });
}

interface CircularGalleryProps {
  photos: Photo[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  onPhotoClick?: (photo: Photo) => void;
}

// Simplified version focusing on CSS-based circular layout since OGL is complex
export const CircularGallery = ({ 
  photos, 
  onPhotoClick,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  scrollSpeed = 2 
}: CircularGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-96 overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ perspective: '1000px' }}
    >
      <div className="flex items-center justify-center h-full">
        {photos.map((photo, index) => {
          const angle = (index / photos.length) * 360;
          const radius = 200;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const z = Math.sin((angle * Math.PI) / 180) * radius;
          
          return (
            <div
              key={photo.id}
              className="absolute w-32 h-32 transition-all duration-500 hover:scale-110 cursor-pointer"
              style={{
                transform: `translateX(${x}px) translateZ(${z}px) rotateY(${angle}deg)`,
                transformStyle: 'preserve-3d',
              }}
              onClick={() => onPhotoClick?.(photo)}
            >
              <img
                src={photo.url}
                alt={photo.title || 'Photo'}
                className="w-full h-full object-cover rounded-lg border-2 border-white shadow-lg"
              />
              {photo.title && (
                <div className="absolute -bottom-6 left-0 right-0 text-center">
                  <span 
                    className="text-xs font-bold px-2 py-1 rounded"
                    style={{ color: textColor }}
                  >
                    {photo.title}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
