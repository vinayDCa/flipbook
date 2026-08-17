import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

content = content.replace(
  "usePageTurnSound('/flip.wav?v=2')",
  "usePageTurnSound('/flip.wav?v=4')"
);

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
