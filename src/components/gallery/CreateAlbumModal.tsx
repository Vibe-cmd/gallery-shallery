import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Album } from "@/pages/Index";

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAlbum: (album: Omit<Album, 'id' | 'createdAt'>) => void;
  categories: Array<{
    id: string;
    name: string;
    icon: any;
    color: string;
    description: string;
  }>;
}

export const CreateAlbumModal = ({ isOpen, onClose, onCreateAlbum, categories }: CreateAlbumModalProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Album['category']>('clicks');
  const [theme, setTheme] = useState<Album['theme']>('pastel-doodle');
  const [font, setFont] = useState<Album['font']>('handwritten');
  const [googleFont, setGoogleFont] = useState("");
  const [layout, setLayout] = useState<Album['layout']>('grid');

  const themes = [
    { id: 'pastel-doodle', name: 'Pastel Doodle', preview: 'bg-gradient-to-br from-pink-200 to-purple-200' },
    { id: 'comic-noir', name: 'Comic Noir', preview: 'bg-gradient-to-br from-gray-800 to-black' },
    { id: 'sticker-burst', name: 'Sticker Burst', preview: 'bg-gradient-to-br from-yellow-300 to-orange-300' },
    { id: 'neon-pop', name: 'Neon Pop', preview: 'bg-gradient-to-br from-cyan-400 to-blue-500' },
    { id: 'vintage-sketch', name: 'Vintage Sketch', preview: 'bg-gradient-to-br from-amber-200 to-orange-200' },
    { id: 'kawaii-burst', name: 'Kawaii Burst', preview: 'bg-gradient-to-br from-pink-300 to-purple-300' },
    { id: 'retro-wave', name: 'Retro Wave', preview: 'bg-gradient-to-br from-purple-600 to-pink-600' },
    { id: 'forest-nature', name: 'Forest Nature', preview: 'bg-gradient-to-br from-green-400 to-emerald-600' },
    { id: 'ocean-depths', name: 'Ocean Depths', preview: 'bg-gradient-to-br from-blue-600 to-cyan-500' },
    { id: 'sunset-glow', name: 'Sunset Glow', preview: 'bg-gradient-to-br from-orange-400 to-red-500' },
    { id: 'minimalist-white', name: 'Minimalist White', preview: 'bg-gradient-to-br from-gray-100 to-gray-200' },
    { id: 'galaxy-space', name: 'Galaxy Space', preview: 'bg-gradient-to-br from-indigo-900 to-purple-900' },
  ];

  const fonts = [
    { id: 'handwritten', name: 'Handwritten', preview: 'font-handwritten' },
    { id: 'typewriter', name: 'Typewriter', preview: 'font-mono' },
    { id: 'bubble', name: 'Bubble', preview: 'font-black' },
    { id: 'serif-classic', name: 'Serif Classic', preview: 'font-serif' },
    { id: 'sans-modern', name: 'Sans Modern', preview: 'font-sans' },
    { id: 'script-elegant', name: 'Script Elegant', preview: 'font-cursive' },
    { id: 'display-bold', name: 'Display Bold', preview: 'font-black' },
    { id: 'google-font', name: 'Google Font', preview: 'font-sans' },
  ];

  const layouts = [
    { id: 'grid', name: 'Grid', icon: '▦', description: 'Classic photo grid' },
    { id: 'masonry', name: 'Masonry', icon: '⬢', description: 'Pinterest-style layout' },
    { id: 'timeline', name: 'Timeline', icon: '⟶', description: 'Chronological story' },
    { id: 'polaroid', name: 'Polaroid', icon: '📷', description: 'Vintage photo style' },
    { id: 'panel', name: 'Panel', icon: '▣', description: 'Large showcase panels' },
    { id: 'vertical', name: 'Vertical', icon: '⫸', description: 'Single column flow' },
    { id: 'collage', name: 'Collage', icon: '▦', description: 'Creative collage mix' },
    { id: 'magazine', name: 'Magazine', icon: '▤', description: 'Editorial magazine style' },
    { id: 'circular', name: 'Circular', icon: '○', description: '3D circular gallery' },
    { id: 'stack', name: 'Stack', icon: '▢', description: 'Interactive card stack' },
    { id: 'infinite-scroll', name: 'Infinite Scroll', icon: '∞', description: 'Smooth infinite scroll' },
    { id: 'infinite-menu', name: 'Infinite Menu', icon: '◉', description: '3D sphere navigation' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Load Google Font if selected
    if (font === 'google-font' && googleFont.trim()) {
      const fontLink = document.createElement('link');
      fontLink.href = `https://fonts.googleapis.com/css2?family=${googleFont.replace(' ', '+')}&display=swap`;
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }

    onCreateAlbum({
      title: title.trim(),
      category,
      theme,
      font,
      googleFont: font === 'google-font' ? googleFont : undefined,
      layout,
      photos: [],
    });

    // Reset form
    setTitle("");
    setCategory('clicks');
    setTheme('pastel-doodle');
    setFont('handwritten');
    setGoogleFont("");
    setLayout('grid');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Create Your Album! 🎨</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Album Title */}
          <div>
            <Label htmlFor="title" className="text-lg font-bold">Album Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your album a cool name..."
              className="mt-2 text-lg border-2 border-gray-300 focus:border-purple-500"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <Label className="text-lg font-bold mb-3 block">Category</Label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as Album['category'])}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    category === cat.id
                      ? 'border-purple-500 bg-purple-100 scale-105'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <cat.icon className="w-5 h-5" />
                    <span className="font-bold">{cat.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{cat.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <Label className="text-lg font-bold mb-3 block">Theme</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  type="button"
                  onClick={() => setTheme(themeOption.id as Album['theme'])}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    theme === themeOption.id
                      ? 'border-purple-500 scale-105'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className={`w-full h-12 rounded-lg mb-2 ${themeOption.preview}`}></div>
                  <span className="font-bold text-xs">{themeOption.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Selection */}
          <div>
            <Label className="text-lg font-bold mb-3 block">Font Style</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {fonts.map((fontOption) => (
                <button
                  key={fontOption.id}
                  type="button"
                  onClick={() => setFont(fontOption.id as Album['font'])}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    font === fontOption.id
                      ? 'border-purple-500 bg-purple-100 scale-105'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className={`text-lg font-bold mb-1 ${fontOption.preview}`}>Abc</div>
                  <span className="text-xs">{fontOption.name}</span>
                </button>
              ))}
            </div>
            
            {/* Google Font Input */}
            {font === 'google-font' && (
              <div className="mt-3">
                <Input
                  value={googleFont}
                  onChange={(e) => setGoogleFont(e.target.value)}
                  placeholder="Enter Google Font name (e.g., Poppins, Roboto)"
                  className="text-sm"
                />
              </div>
            )}
          </div>

          {/* Layout Selection */}
          <div>
            <Label className="text-lg font-bold mb-3 block">Layout Style</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {layouts.map((layoutOption) => (
                <button
                  key={layoutOption.id}
                  type="button"
                  onClick={() => setLayout(layoutOption.id as Album['layout'])}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    layout === layoutOption.id
                      ? 'border-purple-500 bg-purple-100 scale-105'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-bold mb-1 text-sm">{layoutOption.name}</div>
                  <p className="text-xs text-gray-600">{layoutOption.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold"
            >
              Create Album! 🎉
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
