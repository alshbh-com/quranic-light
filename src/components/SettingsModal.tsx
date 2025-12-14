import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { reciters } from '@/data/surahs';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  reciterId: string;
  onReciterChange: (id: string) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  fontSize,
  onFontSizeChange,
  reciterId,
  onReciterChange,
}: SettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 bg-card" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-arabic text-foreground">
            الإعدادات
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Font Size */}
          <div className="space-y-3">
            <Label className="font-arabic text-foreground">حجم الخط: {fontSize}px</Label>
            <Slider
              value={[fontSize]}
              onValueChange={([value]) => onFontSizeChange(value)}
              min={20}
              max={48}
              step={2}
              className="w-full"
            />
            <p 
              className="font-quran text-center text-foreground" 
              style={{ fontSize: `${fontSize}px` }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>

          {/* Reciter Selection */}
          <div className="space-y-3">
            <Label className="font-arabic text-foreground">القارئ</Label>
            <Select value={reciterId} onValueChange={onReciterChange}>
              <SelectTrigger className="w-full bg-secondary border-border">
                <SelectValue placeholder="اختر القارئ" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {reciters.map((reciter) => (
                  <SelectItem key={reciter.id} value={reciter.id}>
                    <span className="font-arabic">{reciter.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
