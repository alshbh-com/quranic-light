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

      // Create ayahs array
      const ayahs: Ayah[] = [];

      // Add Bismillah as ayah 0 for all surahs except Al-Fatiha (1) and At-Tawbah (9)
      if (surahNumber !== 1 && surahNumber !== 9) {
        // Get Bismillah audio from the first ayah of Al-Fatiha
        const bismillahAudioUrl = `https://cdn.islamic.network/quran/audio/128/${reciterId.replace('ar.', '')}/1.mp3`;
        ayahs.push({
          number: 0,
          text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          numberInSurah: 0,
          audio: bismillahAudioUrl,
        });
      }

      // Merge text and audio data
      surah.ayahs.forEach((ayah: any, index: number) => {
        ayahs.push({
          number: ayah.number,
          text: ayah.text,
          numberInSurah: ayah.numberInSurah,
          audio: audioAyahs[index]?.audio,
        });
      });

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
