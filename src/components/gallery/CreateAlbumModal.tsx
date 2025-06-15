
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Album } from "@/pages/Index";
import { Camera, Map, Heart, Tag } from "lucide-react";

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
  const [layout, setLayout] = useState<Album['layout']>('grid');

  const themes = [
    { id: 'pastel-doodle', name: 'Pastel Doodle', preview: 'bg-gradient-to-br from-pink-200 to-purple-200' },
    { id: 'comic-noir', name: 'Comic Noir', preview: 'bg-gradient-to-br from-gray-800 to-black' },
    { id: 'sticker-burst', name: 'Sticker Burst', preview: 'bg-gradient-to-br from-yellow-300 to-orange-300' },
  ];

  const fonts = [
    { id: 'handwritten', name: 'Handwritten', preview: 'font-handwritten' },
    { id: 'typewriter', name: 'Typewriter', preview: 'font-mono' },
    { id: 'bubble', name: 'Bubble', preview: 'font-black' },
  ];

  const layouts = [
    { id: 'grid', name: 'Photo Grid', description: 'Classic grid layout' },
    { id: 'panel', name: 'Comic Panel', description: 'Comic book style' },
    { id: 'vertical', name: 'Vertical Scroll', description: 'Instagram-like feed' },
    { id: 'collage', name: 'Collage Style', description: 'Artistic arrangement' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateAlbum({
      title: title.trim(),
      category,
      theme,
      font,
      layout,
      photos: [],
    });

    // Reset form
    setTitle("");
    setCategory('clicks');
    setTheme('pastel-doodle');
    setFont('handwritten');
    setLayout('grid');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
            <div className="grid grid-cols-3 gap-3">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  type="button"
                  onClick={() => setTheme(themeOption.id as Album['theme'])}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === themeOption.id
                      ? 'border-purple-500 scale-105'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className={`w-full h-16 rounded-lg mb-2 ${themeOption.preview}`}></div>
                  <span className="font-bold text-sm">{themeOption.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Selection */}
          <div>
            <Label className="text-lg font-bold mb-3 block">Font Style</Label>
            <div className="grid grid-cols-3 gap-3">
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
                  <span className="text-sm">{fontOption.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Layout Selection */}
          <div>
            <Label className="text-lg font-bold mb-3 block">Layout Style</Label>
            <div className="grid grid-cols-2 gap-3">
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
                  <div className="font-bold mb-1">{layoutOption.name}</div>
                  <p className="text-sm text-gray-600">{layoutOption.description}</p>
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
