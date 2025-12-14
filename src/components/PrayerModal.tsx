import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
      // Small delay to ensure smooth animation
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
      <DialogContent className="max-w-lg mx-4 bg-card border-2 border-gold/30 shadow-gold" dir="rtl">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center font-arabic text-foreground">
            دعاء للمطور وأصدقائه
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          <p className="text-lg leading-relaxed text-center font-arabic text-foreground/90">
            نرجو منكم الدعاء بظهر الغيب أن يتغمد الله مطور هذا الموقع وأصدقاءه بواسع رحمته، وأن يدخلهم الجنة بغير حساب.
          </p>
          
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <p className="text-center text-muted-foreground text-sm mb-3">نسألكم الدعاء لـ:</p>
            <div className="space-y-2">
              <p className="text-center font-bold text-lg font-arabic text-primary">محمد عبد العظيم علي</p>
              <p className="text-center font-bold text-lg font-arabic text-primary">عيسى محمد عيسى</p>
              <p className="text-center font-bold text-lg font-arabic text-primary">محمد حافظ</p>
            </div>
          </div>
          
          <p className="text-center text-muted-foreground font-arabic text-sm">
            اللهم اغفر لهم وارحمهم واجمعنا بهم في جنات النعيم
          </p>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleClose}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-arabic"
          >
            آمين - أغلق النافذة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
