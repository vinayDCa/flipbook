import fs from 'fs';
let app = fs.readFileSync('src/App.tsx', 'utf8');
const target = `        {!hasSupabaseConfig && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-800 px-4 py-2 text-sm text-center flex items-center justify-center gap-2">
            <strong>Demo Mode:</strong> Supabase keys are missing. Application is running with local demo data.
          </div>
        )}`;
app = app.replace(target, '');
fs.writeFileSync('src/App.tsx', app);

let list = fs.readFileSync('src/pages/admin/FlipbooksList.tsx', 'utf8');
const listTarget = `        if (!hasSupabaseConfig) {
          setFlipbooks([]);
          return;
        }

        const { data, error } = await supabase.from('flipbooks').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setFlipbooks(data || []);`;
list = list.replace(listTarget, '');
list = list.replace(/import \{ supabase, hasSupabaseConfig \} from '..\/..\/lib\/supabase';\n/g, '');
fs.writeFileSync('src/pages/admin/FlipbooksList.tsx', list);
