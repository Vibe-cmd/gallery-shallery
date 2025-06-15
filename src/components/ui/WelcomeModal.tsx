
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppTheme } from "@/pages/Index";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeSelect: (theme: AppTheme) => void;
}

export const WelcomeModal = ({ isOpen, onClose, onThemeSelect }: WelcomeModalProps) => {
  const [selectedTheme, setSelectedTheme] = useState<AppTheme | null>(null);

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

  const handleContinue = () => {
    if (selectedTheme) {
      onThemeSelect(selectedTheme);
    }
    onClose();
  };

  const getThemePreviewStyle = (theme: AppTheme) => {
    if (theme.customColors) {
      return {
        background: `linear-gradient(to right, ${theme.customColors.primary}30, ${theme.customColors.secondary}30, ${theme.customColors.accent}30)`
      };
    }
    return {};
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-4">
            Welcome to Gallery Shallery! 🎨
          </DialogTitle>
          <p className="text-center text-gray-600 mb-6">
            Choose your favorite theme to get started with your photo gallery experience
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {predefinedThemes.map((theme) => (
            <button
              key={theme.name}
              type="button"
              onClick={() => setSelectedTheme(theme)}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-105 ${
                selectedTheme?.name === theme.name
                  ? 'border-purple-500 bg-purple-100 scale-105'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div 
                className={`w-full h-16 rounded-lg mb-3 ${
                  theme.customColors 
                    ? '' 
                    : `bg-gradient-to-r ${theme.primaryColor}`
                }`}
                style={theme.customColors ? getThemePreviewStyle(theme) : {}}
              ></div>
              <div className="font-bold text-sm">{theme.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {theme.name === 'Comic Classic' && 'Bright and playful'}
                {theme.name === 'Dark Mode' && 'Sleek and modern'}
                {theme.name === 'Midnight Purple' && 'Deep and mysterious'}
                {theme.name === 'Ocean Breeze' && 'Cool and refreshing'}
                {theme.name === 'Sunset Vibes' && 'Warm and vibrant'}
                {theme.name === 'Forest Green' && 'Natural and calming'}
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => {
              setSelectedTheme(predefinedThemes[0]); // Default to Comic Classic
              handleContinue();
            }}
            variant="outline"
            className="px-6 py-2"
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedTheme}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-2"
          >
            Continue with {selectedTheme?.name || 'Selected Theme'} ✨
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
