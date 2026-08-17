import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminLayout.tsx', 'utf8');
content = content.replace(/import \{ hasSupabaseConfig \} from '\.\.\/\.\.\/lib\/supabase';\n/g, '');
content = content.replace(/import \{ hasSupabaseConfig \} from '..\/..\/lib\/supabase';\n/g, '');
fs.writeFileSync('src/pages/admin/AdminLayout.tsx', content);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/import \{ hasSupabaseConfig \} from '\.\/lib\/supabase';\n/g, '');
const appTarget = `  if (!hasSupabaseConfig && window.location.pathname !== '/setup') {
    // We'll let the user continue in demo mode, but maybe show a warning somewhere else
  }`;
appContent = appContent.replace(appTarget, '');
fs.writeFileSync('src/App.tsx', appContent);

let dashboardContent = fs.readFileSync('src/pages/admin/DashboardOverview.tsx', 'utf8');
dashboardContent = dashboardContent.replace(/import \{ supabase, hasSupabaseConfig \} from '\.\.\/\.\.\/lib\/supabase';\n/g, '');
dashboardContent = dashboardContent.replace(/import \{ supabase, hasSupabaseConfig \} from '..\/..\/lib\/supabase';\n/g, '');
const dashboardTarget = `      try {
        if (!hasSupabaseConfig) {
          setFlipbooks([]);
          return;
        }
        
        const { data, error } = await supabase.from('flipbooks').select('*').order('created_at', { ascending: false }).limit(5);
        if (error) throw error;
        setFlipbooks(data || []);
      } catch (error) {`;
const dashboardReplacement = `      try {
        setFlipbooks([]); // Placeholder until firestore query is added
      } catch (error) {`;
dashboardContent = dashboardContent.replace(dashboardTarget, dashboardReplacement);
fs.writeFileSync('src/pages/admin/DashboardOverview.tsx', dashboardContent);

let flipbooksContent = fs.readFileSync('src/pages/admin/FlipbooksList.tsx', 'utf8');
flipbooksContent = flipbooksContent.replace(/import \{ supabase, hasSupabaseConfig \} from '\.\.\/\.\.\/lib\/supabase';\n/g, '');
flipbooksContent = flipbooksContent.replace(/import \{ supabase, hasSupabaseConfig \} from '..\/..\/lib\/supabase';\n/g, '');
const flipbooksTarget = `      try {
        if (!hasSupabaseConfig) {
          setFlipbooks([]);
          return;
        }

        const { data, error } = await supabase.from('flipbooks').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setFlipbooks(data || []);
      } catch (error) {`;
const flipbooksReplacement = `      try {
        setFlipbooks([]); // Placeholder until firestore query is added
      } catch (error) {`;
flipbooksContent = flipbooksContent.replace(flipbooksTarget, flipbooksReplacement);
fs.writeFileSync('src/pages/admin/FlipbooksList.tsx', flipbooksContent);

