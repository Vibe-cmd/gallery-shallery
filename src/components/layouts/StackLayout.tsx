
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Photo } from "@/pages/Index";

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  photo: Photo;
  onPhotoClick?: (photo: Photo) => void;
}

function CardRotate({ children, onSendToBack, sensitivity, photo, onPhotoClick }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_: never, info: { offset: { x: number; y: number } }) {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="absolute cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
      onClick={() => onPhotoClick?.(photo)}
    >
      {children}
    </motion.div>
  );
}

interface StackLayoutProps {
  photos: Photo[];
  randomRotation?: boolean;
  sensitivity?: number;
  cardDimensions?: { width: number; height: number };
  sendToBackOnClick?: boolean;
  animationConfig?: { stiffness: number; damping: number };
  onPhotoClick?: (photo: Photo) => void;
}

export const StackLayout = ({
  photos,
  randomRotation = false,
  sensitivity = 200,
  cardDimensions = { width: 400, height: 400 }, // Increased size from 300x300
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  onPhotoClick
}: StackLayoutProps) => {
  const [cards, setCards] = useState(photos);
  
  // Update cards when photos prop changes
  useEffect(() => {
    setCards(photos);
  }, [photos]);

  const sendToBack = (photoId: string) => {
    setCards((prev) => {
      const newCards = [...prev];
      const index = newCards.findIndex((photo) => photo.id === photoId);
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">No photos to display</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[600px]"> {/* Increased container height */}
      <div
        className="relative"
        style={{
          width: cardDimensions.width,
          height: cardDimensions.height,
          perspective: 600,
        }}
      >
        {cards.map((photo, index) => {
          const randomRotate = randomRotation
            ? Math.random() * 10 - 5
            : 0;

          return (
            <CardRotate
              key={photo.id}
              photo={photo}
              onSendToBack={() => sendToBack(photo.id)}
              sensitivity={sensitivity}
              onPhotoClick={onPhotoClick}
            >
              <motion.div
                className="border-4 border-white rounded-2xl overflow-hidden shadow-lg"
                onClick={() => sendToBackOnClick && sendToBack(photo.id)}
                animate={{
                  rotateZ: (cards.length - index - 1) * 4 + randomRotate,
                  scale: 1 + index * 0.06 - cards.length * 0.06,
                  transformOrigin: "90% 90%",
                }}
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: animationConfig.stiffness,
                  damping: animationConfig.damping,
                }}
                style={{
                  width: cardDimensions.width,
                  height: cardDimensions.height,
                }}
              >
                <img
                  src={photo.url}
                  alt={photo.title || `Photo ${photo.id}`}
                  className="w-full h-full object-cover pointer-events-none"
                />
                {photo.title && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded text-center text-sm">
                    {photo.title}
                  </div>
                )}
              </motion.div>
            </CardRotate>
          );
        })}
      </div>
    </div>
  );
};
