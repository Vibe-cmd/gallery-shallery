
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { AppTheme } from "@/pages/Index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
}

export const AppSettingsModal = ({ 
  isOpen, 
  onClose, 
  currentTheme, 
  onThemeChange,
  homeCustomization = { blurIntensity: 0, customEmojis: [], showDecorations: true },
  onHomeCustomizationChange,
  customFont,
  onFontChange
}: AppSettingsModalProps) => {
  const [customGoogleFont, setCustomGoogleFont] = useState("");
  const [customTheme, setCustomTheme] = useState({
    name: "",
    primaryColor: "from-blue-100 via-purple-50 to-pink-100",
    backgroundColor: "bg-white",
    accentColor: "from-blue-500 to-purple-500"
  });
  const [customThemes, setCustomThemes] = useState<AppTheme[]>([]);
  
  // Color picker states
  const [customColors, setCustomColors] = useState({
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    accent: "#EC4899"
  });
  
  // Home customization states
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(homeCustomization.backgroundImage || "");
  const [blurValue, setBlurValue] = useState([homeCustomization.blurIntensity]);
  const [customEmojiInput, setCustomEmojiInput] = useState("");

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

  const handleCreateCustomTheme = () => {
    if (customTheme.name.trim()) {
      const newTheme: AppTheme = {
        ...customTheme,
        name: customTheme.name.trim()
      };
      setCustomThemes([...customThemes, newTheme]);
      setCustomTheme({
        name: "",
        primaryColor: "from-blue-100 via-purple-50 to-pink-100",
        backgroundColor: "bg-white",
        accentColor: "from-blue-500 to-purple-500"
      });
    }
  };

  const handleCreateColorTheme = () => {
    const themeName = `Custom ${Date.now()}`;
    const newTheme: AppTheme = {
      name: themeName,
      primaryColor: `from-[${customColors.primary}20] via-[${customColors.secondary}10] to-[${customColors.accent}20]`,
      backgroundColor: 'bg-white',
      accentColor: `from-[${customColors.primary}] to-[${customColors.secondary}]`
    };
    setCustomThemes([...customThemes, newTheme]);
  };

  const handleHomeCustomizationUpdate = (updates: Partial<HomeCustomization>) => {
    const newCustomization = { ...homeCustomization, ...updates };
    onHomeCustomizationChange?.(newCustomization);
  };

  const handleAddCustomEmoji = () => {
    if (customEmojiInput.trim()) {
      const newEmojis = [...homeCustomization.customEmojis, customEmojiInput.trim()];
      handleHomeCustomizationUpdate({ customEmojis: newEmojis });
      setCustomEmojiInput("");
    }
  };

  const gradientOptions = [
    { name: "Blue Purple", value: "from-blue-100 via-purple-50 to-pink-100" },
    { name: "Green Teal", value: "from-green-100 via-emerald-50 to-teal-100" },
    { name: "Orange Red", value: "from-orange-100 via-red-50 to-pink-100" },
    { name: "Purple Pink", value: "from-purple-100 via-pink-50 to-rose-100" },
    { name: "Dark Theme", value: "from-gray-900 via-purple-900 to-black" },
    { name: "Yellow Orange", value: "from-yellow-100 via-orange-50 to-red-100" }
  ];

  const accentOptions = [
    { name: "Blue Purple", value: "from-blue-500 to-purple-500" },
    { name: "Green Teal", value: "from-green-500 to-emerald-500" },
    { name: "Orange Red", value: "from-orange-500 to-red-500" },
    { name: "Purple Pink", value: "from-purple-500 to-pink-500" },
    { name: "Pink Red", value: "from-pink-500 to-red-500" },
    { name: "Cyan Blue", value: "from-cyan-500 to-blue-500" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">App Settings ⚙️</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="colors">Color Picker</TabsTrigger>
            <TabsTrigger value="home">Home Screen</TabsTrigger>
            <TabsTrigger value="fonts">Fonts</TabsTrigger>
          </TabsList>

          <TabsContent value="themes" className="space-y-6">
            {/* Theme Selection */}
            <div>
              <Label className="text-lg font-bold mb-3 block">App Theme</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {allThemes.map((theme) => (
                  <button
                    key={theme.name}
                    type="button"
                    onClick={() => onThemeChange(theme)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      currentTheme.name === theme.name
                        ? 'border-purple-500 bg-purple-100 scale-105'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className={`w-full h-12 rounded-lg mb-2 bg-gradient-to-r ${theme.primaryColor}`}></div>
                    <div className="font-bold text-sm">{theme.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Theme Creator */}
            <div className="border-t pt-6">
              <Label className="text-lg font-bold mb-3 block">Create Custom Theme</Label>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Theme Name</Label>
                  <Input
                    value={customTheme.name}
                    onChange={(e) => setCustomTheme({...customTheme, name: e.target.value})}
                    placeholder="My Awesome Theme"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">Background Gradient</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {gradientOptions.map((gradient) => (
                      <button
                        key={gradient.name}
                        type="button"
                        onClick={() => setCustomTheme({...customTheme, primaryColor: gradient.value})}
                        className={`p-3 rounded-lg border-2 ${
                          customTheme.primaryColor === gradient.value ? 'border-purple-500' : 'border-gray-300'
                        }`}
                      >
                        <div className={`w-full h-8 rounded bg-gradient-to-r ${gradient.value} mb-1`}></div>
                        <div className="text-xs font-medium">{gradient.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Accent Color</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {accentOptions.map((accent) => (
                      <button
                        key={accent.name}
                        type="button"
                        onClick={() => setCustomTheme({...customTheme, accentColor: accent.value})}
                        className={`p-3 rounded-lg border-2 ${
                          customTheme.accentColor === accent.value ? 'border-purple-500' : 'border-gray-300'
                        }`}
                      >
                        <div className={`w-full h-8 rounded bg-gradient-to-r ${accent.value} mb-1`}></div>
                        <div className="text-xs font-medium">{accent.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleCreateCustomTheme}
                  disabled={!customTheme.name.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Create Custom Theme 🎨
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-6">
            <div>
              <Label className="text-lg font-bold mb-4 block">Create Theme with Color Picker</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Primary Color</Label>
                  <Input
                    type="color"
                    value={customColors.primary}
                    onChange={(e) => setCustomColors({...customColors, primary: e.target.value})}
                    className="h-12 w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Secondary Color</Label>
                  <Input
                    type="color"
                    value={customColors.secondary}
                    onChange={(e) => setCustomColors({...customColors, secondary: e.target.value})}
                    className="h-12 w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Accent Color</Label>
                  <Input
                    type="color"
                    value={customColors.accent}
                    onChange={(e) => setCustomColors({...customColors, accent: e.target.value})}
                    className="h-12 w-full"
                  />
                </div>
              </div>
              
              {/* Preview */}
              <div className="mt-4 p-4 rounded-xl border-2 border-gray-300">
                <Label className="text-sm font-medium mb-2 block">Preview</Label>
                <div 
                  className="w-full h-16 rounded-lg"
                  style={{
                    background: `linear-gradient(to right, ${customColors.primary}20, ${customColors.secondary}10, ${customColors.accent}20)`
                  }}
                ></div>
              </div>

              <Button
                onClick={handleCreateColorTheme}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Create Theme from Colors 🎨
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="home" className="space-y-6">
            <div>
              <Label className="text-lg font-bold mb-4 block">Home Screen Customization</Label>
              
              {/* Background Image */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Background Image URL</Label>
                  <Input
                    value={backgroundImageUrl}
                    onChange={(e) => setBackgroundImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/your-image-url"
                    className="mb-2"
                  />
                  <Button
                    onClick={() => handleHomeCustomizationUpdate({ backgroundImage: backgroundImageUrl })}
                    disabled={!backgroundImageUrl.trim()}
                    variant="outline"
                    size="sm"
                  >
                    Apply Background
                  </Button>
                </div>

                {/* Blur Intensity */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
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

                {/* Custom Emojis */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Custom Decorative Emojis</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={customEmojiInput}
                      onChange={(e) => setCustomEmojiInput(e.target.value)}
                      placeholder="Add emoji (e.g., 🌟, 🎨, 📸)"
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddCustomEmoji}
                      disabled={!customEmojiInput.trim()}
                      variant="outline"
                      size="sm"
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

                {/* Show Decorations Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={homeCustomization.showDecorations}
                    onChange={(e) => handleHomeCustomizationUpdate({ showDecorations: e.target.checked })}
                    className="rounded"
                  />
                  <Label className="text-sm font-medium">Show decorative elements</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fonts" className="space-y-6">
            {/* Google Fonts */}
            <div>
              <Label className="text-lg font-bold mb-3 block">Add Google Font</Label>
              <div className="flex gap-3">
                <Input
                  value={customGoogleFont}
                  onChange={(e) => setCustomGoogleFont(e.target.value)}
                  placeholder="Enter font name (e.g., Poppins, Roboto)"
                  className="flex-1"
                />
                <Button
                  onClick={handleAddGoogleFont}
                  disabled={!customGoogleFont.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Add Font
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                The font will be loaded from Google Fonts and applied to the app title and headers
              </p>
              
              {customFont && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    Current font: <span style={{ fontFamily: customFont }} className="font-bold">{customFont}</span>
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Close Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold"
          >
            Save Settings ✅
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
