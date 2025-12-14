import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { surahs } from '@/data/surahs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSurahSelect: (number: number) => void;
}

export function SearchModal({ isOpen, onClose, onSurahSelect }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahs;
    
    const query = searchQuery.toLowerCase().trim();
    const numberQuery = parseInt(query);
    
    return surahs.filter(surah => 
      surah.name.includes(query) ||
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      surah.number === numberQuery
    );
  }, [searchQuery]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 p-0 bg-card" dir="rtl">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-xl font-bold font-arabic text-foreground">
            البحث في القرآن
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 pt-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث باسم السورة أو رقمها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-secondary border-border font-arabic"
              autoFocus
            />
          </div>
        </div>

        <ScrollArea className="h-80 px-4 pb-4">
          <div className="space-y-1">
            {filteredSurahs.map((surah) => (
              <button
                key={surah.number}
                onClick={() => onSurahSelect(surah.number)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-right"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{surah.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold font-arabic text-foreground truncate">{surah.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{surah.englishName}</p>
                </div>
                <span className="text-xs text-muted-foreground">{surah.numberOfAyahs} آية</span>
              </button>
            ))}
            {filteredSurahs.length === 0 && (
              <p className="text-center text-muted-foreground py-8 font-arabic">
                لم يتم العثور على نتائج
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
