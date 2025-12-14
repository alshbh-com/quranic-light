import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface PrayerModalProps {
  hasSeenModal: boolean;
  onClose: () => void;
}

export function PrayerModal({ hasSeenModal, onClose }: PrayerModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!hasSeenModal) {
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenModal]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-sm mx-4 bg-card border border-gold/30 shadow-gold p-4" dir="rtl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold font-arabic text-foreground text-sm">نسألكم الدعاء</h3>
            <p className="text-xs text-muted-foreground">محمد عبد العظيم • عيسى محمد • محمد حافظ</p>
          </div>
        </div>
        
        <p className="text-sm text-center font-arabic text-foreground/80 mb-3">
          اللهم اغفر لهم وارحمهم وأدخلهم الجنة بغير حساب
        </p>

        <DialogFooter>
          <Button 
            onClick={handleClose}
            size="sm"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-arabic"
          >
            آمين
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
