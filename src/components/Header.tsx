import { Moon, Sun, Search, BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { SearchModal } from './SearchModal';
import { SettingsModal } from './SettingsModal';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  reciterId: string;
  onReciterChange: (id: string) => void;
  onSurahSelect: (number: number) => void;
}

export function Header({
  isDarkMode,
  onToggleDarkMode,
  fontSize,
  onFontSizeChange,
  reciterId,
  onReciterChange,
  onSurahSelect,
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold font-arabic text-foreground">القرآن الكريم</h1>
              <p className="text-xs text-muted-foreground">مصحف المدينة</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="text-foreground hover:bg-secondary"
              aria-label="البحث"
            >
              <Search className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
              className="text-foreground hover:bg-secondary"
              aria-label="الإعدادات"
            >
              <Settings className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="text-foreground hover:bg-secondary"
              aria-label={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSurahSelect={(number) => {
          onSurahSelect(number);
          setIsSearchOpen(false);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fontSize={fontSize}
        onFontSizeChange={onFontSizeChange}
        reciterId={reciterId}
        onReciterChange={onReciterChange}
      />
    </>
  );
}
