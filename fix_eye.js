import fs from 'fs';
let list = fs.readFileSync('src/pages/admin/FlipbooksList.tsx', 'utf8');
list = list.replace("import { BookOpen, Copy, Download, ExternalLink, Plus, Search, Share2, Trash2 } from 'lucide-react';", "import { BookOpen, Copy, Download, ExternalLink, Plus, Search, Share2, Trash2, Eye } from 'lucide-react';");
fs.writeFileSync('src/pages/admin/FlipbooksList.tsx', list);
