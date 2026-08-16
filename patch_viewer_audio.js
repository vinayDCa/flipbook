import fs from 'fs';

let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

// 1. Add the import
if (!content.includes('usePageTurnSound')) {
  content = content.replace(
    "import { previewStore } from '../../lib/store';",
    "import { previewStore } from '../../lib/store';\nimport { usePageTurnSound } from '../../hooks/usePageTurnSound';"
  );
}

// 2. Replace the ref with the hook
content = content.replace(
  "  const pageTurnSoundRef = useRef<HTMLAudioElement>(null);",
  "  const playPageTurnSound = usePageTurnSound('https://cdn.pixabay.com/download/audio/2022/03/15/audio_73bb665f8a.mp3?filename=page-flip-47177.mp3');"
);

// 3. Replace the handlePageChange usage
const handlePageChangeTarget = `  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    // Explicitly try to play the sound
    if (pageTurnSoundRef.current) {
      pageTurnSoundRef.current.currentTime = 0;
      pageTurnSoundRef.current.volume = 1;
      const playPromise = pageTurnSoundRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Audio play failed, usually due to browser policy:", error);
        });
      }
    }
  };`;

const handlePageChangeReplacement = `  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    playPageTurnSound();
  };`;

if (content.includes(handlePageChangeTarget)) {
  content = content.replace(handlePageChangeTarget, handlePageChangeReplacement);
} else {
  console.log("Could not find handlePageChange target");
}

// 4. Remove the audio element
const audioElementTarget = `      <audio 
        ref={pageTurnSoundRef} 
        src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_73bb665f8a.mp3?filename=page-flip-47177.mp3" 
        preload="auto" 
      />`;
if (content.includes(audioElementTarget)) {
  content = content.replace(audioElementTarget, "");
} else {
  console.log("Could not find audio element target");
}

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
