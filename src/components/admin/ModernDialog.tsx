
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
        className={`${maxWidth} bg-[#2A2B3D] border-[#3A3B4D] text-[#E2E8F0] p-0 overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl`}
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
        <DialogHeader className="p-6 pb-4 border-b border-[#3A3B4D] sticky top-0 bg-[#2A2B3D] z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold text-[#E2E8F0]">
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
                      className="border-[#3A3B4D] text-[#B0B8C1] hover:bg-[#1E1E2F] hover:text-[#E2E8F0] hover:border-[#4A4B5D] transition-all duration-200"
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
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-lg transition-all duration-200"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      {isSaving ? 'Saving...' : saveLabel}
                    </Button>
                  )}
                </>
              )}
              <button
                onClick={onClose}
                className="text-[#8F9BAA] hover:text-[#E2E8F0] transition-colors p-2 hover:bg-[#1E1E2F] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </DialogHeader>
        <div className="p-6 bg-[#2A2B3D]">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModernDialog;
