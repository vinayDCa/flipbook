import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

content = content.replace("new Audio('/page-turn.mp3')", "new Audio('/flip.wav')");

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
