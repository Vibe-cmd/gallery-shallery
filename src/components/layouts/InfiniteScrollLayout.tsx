
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { Photo } from "@/pages/Index";

gsap.registerPlugin(Observer);

interface InfiniteScrollLayoutProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
  width?: string;
  maxHeight?: string;
  negativeMargin?: string;
  itemMinHeight?: number;
  isTilted?: boolean;
  tiltDirection?: "left" | "right";
  autoplay?: boolean;
  autoplaySpeed?: number;
  autoplayDirection?: "down" | "up";
  pauseOnHover?: boolean;
}

export const InfiniteScrollLayout: React.FC<InfiniteScrollLayoutProps> = ({
  photos,
  onPhotoClick,
  width = "30rem",
  maxHeight = "70vh",
  negativeMargin = "-0.5em",
  itemMinHeight = 200,
  isTilted = false,
  tiltDirection = "left",
  autoplay = true,
  autoplaySpeed = 2.0,
  autoplayDirection = "down",
  pauseOnHover = true,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getTiltTransform = (): string => {
    if (!isTilted) return "none";
    return tiltDirection === "left"
      ? "rotateX(20deg) rotateZ(-20deg) skewX(20deg)"
      : "rotateX(20deg) rotateZ(20deg) skewX(-20deg)";
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (photos.length === 0) return;

    const divItems = gsap.utils.toArray<HTMLDivElement>(container.children);
    if (!divItems.length) return;

    const firstItem = divItems[0];
    const itemStyle = getComputedStyle(firstItem);
    const itemHeight = firstItem.offsetHeight;
    const itemMarginTop = parseFloat(itemStyle.marginTop) || 0;
    const totalItemHeight = itemHeight + itemMarginTop;
    const totalHeight = itemHeight * photos.length + itemMarginTop * (photos.length - 1);

    const wrapFn = gsap.utils.wrap(-totalHeight, totalHeight);

    divItems.forEach((child, i) => {
      const y = i * totalItemHeight;
      gsap.set(child, { y });
    });

    const observer = Observer.create({
      target: container,
      type: "wheel,touch,pointer",
      preventDefault: true,
      onPress: ({ target }) => {
        (target as HTMLElement).style.cursor = "grabbing";
      },
      onRelease: ({ target }) => {
        (target as HTMLElement).style.cursor = "grab";
      },
      onChange: ({ deltaY, isDragging, event }) => {
        const d = event.type === "wheel" ? -deltaY : deltaY;
        const distance = isDragging ? d * 5 : d * 10;
        divItems.forEach((child) => {
          gsap.to(child, {
            duration: 0.5,
            ease: "expo.out",
            y: `+=${distance}`,
            modifiers: {
              y: gsap.utils.unitize(wrapFn),
            },
          });
        });
      },
    });

    let rafId: number;
    if (autoplay) {
      const directionFactor = autoplayDirection === "down" ? 1 : -1;
      const speedPerFrame = autoplaySpeed * directionFactor;

      const tick = () => {
        divItems.forEach((child) => {
          gsap.set(child, {
            y: `+=${speedPerFrame}`,
            modifiers: {
              y: gsap.utils.unitize(wrapFn),
            },
          });
        });
        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);

      if (pauseOnHover) {
        const stopTicker = () => rafId && cancelAnimationFrame(rafId);
        const startTicker = () => {
          rafId = requestAnimationFrame(tick);
        };

        container.addEventListener("mouseenter", stopTicker);
        container.addEventListener("mouseleave", startTicker);

        return () => {
          observer.kill();
          stopTicker();
          container.removeEventListener("mouseenter", stopTicker);
          container.removeEventListener("mouseleave", startTicker);
        };
      } else {
        return () => {
          observer.kill();
          rafId && cancelAnimationFrame(rafId);
        };
      }
    }

    return () => {
      observer.kill();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [photos, autoplay, autoplaySpeed, autoplayDirection, pauseOnHover, isTilted, tiltDirection, negativeMargin]);

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No photos to display</p>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .infinite-scroll-wrapper {
            max-height: ${maxHeight};
          }
  
          .infinite-scroll-container {
            width: ${width};
          }
  
          .infinite-scroll-item {
            min-height: ${itemMinHeight}px;
            margin-top: ${negativeMargin};
          }
        `}
      </style>
      <div className="infinite-scroll-wrapper relative flex items-center justify-center w-full overflow-hidden" ref={wrapperRef}>
        <div
          className="infinite-scroll-container flex flex-col px-4 cursor-grab"
          ref={containerRef}
          style={{
            transform: getTiltTransform(),
            transformOrigin: "center center",
          }}
        >
          {photos.map((photo, i) => (
            <div 
              className="infinite-scroll-item bg-white rounded-2xl border-4 border-black cursor-pointer transform hover:scale-105 transition-all duration-200 p-4 flex items-center justify-center relative" 
              key={photo.id}
              onClick={() => onPhotoClick?.(photo)}
            >
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={photo.url}
                  alt={photo.title || 'Photo'}
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              </div>
              {photo.title && (
                <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded text-center">
                  <h4 className="font-bold text-sm">{photo.title}</h4>
                  {photo.location && (
                    <p className="text-xs opacity-80">📍 {photo.location}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-gray-900 to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none z-10"></div>
      </div>
    </>
  );
};
