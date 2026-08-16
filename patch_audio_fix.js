import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');
content = content.replace(
  "const playPageTurnSound = usePageTurnSound('https://cdn.pixabay.com/download/audio/2022/03/15/audio_73bb665f8a.mp3?filename=page-flip-47177.mp3');",
  "const playPageTurnSound = usePageTurnSound('https://cdn.freesound.org/previews/411/411639_5121236-lq.mp3');"
);
fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
console.log("Audio URL patched.");
