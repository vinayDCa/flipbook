import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

// Replace 2500 with 1500
content = content.replace("2500); // Wait 2.5 seconds per page", "1500); // Wait 1.5 seconds per page");

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
