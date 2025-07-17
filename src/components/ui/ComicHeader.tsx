
import { AppTheme } from "@/pages/Index";

interface ComicHeaderProps {
  appTheme?: AppTheme;
  customFont?: string;
}

export const ComicHeader = ({
  appTheme,
  customFont
}: ComicHeaderProps) => {
  const titleStyle = customFont ? {
    fontFamily: customFont
  } : {};

  const getTitleTextStyle = () => {
    if (appTheme?.customColors) {
      return {
        ...titleStyle,
        background: `linear-gradient(135deg, ${appTheme.customColors.primary}, ${appTheme.customColors.secondary}, ${appTheme.customColors.accent})`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        fontWeight: '900',
        filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.4))'
      };
    }
    return {
      ...titleStyle,
      filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.3))'
    };
  };

  const getTitleBackgroundStyle = () => {
    return {
      padding: '30px 50px 60px 50px',
      position: 'relative',
    };
  };

  const getSubtitleStyle = () => {
    if (appTheme?.customColors) {
      return {
        ...titleStyle,
        background: `linear-gradient(135deg, ${appTheme.customColors.primary}90, ${appTheme.customColors.secondary}90)`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        fontWeight: 'bold',
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
      };
    }
    return {
      ...titleStyle,
      color: 'white',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)',
      fontWeight: 'bold'
    };
  };

  const getBubbleBackgroundStyle = () => {
    if (appTheme?.customColors) {
      return {
        background: `linear-gradient(135deg, ${appTheme.customColors.primary}30, ${appTheme.customColors.secondary}40, ${appTheme.customColors.accent}30)`,
        backdropFilter: 'blur(20px)',
        border: '3px solid rgba(255,255,255,0.3)',
        boxShadow: `
          0 20px 40px rgba(0,0,0,0.2),
          0 8px 16px rgba(0,0,0,0.1),
          inset 0 1px 0 rgba(255,255,255,0.3),
          inset 0 -1px 0 rgba(0,0,0,0.1)`
      };
    }
    return {
      backdropFilter: 'blur(20px)',
      border: '3px solid rgba(255,255,255,0.4)',
      boxShadow: `
        0 20px 40px rgba(0,0,0,0.15),
        0 8px 16px rgba(0,0,0,0.1),
        inset 0 1px 0 rgba(255,255,255,0.3)`
    };
  };

  const getBubbleTextColor = () => {
    if (appTheme?.customColors) {
      return 'white';
    }
    return 'text-gray-800';
  };

  const getTitleClasses = () => {
    if (appTheme?.customColors) {
      return 'text-6xl md:text-8xl font-black transform hover:scale-105 transition-all duration-500 animate-bounce-in';
    }
    return 'text-6xl md:text-8xl font-black text-transparent bg-clip-text transform hover:scale-105 transition-all duration-500 animate-bounce-in';
  };

  const getTitleGradientStyle = () => {
    if (appTheme?.customColors) {
      return {};
    }

    const gradientColors = appTheme?.accentColor || 'from-purple-600 via-pink-600 to-red-600';

    if (gradientColors.includes('from-purple-600')) {
      return {
        backgroundImage: 'linear-gradient(135deg, #9333ea, #ec4899, #dc2626, #f59e0b)',
        backgroundSize: '300% 300%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        animation: 'shimmer 3s ease-in-out infinite'
      };
    } else if (gradientColors.includes('from-pink-500')) {
      return {
        backgroundImage: 'linear-gradient(135deg, #ec4899, #a855f7, #3b82f6)',
        backgroundSize: '300% 300%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        animation: 'shimmer 3s ease-in-out infinite'
      };
    } else {
      return {
        backgroundImage: 'linear-gradient(135deg, #9333ea, #ec4899, #dc2626, #f59e0b)',
        backgroundSize: '300% 300%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        animation: 'shimmer 3s ease-in-out infinite'
      };
    }
  };

  const getBackgroundOrbStyle = (index: number) => {
    const colors = appTheme?.customColors ? [
      appTheme.customColors.primary,
      appTheme.customColors.secondary,
      appTheme.customColors.accent
    ] : ['#a855f7', '#ec4899', '#3b82f6'];

    return {
      background: `radial-gradient(circle, ${colors[index % 3]}40, transparent)`,
      animation: `float ${6 + index}s ease-in-out infinite`,
      animationDelay: `${index * 0.5}s`
    };
  };

  return (
    <div className="text-center mb-20 relative py-12">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        {/* Main background orb */}
        <div 
          className="w-[600px] h-48 rounded-full opacity-30 transform rotate-3 animate-pulse"
          style={getBackgroundOrbStyle(0)}
        ></div>
        
        {/* Floating orbs */}
        <div 
          className="absolute w-40 h-40 rounded-full opacity-40 transform -rotate-12 -top-4 -left-16 animate-float"
          style={getBackgroundOrbStyle(1)}
        ></div>
        <div 
          className="absolute w-32 h-32 rounded-full opacity-35 transform rotate-45 -bottom-8 -right-12"
          style={{
            ...getBackgroundOrbStyle(2),
            animation: 'float 8s ease-in-out infinite reverse'
          }}
        ></div>
        
        {/* Additional floating elements */}
        <div 
          className="absolute w-24 h-24 rounded-full opacity-25 transform rotate-12 top-8 right-20"
          style={getBackgroundOrbStyle(0)}
        ></div>
        <div 
          className="absolute w-20 h-20 rounded-full opacity-30 transform -rotate-30 bottom-12 left-16"
          style={getBackgroundOrbStyle(1)}
        ></div>
      </div>
      
      {/* Main title with enhanced styling */}
      <div className="relative z-20 space-y-6">
        <div style={getTitleBackgroundStyle()}>
          {/* Glowing background effect */}
          <div className="absolute inset-0 rounded-3xl opacity-20 animate-glow" style={{
            background: appTheme?.customColors 
              ? `linear-gradient(135deg, ${appTheme.customColors.primary}, ${appTheme.customColors.secondary}, ${appTheme.customColors.accent})`
              : 'linear-gradient(135deg, #a855f7, #ec4899, #3b82f6)',
            filter: 'blur(20px)'
          }}></div>
          
          <h1 
            className={getTitleClasses()} 
            style={{
              ...getTitleTextStyle(),
              ...getTitleGradientStyle(),
              lineHeight: '1.1',
              position: 'relative'
            }}
          >
            Gallery Shallery
          </h1>
        </div>
        
        {/* Enhanced subtitle section */}
        <div className="flex items-center justify-center gap-8 mt-8">
          <div 
            className="rounded-3xl px-8 py-4 transform -rotate-1 hover:rotate-0 transition-all duration-300 hover:scale-105 animate-slide-in-up"
            style={{
              ...getBubbleBackgroundStyle(),
              background: appTheme?.customColors 
                ? `linear-gradient(135deg, ${appTheme.customColors.primary}20, ${appTheme.customColors.secondary}30, ${appTheme.customColors.accent}20)`
                : 'rgba(255,255,255,0.95)'
            }}
          >
            <p className={`text-2xl font-bold ${getBubbleTextColor()}`} style={getSubtitleStyle()}>
              Your Digital Scrapbook ✨
            </p>
          </div>
          
          <div 
            className="rounded-3xl px-6 py-4 transform rotate-2 hover:rotate-0 transition-all duration-300 hover:scale-110 animate-bounce-in bg-gradient-to-br from-yellow-300 via-orange-300 to-red-400"
            style={{
              border: '3px solid rgba(255,255,255,0.4)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              animationDelay: '0.2s'
            }}
          >
            <p className="font-bold text-2xl">📸</p>
          </div>
          
          <div 
            className="rounded-3xl px-6 py-4 transform -rotate-3 hover:rotate-0 transition-all duration-300 hover:scale-110 animate-bounce-in bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400"
            style={{
              border: '3px solid rgba(255,255,255,0.4)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              animationDelay: '0.4s'
            }}
          >
            <p className="font-bold text-2xl">🎨</p>
          </div>
        </div>

        {/* Enhanced decorative elements */}
        <div className="flex justify-center items-center space-x-12 mt-10">
          <div className="text-5xl animate-pulse pulse-glow" style={{ animationDelay: '0s' }}>⭐</div>
          
          <div 
            className="px-8 py-4 rounded-full font-bold text-lg transform rotate-1 hover:rotate-0 transition-all duration-300 hover:scale-105 animate-slide-in-up"
            style={{
              background: appTheme?.customColors
                ? `linear-gradient(135deg, ${appTheme.customColors.primary}, ${appTheme.customColors.secondary}, ${appTheme.customColors.accent})`
                : 'linear-gradient(135deg, #a855f7, #ec4899, #3b82f6)',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
              border: '2px solid rgba(255,255,255,0.3)',
              animationDelay: '0.6s'
            }}
          >
            Create • Organize • Remember
          </div>
          
          <div className="text-5xl animate-pulse pulse-glow" style={{ animationDelay: '1s' }}>✨</div>
        </div>
      </div>
    </div>
  );
};
