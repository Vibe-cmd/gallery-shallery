
export const ComicHeader = () => {
  return (
    <div className="text-center mb-12 relative">
      {/* Comic explosion background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-32 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 rounded-full opacity-20 transform rotate-3"></div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 relative z-10 comic-shadow">
        Gallery Shallery
      </h1>
      
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="bg-white rounded-full px-4 py-2 border-4 border-black comic-shadow transform -rotate-2">
          <p className="text-lg font-bold text-gray-800">Your Digital Scrapbook</p>
        </div>
        <div className="text-4xl">🎨</div>
      </div>

      {/* Speech bubble */}
      <div className="absolute -right-10 top-0 bg-yellow-300 rounded-2xl px-4 py-2 border-4 border-black comic-shadow transform rotate-12 hidden md:block">
        <p className="font-bold text-sm">WOW!</p>
        <div className="absolute bottom-0 left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-300"></div>
      </div>
    </div>
  );
};
