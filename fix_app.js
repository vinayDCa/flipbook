import fs from 'fs';
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/\{\!hasSupabaseConfig && \([\s\S]*?\}\)/g, '');
fs.writeFileSync('src/App.tsx', app);

let listContent = fs.readFileSync('src/pages/admin/FlipbooksList.tsx', 'utf8');
listContent = listContent.replace(/import \{ supabase, hasSupabaseConfig \} from '\.\.\/\.\.\/lib\/supabase';\n/g, '');
const listTarget = `        if (!hasSupabaseConfig) {
          setFlipbooks([]);
          return;
        }

        const { data, error } = await supabase.from('flipbooks').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setFlipbooks(data || []);`;
listContent = listContent.replace(listTarget, '');
fs.writeFileSync('src/pages/admin/FlipbooksList.tsx', listContent);
