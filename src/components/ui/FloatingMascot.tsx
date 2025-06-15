
import { useState } from "react";

export const FloatingMascot = () => {
  const [showTip, setShowTip] = useState(false);

  const handleClick = () => {
    setShowTip(true);
    setTimeout(() => setShowTip(false), 4000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Speech bubble tip */}
      {showTip && (
        <div className="absolute bottom-16 right-0 bg-white rounded-2xl px-4 py-3 border-4 border-black comic-shadow max-w-xs animate-fade-in">
          <p className="text-sm font-bold text-gray-800">
            💡 Tip: Try different themes and layouts for your albums!
          </p>
          <div className="absolute bottom-0 right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      )}
      
      {/* Mascot */}
      <div 
        className="text-6xl cursor-pointer select-none transform transition-transform duration-200 hover:scale-110"
        onClick={handleClick}
      >
        👋
      </div>
    </div>
  );
};
