import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { SurahList } from './SurahList';
import { useState } from 'react';

interface MobileSurahDrawerProps {
  selectedSurah: number | null;
  onSurahSelect: (surahNumber: number) => void;
  lastReadSurah?: number;
}

export function MobileSurahDrawer({ selectedSurah, onSurahSelect, lastReadSurah }: MobileSurahDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSurahSelect = (surahNumber: number) => {
    onSurahSelect(surahNumber);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-20 right-4 z-50 lg:hidden w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0 bg-card" dir="rtl">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-right font-arabic text-foreground">فهرس السور</SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-80px)]">
          <SurahList
            selectedSurah={selectedSurah}
            onSurahSelect={handleSurahSelect}
            lastReadSurah={lastReadSurah}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
