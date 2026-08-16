const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/CreateFlipbook.tsx', 'utf8');

// Add states for company_name, company_logo, whatsapp
const states = `  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#C5A059');`;

file = file.replace('const [slug, setSlug] = useState(\'\');', 'const [slug, setSlug] = useState(\'\');\n' + states);

// Update input fields to be controlled in step 2
file = file.replace(
  '<input type="text" className="w-full bg-[#F9F8F6] border border-[#E5E4E2] focus:border-[#C5A059] focus:ring-0 p-3 text-sm outline-none" placeholder="e.g. Autumn / Winter 2026" />',
  '<input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-[#F9F8F6] border border-[#E5E4E2] focus:border-[#C5A059] focus:ring-0 p-3 text-sm outline-none" placeholder="e.g. Autumn / Winter 2026" />' // wait, the label is Catalogue Title. The original had no state for title.
);

fs.writeFileSync('src/pages/admin/CreateFlipbook.tsx', file);
