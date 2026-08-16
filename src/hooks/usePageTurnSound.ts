import { useEffect, useRef, useCallback } from 'react';

export function usePageTurnSound(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize HTML5 Audio object
    const audio = new Audio(src);
    audio.preload = 'auto';
    audioRef.current = audio;
  }, [src]);

  const play = useCallback(() => {
    if (audioRef.current) {
      // Reset time to start for rapid successive plays
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Audio play failed, likely due to browser autoplay policies. User interaction is required before playing audio.", error);
        });
      }
    }
  }, []);

  return play;
}
