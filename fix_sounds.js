import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

// Replace the Pixabay URL with SoundHelix
content = content.replace("https://cdn.pixabay.com/download/audio/2022/05/16/audio_b8c91021bc.mp3?filename=relaxing-music-119247.mp3", "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
