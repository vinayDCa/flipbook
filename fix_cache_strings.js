import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

content = content.replace(
  "usePageTurnSound('/flip.wav?v=6')",
  "usePageTurnSound('/flip.wav?v=7')"
);

content = content.replace(
  'src="/bg.mp3?v=3"',
  'src="/bg.mp3?v=4"'
);

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
