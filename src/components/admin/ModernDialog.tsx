
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ModernDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const ModernDialog = ({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }: ModernDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidth} bg-gray-900 border-gray-700 text-white p-0 overflow-hidden`}>
        <DialogHeader className="p-6 pb-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-white">
              {title}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>
        <div className="p-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModernDialog;
