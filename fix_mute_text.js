import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

// Add "Mute" text next to the icon for clarity
content = content.replace(
  '{isMusicPlaying ? <Volume2 className="w-5 h-5 text-indigo-600" /> : <VolumeX className="w-5 h-5" />}',
  '{isMusicPlaying ? <><Volume2 className="w-5 h-5 text-indigo-600" /><span className="text-sm font-medium">Mute</span></> : <><VolumeX className="w-5 h-5" /><span className="text-sm font-medium">Unmute</span></>}'
);

content = content.replace(
  'className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors" title="Toggle Music"',
  'className="p-2 px-3 flex items-center gap-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors" title="Toggle Music"'
);

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
