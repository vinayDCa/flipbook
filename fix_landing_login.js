import fs from 'fs';
let content = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');

content = content.replace(
  '<Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">\n            Login\n          </Link>',
  '<Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">\n            Login\n          </Link>'
);

fs.writeFileSync('src/pages/LandingPage.tsx', content);
