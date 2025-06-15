
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Photo } from "@/pages/Index";

interface PhotoReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoUrl: string;
  fileName: string;
  onSavePhoto: (photo: Omit<Photo, 'id'>) => void;
}

export const PhotoReviewModal = ({ isOpen, onClose, photoUrl, fileName, onSavePhoto }: PhotoReviewModalProps) => {
  const [title, setTitle] = useState(fileName.split('.')[0]);
  const [location, setLocation] = useState("");
  const [backstory, setBackstory] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = () => {
    const photo: Omit<Photo, 'id'> = {
      url: photoUrl,
      title: title.trim() || fileName.split('.')[0],
      date: new Date(selectedDate),
      location: location.trim() || undefined,
      backstory: backstory.trim() || undefined,
      stickers: []
    };
    onSavePhoto(photo);
    onClose();
    // Reset form
    setTitle(fileName.split('.')[0]);
    setLocation("");
    setBackstory("");
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setTitle(fileName.split('.')[0]);
    setLocation("");
    setBackstory("");
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Review Your Photo 📸</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo Preview */}
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl p-4 border-4 border-black comic-shadow">
              <div className="w-64 h-64 bg-gray-200 rounded-xl overflow-hidden">
                <img 
                  src={photoUrl} 
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Photo Details Form */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-bold mb-2 block">Photo Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your photo a title..."
                className="border-2 border-black rounded-xl comic-shadow"
              />
            </div>

            <div>
              <Label className="text-sm font-bold mb-2 block">Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-2 border-black rounded-xl comic-shadow"
              />
            </div>

            <div>
              <Label className="text-sm font-bold mb-2 block">Location (Optional)</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where was this taken?"
                className="border-2 border-black rounded-xl comic-shadow"
              />
            </div>

            <div>
              <Label className="text-sm font-bold mb-2 block">Backstory (Optional)</Label>
              <Textarea
                value={backstory}
                onChange={(e) => setBackstory(e.target.value)}
                placeholder="What's the story behind this photo? Why is it special?"
                rows={4}
                className="border-2 border-black rounded-xl comic-shadow resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              onClick={handleClose}
              variant="outline"
              className="rounded-full border-2 border-black comic-shadow"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-full comic-shadow"
            >
              Save Photo ✨
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
