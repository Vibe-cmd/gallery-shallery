
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppTheme } from "@/pages/Index";

interface AppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

export const AppSettingsModal = ({ isOpen, onClose, currentTheme, onThemeChange }: AppSettingsModalProps) => {
  const [customGoogleFont, setCustomGoogleFont] = useState("");

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

  const handleAddGoogleFont = () => {
    if (customGoogleFont.trim()) {
      const fontLink = document.createElement('link');
      fontLink.href = `https://fonts.googleapis.com/css2?family=${customGoogleFont.replace(' ', '+')}&display=swap`;
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
      
      setCustomGoogleFont("");
      // Could add to a fonts list for future use
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">App Settings ⚙️</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <Label className="text-lg font-bold mb-3 block">App Theme</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {predefinedThemes.map((theme) => (
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
              The font will be loaded from Google Fonts and available for album creation
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold"
            >
              Save Settings ✅
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
