import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

content = content.replace(
  "usePageTurnSound('/flip.wav?v=5')",
  "usePageTurnSound('/flip.wav?v=6')"
);

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
