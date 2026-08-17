import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

// Replace /flip.wav with /flip.wav?v=2 to bust cache
content = content.replace("usePageTurnSound('/flip.wav')", "usePageTurnSound('/flip.wav?v=2')");

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
