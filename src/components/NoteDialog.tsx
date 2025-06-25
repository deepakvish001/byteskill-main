
import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteTitle: string;
  noteContent: string;
  onSave: (content: string) => void;
}

const NoteDialog = ({ open, onOpenChange, noteTitle, noteContent, onSave }: NoteDialogProps) => {
  const [content, setContent] = useState(noteContent);

  const handleSave = () => {
    onSave(content);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-gray-700 text-white max-w-xs sm:max-w-2xl mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-white">
            {noteTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="note-content" className="text-sm font-medium text-gray-300">
              Your Notes
            </Label>
            <Textarea
              id="note-content"
              placeholder="Write your notes, observations, solution approach, time complexity, etc..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] sm:min-h-[200px] bg-black border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20 resize-none"
            />
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span>💡 Tip: Include approach, complexity, and key insights</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-white bg-black hover:bg-gray-800 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Note
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
