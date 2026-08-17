import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

content = content.replace(
  'const [isMusicPlaying, setIsMusicPlaying] = useState(false);',
  'const [isMuted, setIsMuted] = useState(false);'
);

content = content.replace(
  'const handlePageChange = (pageIndex: number) => {\n    setCurrentPage(pageIndex);\n    playPageTurnSound();\n  };',
  'const handlePageChange = (pageIndex: number) => {\n    setCurrentPage(pageIndex);\n    if (!isMuted) {\n      playPageTurnSound();\n    }\n  };'
);

content = content.replace(
  'const toggleMusic = () => {\n    if (!bgMusicRef.current) return;\n    if (isMusicPlaying) {\n      bgMusicRef.current.pause();\n    } else {\n      bgMusicRef.current.play().catch(() => {});\n    }\n    setIsMusicPlaying(!isMusicPlaying);\n  };',
  'const toggleMusic = () => {\n    if (!bgMusicRef.current) return;\n    if (!isMuted) {\n      bgMusicRef.current.pause();\n    } else {\n      bgMusicRef.current.play().catch(() => {});\n    }\n    setIsMuted(!isMuted);\n  };'
);

content = content.replace(
  '{isMusicPlaying ? <><Volume2 className="w-5 h-5 text-indigo-600" /><span className="text-sm font-medium">Mute</span></> : <><VolumeX className="w-5 h-5" /><span className="text-sm font-medium">Unmute</span></>}',
  '{!isMuted ? <><Volume2 className="w-5 h-5 text-indigo-600" /><span className="text-sm font-medium">Mute</span></> : <><VolumeX className="w-5 h-5" /><span className="text-sm font-medium">Unmute</span></>}'
);

// We need an effect to try playing background music on first interaction if it's not muted.
// But usePageTurnSound already unlocks audio on first interaction.
// Let's just make it so bgMusic tries to play on interaction if not muted.

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
