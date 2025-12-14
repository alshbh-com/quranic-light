import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/Header';
import { SurahList } from '@/components/SurahList';
import { QuranReader } from '@/components/QuranReader';
import { Footer } from '@/components/Footer';
import { PrayerModal } from '@/components/PrayerModal';
import { MobileSurahDrawer } from '@/components/MobileSurahDrawer';
import { useQuranStorage } from '@/hooks/useQuranStorage';
import { useQuranApi, SurahData } from '@/hooks/useQuranApi';

const Index = () => {
  const { progress, settings, saveProgress, updateSettings } = useQuranStorage();
  const { fetchSurah, loading, error } = useQuranApi();
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [initialAyah, setInitialAyah] = useState<number | undefined>();
  const [currentReciter, setCurrentReciter] = useState(settings.reciterId);
  const previousSurahRef = useRef<number | null>(null);

  // Fetch surah data when selection changes
  useEffect(() => {
    if (selectedSurah) {
      fetchSurah(selectedSurah, currentReciter).then(data => {
        if (data) setSurahData(data);
      });
    }
  }, [selectedSurah, currentReciter, fetchSurah]);

  const handleSurahSelect = useCallback((surahNumber: number) => {
    // Reset to ayah 1 when selecting a new surah
    if (previousSurahRef.current !== surahNumber) {
      setInitialAyah(1);
    }
    previousSurahRef.current = surahNumber;
    setSelectedSurah(surahNumber);
    setSurahData(null);
  }, []);

  const handleAyahRead = useCallback((surahNumber: number, ayahNumber: number) => {
    saveProgress(surahNumber, ayahNumber);
  }, [saveProgress]);

  const handlePrayerModalClose = useCallback(() => {
    updateSettings({ hasSeenPrayerModal: true });
  }, [updateSettings]);

  const handleReciterChange = useCallback((reciterId: string) => {
    setCurrentReciter(reciterId);
    updateSettings({ reciterId });
  }, [updateSettings]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Prayer Modal */}
      <PrayerModal 
        hasSeenModal={settings.hasSeenPrayerModal} 
        onClose={handlePrayerModalClose} 
      />

      {/* Header */}
      <Header
        isDarkMode={settings.isDarkMode}
        onToggleDarkMode={() => updateSettings({ isDarkMode: !settings.isDarkMode })}
        fontSize={settings.fontSize}
        onFontSizeChange={(size) => updateSettings({ fontSize: size })}
        reciterId={currentReciter}
        onReciterChange={handleReciterChange}
        onSurahSelect={handleSurahSelect}
      />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Sidebar - Desktop - Always visible */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <SurahList
              selectedSurah={selectedSurah}
              onSurahSelect={handleSurahSelect}
              lastReadSurah={progress?.surahNumber}
            />
          </aside>

          {/* Reader */}
          <div className="flex-1 min-w-0">
            <QuranReader
              surahData={surahData}
              loading={loading}
              error={error}
              fontSize={settings.fontSize}
              onAyahRead={handleAyahRead}
              initialAyah={initialAyah}
              reciterId={currentReciter}
              onReciterChange={handleReciterChange}
            />
          </div>
        </div>
      </main>

      {/* Mobile Surah Drawer */}
      <MobileSurahDrawer
        selectedSurah={selectedSurah}
        onSurahSelect={handleSurahSelect}
        lastReadSurah={progress?.surahNumber}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
