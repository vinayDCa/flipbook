import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

const effectCode = `  useEffect(() => {
    const handleFirstInteraction = () => {
      if (bgMusicRef.current && !isMuted) {
        bgMusicRef.current.play().catch(() => {});
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isMuted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;`;

content = content.replace(
  '  useEffect(() => {\n    let interval: NodeJS.Timeout;',
  effectCode
);

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
