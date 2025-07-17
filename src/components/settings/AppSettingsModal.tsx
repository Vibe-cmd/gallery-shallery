import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AppTheme, Album } from "@/pages/Index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackupSettings } from "./BackupSettings";
import { BackupData } from "@/services/googleDriveBackup";
import { ExternalLink } from "lucide-react";

export interface HomeCustomization {
  backgroundImage?: string;
  blurIntensity: number;
  customEmojis: string[];
  showDecorations: boolean;
}

interface AppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  homeCustomization?: HomeCustomization;
  onHomeCustomizationChange?: (customization: HomeCustomization) => void;
  customFont?: string;
  onFontChange?: (font: string) => void;
  albums: Album[];
  onImportData: (data: BackupData) => void;
}

export const AppSettingsModal = ({ 
  isOpen, 
  onClose, 
  currentTheme, 
  onThemeChange,
  homeCustomization = { blurIntensity: 0, customEmojis: [], showDecorations: true },
  onHomeCustomizationChange,
  customFont,
  onFontChange,
  albums,
  onImportData
}: AppSettingsModalProps) => {
  const [customGoogleFont, setCustomGoogleFont] = useState("");
  const [customThemes, setCustomThemes] = useState<AppTheme[]>([]);
  
  // Color picker states for custom theme
  const [customColors, setCustomColors] = useState({
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    accent: "#EC4899"
  });
  const [customThemeName, setCustomThemeName] = useState("");
  const [customThemeEmojis, setCustomThemeEmojis] = useState<string[]>(['⭐', '✨', '🎨', '📸']);
  const [customEmojiInput, setCustomEmojiInput] = useState("");
  
  // Home customization states
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(homeCustomization.backgroundImage || "");
  const [blurValue, setBlurValue] = useState([homeCustomization.blurIntensity]);
  const [homeEmojiInput, setHomeEmojiInput] = useState("");

  const predefinedThemes: AppTheme[] = [
    {
      name: 'Comic Classic',
      primaryColor: 'from-yellow-100 via-pink-50 to-purple-100',
      backgroundColor: 'bg-white',
      accentColor: 'from-pink-500 to-purple-600'
    },
    {
      name: 'Dark Mode',
      primaryColor: 'from-gray-900 via-purple-900 to-black',
      backgroundColor: 'bg-gray-800',
      accentColor: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Midnight Purple',
      primaryColor: 'from-purple-900 via-indigo-900 to-black',
      backgroundColor: 'bg-gray-900',
      accentColor: 'from-purple-400 to-indigo-400'
    },
    {
      name: 'Dark Ocean',
      primaryColor: 'from-blue-900 via-slate-900 to-black',
      backgroundColor: 'bg-slate-800',
      accentColor: 'from-blue-400 to-cyan-400'
    },
    {
      name: 'Noir',
      primaryColor: 'from-gray-800 via-gray-900 to-black',
      backgroundColor: 'bg-black',
      accentColor: 'from-gray-400 to-white'
    },
    {
      name: 'Dark Forest',
      primaryColor: 'from-emerald-900 via-green-900 to-black',
      backgroundColor: 'bg-green-900',
      accentColor: 'from-emerald-400 to-green-400'
    },
    {
      name: 'Crimson Night',
      primaryColor: 'from-red-900 via-rose-900 to-black',
      backgroundColor: 'bg-red-900',
      accentColor: 'from-red-400 to-rose-400'
    },
    {
      name: 'Ocean Breeze',
      primaryColor: 'from-blue-100 via-cyan-50 to-teal-100',
      backgroundColor: 'bg-white',
      accentColor: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Sunset Vibes',
      primaryColor: 'from-orange-100 via-red-50 to-pink-100',
      backgroundColor: 'bg-white',
      accentColor: 'from-orange-500 to-red-500'
    },
    {
      name: 'Forest Green',
      primaryColor: 'from-green-100 via-emerald-50 to-teal-100',
      backgroundColor: 'bg-white',
      accentColor: 'from-green-500 to-emerald-500'
    }
  ];

  const allThemes = [...predefinedThemes, ...customThemes];

  // Theme styling functions
  const getModalBackgroundStyle = () => {
    if (currentTheme.customColors) {
      return {
        background: `linear-gradient(135deg, 
          ${currentTheme.customColors.primary}95, 
          ${currentTheme.customColors.secondary}90, 
          ${currentTheme.customColors.accent}85)`,
        color: 'white'
      };
    }
    
    // Handle dark themes
    if (currentTheme.name.includes('Dark') || currentTheme.name === 'Noir' || currentTheme.name === 'Midnight Purple') {
      return {
        background: `linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(50, 50, 50, 0.9))`,
        color: 'white'
      };
    }
    
    return {
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(250, 250, 250, 0.9))`,
      color: 'rgb(30, 30, 30)'
    };
  };

  const getTabsBackgroundStyle = () => {
    if (currentTheme.customColors) {
      return {
        background: `linear-gradient(135deg, 
          ${currentTheme.customColors.primary}20, 
          ${currentTheme.customColors.secondary}15, 
          ${currentTheme.customColors.accent}10)`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${currentTheme.customColors.primary}30`
      };
    }
    
    if (currentTheme.name.includes('Dark') || currentTheme.name === 'Noir' || currentTheme.name === 'Midnight Purple') {
      return {
        background: 'rgba(40, 40, 40, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      };
    }
    
    return {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 0, 0, 0.1)'
    };
  };

  const getInputStyle = () => {
    if (currentTheme.customColors) {
      return {
        background: 'rgba(255, 255, 255, 0.1)',
        border: `1px solid ${currentTheme.customColors.primary}40`,
        color: 'white'
      };
    }
    
    if (currentTheme.name.includes('Dark') || currentTheme.name === 'Noir' || currentTheme.name === 'Midnight Purple') {
      return {
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white'
      };
    }
    
    return {};
  };

  const getButtonStyle = () => {
    if (currentTheme.customColors) {
      return {
        background: `linear-gradient(to right, ${currentTheme.customColors.primary}, ${currentTheme.customColors.secondary})`,
        color: 'white',
        border: 'none'
      };
    }
    
    if (currentTheme.name.includes('Dark') || currentTheme.name === 'Noir' || currentTheme.name === 'Midnight Purple') {
      return {
        background: 'linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      };
    }
    
    return {};
  };

  const getTextColor = () => {
    if (currentTheme.customColors) {
      return 'text-white';
    }
    
    if (currentTheme.name.includes('Dark') || currentTheme.name === 'Noir' || currentTheme.name === 'Midnight Purple') {
      return 'text-white';
    }
    
    return 'text-gray-900';
  };

  const handleAddGoogleFont = () => {
    if (customGoogleFont.trim()) {
      const fontLink = document.createElement('link');
      fontLink.href = `https://fonts.googleapis.com/css2?family=${customGoogleFont.replace(' ', '+')}&display=swap`;
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
      
      if (onFontChange) {
        onFontChange(customGoogleFont);
      }
      setCustomGoogleFont("");
    }
  };

  const handleCreateColorTheme = () => {
    if (customThemeName.trim()) {
      const newTheme: AppTheme = {
        name: customThemeName,
        primaryColor: 'custom-gradient',
        backgroundColor: 'bg-white',
        accentColor: 'custom-gradient',
        customColors: {
          primary: customColors.primary,
          secondary: customColors.secondary,
          accent: customColors.accent
        }
      };
      
      const updatedCustomThemes = [...customThemes, newTheme];
      setCustomThemes(updatedCustomThemes);
      onThemeChange(newTheme);
      
      // Apply custom emojis when creating theme
      if (onHomeCustomizationChange && customThemeEmojis.length > 0) {
        onHomeCustomizationChange({
          ...homeCustomization,
          customEmojis: customThemeEmojis
        });
      }
      
      setCustomThemeName("");
      console.log('Created custom theme:', newTheme);
    }
  };

  const handleHomeCustomizationUpdate = (updates: Partial<HomeCustomization>) => {
    const newCustomization = { ...homeCustomization, ...updates };
    onHomeCustomizationChange?.(newCustomization);
  };

  const handleAddCustomEmoji = () => {
    if (customEmojiInput.trim()) {
      const newEmojis = [...customThemeEmojis, customEmojiInput.trim()];
      setCustomThemeEmojis(newEmojis);
      setCustomEmojiInput("");
    }
  };

  const handleAddHomeEmoji = () => {
    if (homeEmojiInput.trim()) {
      const newEmojis = [...homeCustomization.customEmojis, homeEmojiInput.trim()];
      handleHomeCustomizationUpdate({ customEmojis: newEmojis });
      setHomeEmojiInput("");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handleHomeCustomizationUpdate({ backgroundImage: imageUrl });
        setBackgroundImageUrl(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const getThemePreviewStyle = (theme: AppTheme) => {
    if (theme.customColors) {
      return {
        background: `linear-gradient(to right, ${theme.customColors.primary}30, ${theme.customColors.secondary}30, ${theme.customColors.accent}30)`
      };
    }
    return {};
  };

  const getLivePreviewStyle = () => {
    return {
      background: `linear-gradient(to right, ${customColors.primary}30, ${customColors.secondary}30, ${customColors.accent}30)`
    };
  };

  const getLiveButtonPreviewStyle = () => {
    return {
      background: `linear-gradient(to right, ${customColors.primary}, ${customColors.secondary})`
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-6xl max-h-[90vh] overflow-y-auto border-0" 
        style={getModalBackgroundStyle()}
      >
        <DialogHeader>
          <DialogTitle className={`text-2xl font-bold text-center ${getTextColor()}`}>
            App Settings ⚙️
          </DialogTitle>
        </DialogHeader>

        <div 
          className="rounded-lg p-4"
          style={getTabsBackgroundStyle()}
        >
          <Tabs defaultValue="themes" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-transparent">
              <TabsTrigger value="themes" className={getTextColor()}>Themes</TabsTrigger>
              <TabsTrigger value="custom" className={getTextColor()}>Build Custom Theme</TabsTrigger>
              <TabsTrigger value="home" className={getTextColor()}>Home Screen</TabsTrigger>
              <TabsTrigger value="fonts" className={getTextColor()}>Fonts</TabsTrigger>
              <TabsTrigger value="backup" className={getTextColor()}>Backup</TabsTrigger>
            </TabsList>

            <TabsContent value="themes" className="space-y-6">
              <div>
                <Label className={`text-lg font-bold mb-3 block ${getTextColor()}`}>App Theme</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allThemes.map((theme) => (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => onThemeChange(theme)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        currentTheme.name === theme.name
                          ? 'border-purple-500 scale-105'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{
                        background: currentTheme.name === theme.name 
                          ? (currentTheme.customColors 
                            ? `${currentTheme.customColors.primary}20` 
                            : 'rgba(168, 85, 247, 0.2)')
                          : 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div 
                        className={`w-full h-12 rounded-lg mb-2 ${
                          theme.customColors 
                            ? '' 
                            : `bg-gradient-to-r ${theme.primaryColor}`
                        }`}
                        style={theme.customColors ? getThemePreviewStyle(theme) : {}}
                      ></div>
                      <div className={`font-bold text-sm ${getTextColor()}`}>{theme.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-6">
              <div>
                <Label className={`text-lg font-bold mb-4 block ${getTextColor()}`}>Build Custom Theme</Label>
                
                <div className="space-y-6">
                  <div>
                    <Label className={`text-sm font-medium mb-2 block ${getTextColor()}`}>Theme Name</Label>
                    <Input
                      value={customThemeName}
                      onChange={(e) => setCustomThemeName(e.target.value)}
                      placeholder="My Awesome Theme"
                      style={getInputStyle()}
                      className="placeholder:text-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className={`text-sm font-medium mb-2 block ${getTextColor()}`}>Primary Color</Label>
                      <Input
                        type="color"
                        value={customColors.primary}
                        onChange={(e) => setCustomColors({...customColors, primary: e.target.value})}
                        className="h-12 w-full"
                        style={getInputStyle()}
                      />
                    </div>
                    <div>
                      <Label className={`text-sm font-medium mb-2 block ${getTextColor()}`}>Secondary Color</Label>
                      <Input
                        type="color"
                        value={customColors.secondary}
                        onChange={(e) => setCustomColors({...customColors, secondary: e.target.value})}
                        className="h-12 w-full"
                        style={getInputStyle()}
                      />
                    </div>
                    <div>
                      <Label className={`text-sm font-medium mb-2 block ${getTextColor()}`}>Accent Color</Label>
                      <Input
                        type="color"
                        value={customColors.accent}
                        onChange={(e) => setCustomColors({...customColors, accent: e.target.value})}
                        className="h-12 w-full"
                        style={getInputStyle()}
                      />
                    </div>
                  </div>

                  {/* Custom Emojis for Theme */}
                  <div>
                    <Label className={`text-sm font-medium mb-2 block ${getTextColor()}`}>Theme Decorative Emojis</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={customEmojiInput}
                        onChange={(e) => setCustomEmojiInput(e.target.value)}
                        placeholder="Add emoji (e.g., 🌟, 🎨, 📸)"
                        className="flex-1 placeholder:text-gray-400"
                        style={getInputStyle()}
                      />
                      <Button
                        onClick={handleAddCustomEmoji}
                        disabled={!customEmojiInput.trim()}
                        variant="outline"
                        size="sm"
                        style={getButtonStyle()}
                      >
                        Add
                      </Button>
                    </div>
                    
                    {customThemeEmojis.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {customThemeEmojis.map((emoji, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                            onClick={() => {
                              const newEmojis = customThemeEmojis.filter((_, i) => i !== index);
                              setCustomThemeEmojis(newEmojis);
                            }}
                          >
                            {emoji} ✕
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Live Preview */}
                  <div className="p-4 rounded-xl border-2 border-gray-300" style={getTabsBackgroundStyle()}>
                    <Label className={`text-sm font-medium mb-2 block ${getTextColor()}`}>Live Theme Preview</Label>
                    <div 
                      className="w-full h-16 rounded-lg mb-3 flex items-center justify-center gap-2"
                      style={getLivePreviewStyle()}
                    >
                      {customThemeEmojis.slice(0, 4).map((emoji, index) => (
                        <span key={index} className="text-2xl opacity-80">{emoji}</span>
                      ))}
                    </div>
                    <div 
                      className="w-32 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={getLiveButtonPreviewStyle()}
                    >
                      Button
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateColorTheme}
                    disabled={!customThemeName.trim()}
                    className="w-full"
                    style={getButtonStyle()}
                  >
                    Create and Apply Theme 🎨
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="home" className="space-y-6">
              <div>
                <Label className={`text-lg font-bold mb-4 block ${getTextColor()}`}>Home Screen Customization</Label>
                
                <div className="space-y-4">
                  <div>
                    <Label className={`text-sm font-medium mb-2 block ${getTextColor()}`}>Background Image</Label>
                    <div className="space-y-3">
                      <Input
                        value={backgroundImageUrl}
                        onChange={(e) => setBackgroundImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/your-image-url"
                        style={getInputStyle()}
                        className="placeholder:text-gray-400"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleHomeCustomizationUpdate({ backgroundImage: backgroundImageUrl })}
                          disabled={!backgroundImageUrl.trim()}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          style={getButtonStyle()}
                        >
                          Apply URL
                        </Button>
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            style={getInputStyle()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className={`text-sm font-medium mb-2 block ${getTextColor()}`}>
                      Background Blur Intensity: {blurValue[0]}px
                    </Label>
                    <Slider
                      value={blurValue}
                      onValueChange={(value) => {
                        setBlurValue(value);
                        handleHomeCustomizationUpdate({ blurIntensity: value[0] });
                      }}
                      max={20}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className={`text-sm font-medium mb-2 block ${getTextColor()}`}>Home Screen Decorative Emojis</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={homeEmojiInput}
                        onChange={(e) => setHomeEmojiInput(e.target.value)}
                        placeholder="Add emoji (e.g., 🌟, 🎨, 📸)"
                        className="flex-1 placeholder:text-gray-400"
                        style={getInputStyle()}
                      />
                      <Button
                        onClick={handleAddHomeEmoji}
                        disabled={!homeEmojiInput.trim()}
                        variant="outline"
                        size="sm"
                        style={getButtonStyle()}
                      >
                        Add
                      </Button>
                    </div>
                    
                    {homeCustomization.customEmojis.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {homeCustomization.customEmojis.map((emoji, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                            onClick={() => {
                              const newEmojis = homeCustomization.customEmojis.filter((_, i) => i !== index);
                              handleHomeCustomizationUpdate({ customEmojis: newEmojis });
                            }}
                          >
                            {emoji} ✕
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={homeCustomization.showDecorations}
                      onChange={(e) => handleHomeCustomizationUpdate({ showDecorations: e.target.checked })}
                      className="rounded"
                    />
                    <Label className={`text-sm font-medium ${getTextColor()}`}>Show decorative elements</Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fonts" className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className={`text-lg font-bold ${getTextColor()}`}>Add Google Font</Label>
                  <Button
                    onClick={() => window.open('https://fonts.google.com', '_blank')}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                    style={getButtonStyle()}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Browse Fonts
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Input
                    value={customGoogleFont}
                    onChange={(e) => setCustomGoogleFont(e.target.value)}
                    placeholder="Enter font name (e.g., Poppins, Roboto)"
                    className="flex-1 placeholder:text-gray-400"
                    style={getInputStyle()}
                  />
                  <Button
                    onClick={handleAddGoogleFont}
                    disabled={!customGoogleFont.trim()}
                    style={getButtonStyle()}
                  >
                    Add Font
                  </Button>
                </div>
                <p className={`text-xs mt-2 ${getTextColor()} opacity-70`}>
                  The font will be loaded from Google Fonts and applied to the app title and headers
                </p>
                
                {customFont && (
                  <div className="mt-4 p-3 rounded-lg border" style={getTabsBackgroundStyle()}>
                    <p className={`text-sm ${getTextColor()}`}>
                      Current font: <span style={{ fontFamily: customFont }} className="font-bold">{customFont}</span>
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="backup" className="space-y-6">
              <div style={getTabsBackgroundStyle()} className="p-4 rounded-lg">
                <BackupSettings
                  albums={albums}
                  appTheme={currentTheme}
                  homeCustomization={homeCustomization}
                  customFont={customFont || ""}
                  onImportData={onImportData}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={onClose}
            className="font-bold"
            style={getButtonStyle()}
          >
            Save Settings ✅
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
