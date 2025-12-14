import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full py-6 px-4 border-t border-border bg-card/50" dir="rtl">
      <div className="container mx-auto text-center space-y-3">
        <p className="text-lg font-arabic font-bold text-foreground">
          صدقة جارية – نسألكم الدعاء
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Developed with</span>
          <Heart className="w-4 h-4 text-destructive fill-destructive" />
          <span>for the sake of Allah</span>
        </div>
      </div>
    </footer>
  );
}
