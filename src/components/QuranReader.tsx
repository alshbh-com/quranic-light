import { useEffect, useRef, useState } from 'react';
import { SurahData, Ayah } from '@/hooks/useQuranApi';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AudioPlayer } from './AudioPlayer';
import { Loader2, BookOpen } from 'lucide-react';

interface QuranReaderProps {
  surahData: SurahData | null;
  loading: boolean;
  error: string | null;
  fontSize: number;
  onAyahRead: (surahNumber: number, ayahNumber: number) => void;
  initialAyah?: number;
}

export function QuranReader({ 
  surahData, 
  loading, 
  error, 
  fontSize, 
  onAyahRead,
  initialAyah 
}: QuranReaderProps) {
  const [currentAyah, setCurrentAyah] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const ayahRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to initial ayah on surah load
  useEffect(() => {
    if (surahData && initialAyah) {
      setCurrentAyah(initialAyah);
      setTimeout(() => {
        const ayahElement = ayahRefs.current.get(initialAyah);
        if (ayahElement) {
          ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [surahData?.number, initialAyah]);

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
      {/* Surah Header */}
      <div className="p-6 border-b border-border text-center bg-gradient-to-b from-secondary/50 to-transparent">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm mb-3">
          <span>{surahData.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
          <span>•</span>
          <span>{surahData.numberOfAyahs} آية</span>
        </div>
        <h2 className="text-3xl font-bold font-arabic text-foreground mb-1">
          سورة {surahData.name.replace('سُورَةُ ', '')}
        </h2>
        <p className="text-muted-foreground text-sm">{surahData.englishNameTranslation}</p>
        
        {/* Bismillah - except for Surah At-Tawbah */}
        {surahData.number !== 9 && surahData.number !== 1 && (
          <p className="mt-6 text-2xl font-quran text-foreground">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}
      </div>

      {/* Ayahs */}
      <ScrollArea className="flex-1 scrollbar-thin" ref={scrollAreaRef}>
        <div className="p-6 leading-loose" dir="rtl">
          <p className="text-center" style={{ fontSize: `${fontSize}px`, lineHeight: '2.4' }}>
            {surahData.ayahs.map((ayah) => (
              <span
                key={ayah.numberInSurah}
                ref={(el) => {
                  if (el) ayahRefs.current.set(ayah.numberInSurah, el);
                }}
                onClick={() => handleAyahClick(ayah.numberInSurah)}
                className={`
                  font-quran cursor-pointer transition-all duration-300 hover:text-primary
                  ${currentAyah === ayah.numberInSurah && isPlaying ? 'ayah-playing text-primary' : 'text-foreground'}
                `}
              >
                {ayah.text}
                <span className="inline-flex items-center justify-center w-8 h-8 mx-1 text-sm bg-primary/10 text-primary rounded-full font-sans">
                  {ayah.numberInSurah}
                </span>
              </span>
            ))}
          </p>
        </div>
      </ScrollArea>

      {/* Audio Player */}
      <AudioPlayer
        currentAyah={currentAyahData || null}
        surahName={surahData.name}
        totalAyahs={surahData.numberOfAyahs}
        onAyahEnd={handleAyahEnd}
        onPlayingChange={setIsPlaying}
        isPlaying={isPlaying}
        onPrevious={() => setCurrentAyah(prev => Math.max(1, prev - 1))}
        onNext={() => setCurrentAyah(prev => Math.min(surahData.numberOfAyahs, prev + 1))}
      />
    </div>
  );
}
