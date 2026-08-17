import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

// Unhide the music button on mobile
content = content.replace(
  'className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block" title="Toggle Music"',
  'className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors" title="Toggle Music"'
);

// Unhide the zoom controls and divider so they are usable or at least consistent
content = content.replace(
  '<div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block"></div>',
  '<div className="w-px h-6 bg-gray-300 mx-1"></div>'
);

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
