import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

const target = `  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };`;
const replacement = `  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    if (pageTurnSoundRef.current) {
      pageTurnSoundRef.current.currentTime = 0;
      pageTurnSoundRef.current.play().catch(e => console.log("Sound play failed:", e));
    }
  };`;
content = content.replace(target, replacement);
fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
