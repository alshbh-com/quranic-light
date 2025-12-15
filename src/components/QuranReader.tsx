import { useEffect, useRef, useState } from 'react';
import { SurahData } from '@/hooks/useQuranApi';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AudioPlayer } from './AudioPlayer';
import { TafsirPanel } from './TafsirPanel';
import { ReciterSelector } from './ReciterSelector';
import { Loader2, BookOpen, BookText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuranReaderProps {
  surahData: SurahData | null;
  loading: boolean;
  error: string | null;
  fontSize: number;
  onAyahRead: (surahNumber: number, ayahNumber: number) => void;
  initialAyah?: number;
  reciterId: string;
  onReciterChange: (id: string) => void;
}

export function QuranReader({ 
  surahData, 
  loading, 
  error, 
  fontSize, 
  onAyahRead,
  initialAyah,
  reciterId,
  onReciterChange
}: QuranReaderProps) {
  const [currentAyah, setCurrentAyah] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);
  const ayahRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Reset when surah changes
  useEffect(() => {
    if (surahData) {
      // Use initialAyah if provided, otherwise start from 0 (Bismillah) or 1
      const startAyah = (surahData.number === 1 || surahData.number === 9) ? 1 : 0;
      setCurrentAyah(initialAyah ?? startAyah);
    }
  }, [surahData?.number]);

  // Save reading progress
  useEffect(() => {
    if (surahData && currentAyah) {
      onAyahRead(surahData.number, currentAyah);
    }
  }, [surahData?.number, currentAyah, onAyahRead]);

  const handleAyahEnd = () => {
    if (surahData && currentAyah < surahData.numberOfAyahs) {
      setCurrentAyah(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handleAyahClick = (ayahNumber: number) => {
    setCurrentAyah(ayahNumber);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-card rounded-xl shadow-card border border-border">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground font-arabic">جاري تحميل السورة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-card rounded-xl shadow-card border border-border">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-destructive font-arabic">حدث خطأ في تحميل السورة</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!surahData) {
    return (
      <div className="h-full flex items-center justify-center bg-card rounded-xl shadow-card border border-border">
        <div className="text-center space-y-4 p-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold font-arabic text-foreground">اختر سورة للقراءة</h2>
          <p className="text-muted-foreground font-arabic text-sm">اختر سورة من القائمة لبدء القراءة</p>
        </div>
      </div>
    );
  }

  const currentAyahData = surahData.ayahs.find(a => a.numberInSurah === currentAyah);

  return (
    <div className="h-full flex flex-col bg-card rounded-xl shadow-card border border-border overflow-hidden">
      {/* Surah Header - Compact */}
      <div className="p-2 sm:p-3 border-b border-border text-center bg-gradient-to-b from-secondary/50 to-transparent">
        <div className="flex items-center justify-between mb-1">
          <ReciterSelector reciterId={reciterId} onReciterChange={onReciterChange} />
          <Button
            variant={showTafsir ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowTafsir(!showTafsir)}
            className="text-xs h-7"
          >
            <BookText className="w-3 h-3 ml-1" />
            التفسير
          </Button>
        </div>
        <h2 className="text-lg sm:text-xl font-bold font-arabic text-foreground">
          سورة {surahData.name.replace('سُورَةُ ', '')}
        </h2>
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <span>{surahData.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
          <span>•</span>
          <span>{surahData.numberOfAyahs} آية</span>
        </div>
      </div>

      {/* Content Area - Takes remaining space */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Ayahs - Full height scroll */}
        <ScrollArea className={`flex-1 h-full ${showTafsir ? 'lg:w-1/2' : 'w-full'}`} ref={scrollAreaRef}>
          <div className="p-3 sm:p-4 pb-20" dir="rtl">
            {/* Bismillah - except for Surah At-Tawbah */}
            {surahData.number !== 9 && surahData.number !== 1 && (
              <p className="text-center text-lg sm:text-xl font-quran text-foreground mb-4">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            )}
            <p className="text-center leading-[2.2] sm:leading-[2.5]" style={{ fontSize: `${fontSize}px` }}>
              {surahData.ayahs.map((ayah) => (
                <span
                  key={ayah.numberInSurah}
                  ref={(el) => {
                    if (el) ayahRefs.current.set(ayah.numberInSurah, el);
                  }}
                  onClick={() => handleAyahClick(ayah.numberInSurah)}
                  className={`
                    font-quran cursor-pointer transition-all duration-300 hover:text-primary inline
                    ${currentAyah === ayah.numberInSurah && isPlaying ? 'ayah-playing text-primary' : 'text-foreground'}
                  `}
                >
                  {ayah.text}
                  <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 mx-1 text-xs bg-primary/10 text-primary rounded-full font-sans align-middle">
                    {ayah.numberInSurah}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </ScrollArea>

        {/* Tafsir Panel - Side panel on desktop */}
        {showTafsir && (
          <TafsirPanel
            surahNumber={surahData.number}
            ayahNumber={currentAyah}
            onClose={() => setShowTafsir(false)}
          />
        )}
      </div>

      {/* Audio Player */}
      <AudioPlayer
        currentAyah={currentAyahData || null}
        surahName={surahData.name}
        totalAyahs={surahData.numberOfAyahs}
        onAyahEnd={handleAyahEnd}
        onPlayingChange={setIsPlaying}
        isPlaying={isPlaying}
        onPrevious={() => setCurrentAyah(prev => Math.max(0, prev - 1))}
        onNext={() => setCurrentAyah(prev => Math.min(surahData.numberOfAyahs, prev + 1))}
      />
    </div>
  );
}
