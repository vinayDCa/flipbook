import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

// Update autoplay duration from 3500 to 2500
content = content.replace('3500); // Wait 3.5 seconds per page', '2500); // Wait 2.5 seconds per page');

// The Vertical mode currently does not have auto play buttons.
// Let's replace the UI for auto play so it shows regardless of viewMode, or at least in vertical mode.
const autoPlayUI = `{viewMode === 'flipbook' && (
            <div className="flex items-center gap-1">`;
const newAutoPlayUI = `<div className="flex items-center gap-1">`;
content = content.replace(autoPlayUI, newAutoPlayUI);

const autoPlayUIEnd = `</button>
            </div>
          )}`;
const newAutoPlayUIEnd = `</button>
            </div>`;
content = content.replace(autoPlayUIEnd, newAutoPlayUIEnd);

// Add auto play effect to VerticalFlipbookEngine
// Currently effect checks: `if (autoPlayDirection && viewMode === 'flipbook' && catalogue) {`
const effectCondition = `if (autoPlayDirection && viewMode === 'flipbook' && catalogue) {`;
const newEffectCondition = `if (autoPlayDirection && catalogue) {`;
content = content.replace(effectCondition, newEffectCondition);

// Add music tracks. We have `isMusicPlaying` and `toggleMusic`.
// We need to add background music and page turn sound.
const toggleMusicTarget = `  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };`;
const toggleMusicReplacement = `  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const pageTurnSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgMusicRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/05/16/audio_b8c91021bc.mp3?filename=relaxing-music-119247.mp3'); // Refreshing instrumental music
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.5;
    
    // We'll use a standard page turn sound, or the user's uploaded file if it was available.
    // Assuming the user's uploaded file might be named page-turn.mp3 in the future.
    pageTurnSoundRef.current = new Audio('/page-turn.mp3'); 
  }, []);

  const toggleMusic = () => {
    if (!isMusicPlaying) {
      bgMusicRef.current?.play().catch(e => console.log("Audio play failed:", e));
    } else {
      bgMusicRef.current?.pause();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };
  
  // Play turn sound when page changes
  const handlePageChangeWithSound = (newPage: number) => {
    handlePageChange(newPage);
    if (pageTurnSoundRef.current) {
      pageTurnSoundRef.current.currentTime = 0;
      pageTurnSoundRef.current.play().catch(e => console.log("Sound play failed:", e));
    }
  };
`;
content = content.replace(toggleMusicTarget, toggleMusicReplacement);

// Replace handlePageChange with handlePageChangeWithSound in the render
content = content.replaceAll('onPageChange={handlePageChange}', 'onPageChange={handlePageChangeWithSound}');

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
console.log("Patched PublicViewer audio and autoplay");
