
import { useState, useEffect } from "react";

export const FloatingMascot = () => {
  const [isWaving, setIsWaving] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const waveInterval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 2000);
    }, 8000);

    const tipInterval = setInterval(() => {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 3000);
    }, 15000);

    return () => {
      clearInterval(waveInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Speech bubble tip */}
      {showTip && (
        <div className="absolute bottom-16 right-0 bg-white rounded-2xl px-4 py-3 border-4 border-black comic-shadow max-w-xs animate-fade-in">
          <p className="text-sm font-bold text-gray-800">
            💡 Tip: Try different themes for your albums!
          </p>
          <div className="absolute bottom-0 right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      )}
      
      {/* Mascot */}
      <div className={`text-6xl cursor-pointer select-none transform transition-transform duration-500 ${isWaving ? 'animate-bounce' : 'hover:scale-110'}`}>
        👋
      </div>
    </div>
  );
};
