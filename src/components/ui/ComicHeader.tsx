
import { AppTheme } from "@/pages/Index";

interface ComicHeaderProps {
  appTheme?: AppTheme;
  customFont?: string;
}

export const ComicHeader = ({ appTheme, customFont }: ComicHeaderProps) => {
  const titleStyle = customFont ? { fontFamily: customFont } : {};
  
  const getTitleTextStyle = () => {
    if (appTheme?.customColors) {
      return {
        ...titleStyle,
        background: `linear-gradient(45deg, ${appTheme.customColors.primary}, ${appTheme.customColors.secondary}, ${appTheme.customColors.accent})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textShadow: 'none',
        fontWeight: '900'
      };
    }
    return titleStyle;
  };

  const getSubtitleStyle = () => {
    if (appTheme?.customColors) {
      return {
        ...titleStyle,
        color: 'white',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)',
        fontWeight: 'bold'
      };
    }
    return titleStyle;
  };

  const getBubbleBackgroundStyle = () => {
    if (appTheme?.customColors) {
      return {
        background: `linear-gradient(135deg, ${appTheme.customColors.primary}40, ${appTheme.customColors.secondary}50)`,
        backdropFilter: 'blur(10px)',
        border: '3px solid rgba(255,255,255,0.4)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      };
    }
    return {};
  };

  const getBubbleTextColor = () => {
    if (appTheme?.customColors) {
      return 'white';
    }
    return 'text-gray-800';
  };

  const getTitleClasses = () => {
    if (appTheme?.customColors) {
      return 'text-6xl md:text-8xl font-black comic-shadow transform hover:scale-105 transition-transform duration-300';
    }
    return `text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r ${appTheme?.accentColor || 'from-purple-600 via-pink-600 to-red-600'} comic-shadow transform hover:scale-105 transition-transform duration-300`;
  };
  
  return (
    <div className="text-center mb-16 relative py-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`w-[500px] h-40 ${
            appTheme?.customColors 
              ? '' 
              : `bg-gradient-to-r ${appTheme?.accentColor || 'from-yellow-300 via-orange-300 to-red-300'}`
          } rounded-full opacity-20 transform rotate-3`}
          style={appTheme?.customColors ? {
            background: `linear-gradient(to right, ${appTheme.customColors.primary}40, ${appTheme.customColors.secondary}40, ${appTheme.customColors.accent}40)`
          } : {}}
        ></div>
        <div 
          className={`absolute w-32 h-32 ${
            appTheme?.customColors 
              ? '' 
              : `bg-gradient-to-r ${appTheme?.accentColor || 'from-pink-400 to-purple-400'}`
          } rounded-full opacity-30 transform -rotate-12 -top-4 -left-16`}
          style={appTheme?.customColors ? {
            background: `linear-gradient(to right, ${appTheme.customColors.primary}60, ${appTheme.customColors.accent}60)`
          } : {}}
        ></div>
        <div 
          className={`absolute w-24 h-24 ${
            appTheme?.customColors 
              ? '' 
              : `bg-gradient-to-r ${appTheme?.accentColor || 'from-blue-400 to-cyan-400'}`
          } rounded-full opacity-25 transform rotate-45 -bottom-8 -right-12`}
          style={appTheme?.customColors ? {
            background: `linear-gradient(to right, ${appTheme.customColors.secondary}60, ${appTheme.customColors.accent}60)`
          } : {}}
        ></div>
      </div>
      
      {/* Main title with enhanced styling */}
      <div className="relative z-10 space-y-4">
        <h1 
          className={getTitleClasses()}
          style={getTitleTextStyle()}
        >
          Gallery Shallery
        </h1>
        
        {/* Subtitle with speech bubble effect */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div 
            className={`${
              appTheme?.customColors 
                ? '' 
                : 'bg-white'
            } rounded-2xl px-6 py-3 border-4 border-black comic-shadow transform -rotate-1 hover:rotate-0 transition-transform duration-200`}
            style={appTheme?.customColors ? getBubbleBackgroundStyle() : {}}
          >
            <p 
              className={`text-xl font-bold ${getBubbleTextColor()}`} 
              style={getSubtitleStyle()}
            >
              Your Digital Scrapbook ✨
            </p>
          </div>
          
          <div className="bg-yellow-300 rounded-2xl px-4 py-2 border-4 border-black comic-shadow transform rotate-2 hover:rotate-0 transition-transform duration-200">
            <p className="font-bold text-lg">📸</p>
          </div>
          
          <div className="bg-pink-300 rounded-2xl px-4 py-2 border-4 border-black comic-shadow transform -rotate-3 hover:rotate-0 transition-transform duration-200">
            <p className="font-bold text-lg">🎨</p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center items-center space-x-8 mt-8">
          <div className="text-4xl animate-pulse">⭐</div>
          <div 
            className={`${
              appTheme?.customColors 
                ? 'text-white' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            } px-4 py-2 rounded-full font-bold text-sm transform rotate-1`}
            style={appTheme?.customColors ? {
              background: `linear-gradient(to right, ${appTheme.customColors.primary}, ${appTheme.customColors.accent})`,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)',
              fontWeight: 'bold'
            } : {}}
          >
            Create • Organize • Remember
          </div>
          <div className="text-4xl animate-pulse">✨</div>
        </div>
      </div>
    </div>
  );
};
