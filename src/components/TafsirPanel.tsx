import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TafsirPanelProps {
  surahNumber: number;
  ayahNumber: number;
  onClose: () => void;
}

export function TafsirPanel({ surahNumber, ayahNumber, onClose }: TafsirPanelProps) {
  const [tafsir, setTafsir] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTafsir = async () => {
      setLoading(true);
      setError(null);
      try {
        // Using Tafsir API - ar.muyassar (تفسير الميسر - similar to السعدي)
        const response = await fetch(
          `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/ar.muyassar`
        );
        const data = await response.json();
        if (data.code === 200 && data.data?.text) {
          setTafsir(data.data.text);
        } else {
          setError('لم يتم العثور على التفسير');
        }
      } catch (err) {
        setError('خطأ في تحميل التفسير');
      } finally {
        setLoading(false);
      }
    };

    fetchTafsir();
  }, [surahNumber, ayahNumber]);

  return (
    <div className="flex flex-col w-full lg:w-1/2 border-r border-border bg-secondary/30">
      <div className="flex items-center justify-between p-2 border-b border-border bg-secondary/50">
        <h3 className="font-bold font-arabic text-foreground text-sm">
          تفسير الآية {ayahNumber}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 h-full">
        <div className="p-3" dir="rtl">
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
          )}
          
          {error && (
            <p className="text-center text-muted-foreground text-sm py-6">{error}</p>
          )}
          
          {tafsir && !loading && (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed font-arabic text-foreground/90">
                {tafsir}
              </p>
              <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                التفسير الميسر
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
