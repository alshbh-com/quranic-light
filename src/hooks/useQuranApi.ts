import { useState, useCallback } from 'react';

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  audio?: string;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

const API_BASE = 'https://api.alquran.cloud/v1';

export function useQuranApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSurah = useCallback(async (surahNumber: number, reciterId: string = 'ar.alafasy'): Promise<SurahData | null> => {
    setLoading(true);
    setError(null);

    try {
      // Fetch both text and audio editions
      const [textResponse, audioResponse] = await Promise.all([
        fetch(`${API_BASE}/surah/${surahNumber}/quran-uthmani`),
        fetch(`${API_BASE}/surah/${surahNumber}/${reciterId}`)
      ]);

      if (!textResponse.ok || !audioResponse.ok) {
        throw new Error('Failed to fetch surah data');
      }

      const textData = await textResponse.json();
      const audioData = await audioResponse.json();

      if (textData.status !== 'OK' || audioData.status !== 'OK') {
        throw new Error('API returned an error');
      }

      const surah = textData.data;
      const audioAyahs = audioData.data.ayahs;

      // Merge text and audio data - البسملة مدمجة مع الآية الأولى في الصوت
      const ayahs: Ayah[] = surah.ayahs.map((ayah: any, index: number) => ({
        number: ayah.number,
        text: ayah.text,
        numberInSurah: ayah.numberInSurah,
        audio: audioAyahs[index]?.audio,
      }));

      return {
        number: surah.number,
        name: surah.name,
        englishName: surah.englishName,
        englishNameTranslation: surah.englishNameTranslation,
        numberOfAyahs: surah.numberOfAyahs,
        revelationType: surah.revelationType,
        ayahs,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchSurah,
    loading,
    error,
  };
}
