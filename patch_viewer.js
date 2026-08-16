import fs from 'fs';

let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

// Wait... in our previous edit we replaced isAutoPlaying, but they asked to add it back?
// "add autoplay back button" means they want the Auto Play backwards/forwards functionality that we added (or maybe they mean "add autoplay AND a back button"?).
// Actually, I just added forward/backward autoplay, so maybe they mean just a "Back to Home" button, or "Autoplay back button" as in the button I just added is good but missing something?
// Ah, the user says "add autoplay back button , add supabase keys , login with google . still page turn sound not there".
// Autoplay backward button WAS added in my previous turn, but it was just a few seconds ago. Let's make sure the audio actually triggers.

// The issue with the page turn sound is likely a browser policy preventing audio playback without explicit user interaction first.
// We can add a "Tap to Start / Unmute" overlay or button. Or just trigger on first click.
// Let's add an explicit audio initialization block.

// Also, let's fix the page turn sound. The `handlePageChange` calls `.play()` and we catch the error.
// We should make sure the audio element is loaded properly.

const soundTarget = `  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    if (pageTurnSoundRef.current) {
      pageTurnSoundRef.current.currentTime = 0;
      pageTurnSoundRef.current.play().catch(() => {});
    }
  };`;

const soundReplacement = `  const handlePageChange = (pageIndex: number) => {
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

if (content.includes(soundTarget)) {
  content = content.replace(soundTarget, soundReplacement);
  console.log("Patched sound handling");
}

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
