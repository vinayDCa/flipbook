import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

content = content.replace(
  'src="/bg.mp3"',
  'src="/bg.mp3?v=2"'
);

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
