
import { useState } from "react";
import { Lightbulb } from "lucide-react";

export const FloatingMascot = () => {
  const [showTip, setShowTip] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const tips = [
    "💡 Tip: Try different themes and layouts for your albums!",
    "🎨 Tip: Customize your app's appearance in Settings with custom colors and fonts!",
    "⭐ Tip: Mark your favorite albums with the heart icon for quick access!",
    "📁 Tip: Use categories to organize your albums - Clicks, Travel, Personal, or Custom!",
    "💾 Tip: Don't forget to backup your data! Go to Settings > Backup to download all your albums and customizations.",
    "🖼️ Tip: Add stickers and backstories to your photos to make them more memorable!",
    "🎪 Tip: Enable decorations in Settings to add fun emojis to your home screen!"
  ];

  const handleClick = () => {
    if (showTip) {
      setShowTip(false);
    } else {
      setShowTip(true);
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Speech bubble tip */}
      {showTip && (
        <div className="absolute bottom-16 right-0 bg-white rounded-2xl px-4 py-3 border-4 border-black comic-shadow max-w-xs animate-fade-in">
          <p className="text-sm font-bold text-gray-800">
            {tips[currentTipIndex]}
          </p>
          <div className="absolute bottom-0 right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      )}
      
      {/* Mascot */}
      <div 
        className="cursor-pointer select-none transform transition-transform duration-200 hover:scale-110 bg-yellow-400 rounded-full p-3 shadow-lg border-2 border-yellow-500"
        onClick={handleClick}
      >
        <Lightbulb className="w-8 h-8 text-yellow-800" />
      </div>
    </div>
  );
};
