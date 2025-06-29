
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModernDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  preventClose?: boolean;
  showActionButtons?: boolean;
  onSave?: () => void;
  onReset?: () => void;
  isSaving?: boolean;
  saveLabel?: string;
}

const ModernDialog = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = "max-w-4xl",
  preventClose = true,
  showActionButtons = false,
  onSave,
  onReset,
  isSaving = false,
  saveLabel = "Save"
}: ModernDialogProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open && !preventClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className={`${maxWidth} bg-black border-gray-800 text-gray-100 p-0 overflow-hidden max-h-[90vh] overflow-y-auto`}
        onPointerDownOutside={(e) => {
          if (preventClose) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (preventClose) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="p-6 pb-4 border-b border-gray-800 sticky top-0 bg-black z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold text-gray-100">
              {title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {showActionButtons && (
                <>
                  {onReset && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onReset}
                      className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-gray-100 bg-gray-800"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  )}
                  {onSave && (
                    <Button
                      size="sm"
                      onClick={onSave}
                      disabled={isSaving}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      {isSaving ? 'Saving...' : saveLabel}
                    </Button>
                  )}
                </>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-100 transition-colors p-2 hover:bg-gray-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </DialogHeader>
        <div className="p-6 bg-black">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModernDialog;
