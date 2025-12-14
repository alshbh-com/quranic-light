import { useRef, useEffect, useState } from 'react';
import { Ayah } from '@/hooks/useQuranApi';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  currentAyah: Ayah | null;
  surahName: string;
  totalAyahs: number;
  onAyahEnd: () => void;
  onPlayingChange: (playing: boolean) => void;
  isPlaying: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function AudioPlayer({
  currentAyah,
  surahName,
  totalAyahs,
  onAyahEnd,
  onPlayingChange,
  isPlaying,
  onPrevious,
  onNext,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAyah?.audio) return;

    audio.src = currentAyah.audio;
    audio.load();

    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentAyah?.audio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && currentAyah?.audio) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  };

  const handleEnded = () => {
    onAyahEnd();
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio && duration) {
      audio.currentTime = (value[0] / 100) * duration;
      setProgress(value[0]);
    }
  };

  const togglePlay = () => {
    onPlayingChange(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentAyah) {
    return null;
  }

  return (
    <div className="p-4 border-t border-border bg-secondary/30">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Progress bar */}
      <div className="mb-3">
        <Slider
          value={[progress]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime((progress / 100) * duration)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Ayah info */}
        <div className="flex-1 text-right" dir="rtl">
          <p className="text-sm font-arabic text-foreground truncate">
            {surahName}
          </p>
          <p className="text-xs text-muted-foreground">
            الآية {currentAyah.numberInSurah} من {totalAyahs}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            disabled={currentAyah.numberInSurah <= 1}
            className="text-foreground hover:bg-secondary"
          >
            <SkipForward className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 mr-0.5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={currentAyah.numberInSurah >= totalAyahs}
            className="text-foreground hover:bg-secondary"
          >
            <SkipBack className="w-5 h-5" />
          </Button>
        </div>

        {/* Volume */}
        <div className="flex-1 flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-foreground hover:bg-secondary"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={([value]) => {
              setVolume(value);
              if (value > 0) setIsMuted(false);
            }}
            max={100}
            className="w-20 hidden sm:block"
          />
        </div>
      </div>
    </div>
  );
}
