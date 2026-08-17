import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

// Ensure LogIn is imported from lucide-react
if (!content.includes('LogIn')) {
  content = content.replace('Maximize,', 'Maximize, LogIn,');
}

// Add the login button next to Maximize
content = content.replace(
  '<Maximize className="w-5 h-5" />\n          </button>',
  '<Maximize className="w-5 h-5" />\n          </button>\n          <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block"></div>\n          <button onClick={() => navigate(\'/login\')} className="p-2 px-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2" title="Admin Login">\n            <LogIn className="w-5 h-5" />\n            <span className="text-sm font-medium hidden sm:block">Login</span>\n          </button>'
);

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
