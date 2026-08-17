import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace LandingPage route with Navigate to /admin
content = content.replace(
  '<Route path="/" element={<LandingPage />} />',
  '<Route path="/" element={<Navigate to="/admin" replace />} />'
);

fs.writeFileSync('src/App.tsx', content);
