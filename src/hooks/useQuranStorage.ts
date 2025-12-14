import { useState, useEffect, useCallback } from 'react';

interface ReadingProgress {
  surahNumber: number;
  ayahNumber: number;
  timestamp: number;
}

interface QuranSettings {
  reciterId: string;
  fontSize: number;
  isDarkMode: boolean;
  hasSeenPrayerModal: boolean;
}

const STORAGE_KEYS = {
  PROGRESS: 'quran_reading_progress',
  SETTINGS: 'quran_settings',
};

const DEFAULT_SETTINGS: QuranSettings = {
  reciterId: 'ar.alafasy',
  fontSize: 28,
  isDarkMode: false,
  hasSeenPrayerModal: false,
};

export function useQuranStorage() {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [settings, setSettings] = useState<QuranSettings>(DEFAULT_SETTINGS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }

      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  // Apply dark mode on settings change
  useEffect(() => {
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.isDarkMode]);

  const saveProgress = useCallback((surahNumber: number, ayahNumber: number) => {
    const newProgress: ReadingProgress = {
      surahNumber,
      ayahNumber,
      timestamp: Date.now(),
    };
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<QuranSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearProgress = useCallback(() => {
    setProgress(null);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  }, []);

  return {
    progress,
    settings,
    saveProgress,
    updateSettings,
    clearProgress,
  };
}
