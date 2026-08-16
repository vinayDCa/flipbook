import fs from 'fs';

let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

// The wikimedia page turn sound is an .ogg file which safari might not support well, or might be a slow URL.
// Let's replace it with a highly reliable short page flip mp3 or wav data URI or reliable static URL.
// We'll use a very common reliable sound for page flip.

const target = `      <audio 
        ref={pageTurnSoundRef} 
        src="https://upload.wikimedia.org/wikipedia/commons/3/34/Sound_Effect_-_Page_Turn.ogg" 
        preload="auto" 
      />`;

const replacement = `      <audio 
        ref={pageTurnSoundRef} 
        src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_73bb665f8a.mp3?filename=page-flip-47177.mp3" 
        preload="auto" 
      />`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    console.log("Patched audio URL to reliable mp3");
} else {
    console.log("Failed to find audio tag");
}

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
