import { surahs, Surah } from '@/data/surahs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, MapPin } from 'lucide-react';

interface SurahListProps {
  selectedSurah: number | null;
  onSurahSelect: (surahNumber: number) => void;
  lastReadSurah?: number;
}

export function SurahList({ selectedSurah, onSurahSelect, lastReadSurah }: SurahListProps) {
  return (
    <div className="h-full flex flex-col bg-card rounded-xl shadow-card border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold font-arabic text-foreground">فهرس السور</h2>
        <p className="text-sm text-muted-foreground">114 سورة</p>
      </div>
      
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="p-2 space-y-1">
          {surahs.map((surah) => (
            <SurahItem
              key={surah.number}
              surah={surah}
              isSelected={selectedSurah === surah.number}
              isLastRead={lastReadSurah === surah.number}
              onClick={() => onSurahSelect(surah.number)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface SurahItemProps {
  surah: Surah;
  isSelected: boolean;
  isLastRead: boolean;
  onClick: () => void;
}

function SurahItem({ surah, isSelected, isLastRead, onClick }: SurahItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-right
        ${isSelected 
          ? 'bg-primary text-primary-foreground shadow-soft' 
          : 'hover:bg-secondary'
        }
      `}
    >
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
        ${isSelected 
          ? 'bg-primary-foreground/20' 
          : 'bg-primary/10'
        }
      `}>
        <span className={`text-sm font-bold ${isSelected ? 'text-primary-foreground' : 'text-primary'}`}>
          {surah.number}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-bold font-arabic truncate ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
            {surah.name}
          </p>
          {isLastRead && !isSelected && (
            <MapPin className="w-3 h-3 text-gold flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
            {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
          </span>
          <span className={isSelected ? 'text-primary-foreground/60' : 'text-muted-foreground/60'}>•</span>
          <span className={isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
            {surah.numberOfAyahs} آية
          </span>
        </div>
      </div>
    </button>
  );
}
