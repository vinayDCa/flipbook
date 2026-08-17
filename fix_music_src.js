import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

// Replace soundhelix with local bg.mp3
content = content.replace(
  'src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"',
  'src="/bg.mp3"'
);

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
