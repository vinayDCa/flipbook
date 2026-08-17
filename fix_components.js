import fs from 'fs';

// App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/import \{ hasSupabaseConfig \} from '\.\/lib\/supabase';\n/g, '');
appContent = appContent.replace(/if \(\!hasSupabaseConfig \&\& window\.location\.pathname \!\=\= '\/setup'\) \{[\s\S]*?\}/g, '');
fs.writeFileSync('src/App.tsx', appContent);

// DashboardOverview.tsx
let dashContent = fs.readFileSync('src/pages/admin/DashboardOverview.tsx', 'utf8');
dashContent = dashContent.replace(/import \{ supabase, hasSupabaseConfig \} from '..\/..\/lib\/supabase';\n/g, '');
const dashImportReplacement = `import { db } from '../../lib/firebase';\nimport { collection, query, getDocs, where } from 'firebase/firestore';\nimport { useAuth } from '../../lib/auth';\n`;
if (!dashContent.includes('../../lib/firebase')) {
  dashContent = dashImportReplacement + dashContent;
}

const dashFetchTarget = `        if (hasSupabaseConfig) {
          const { data, error } = await supabase.from('flipbooks').select('*').order('created_at', { ascending: false }).limit(5);
          if (data && data.length > 0) {
            setFlipbooks(data);
          } else {
            const preview = await previewStore.load();
            if (preview) setFlipbooks([preview]);
          }
        } else {
          const preview = await previewStore.load();
          if (preview) {
            setFlipbooks([preview]);
          }
        }`;
        
const dashFetchReplacement = `        if (user) {
          const q = query(
            collection(db, 'flipbooks'),
            where('user_id', '==', user.uid)
          );
          const querySnapshot = await getDocs(q);
          const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
          books.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          
          if (books.length > 0) {
            setFlipbooks(books.slice(0, 5));
          } else {
            const preview = await previewStore.load();
            if (preview) setFlipbooks([preview]);
          }
        } else {
          const preview = await previewStore.load();
          if (preview) {
            setFlipbooks([preview]);
          }
        }`;
dashContent = dashContent.replace(dashFetchTarget, dashFetchReplacement);
fs.writeFileSync('src/pages/admin/DashboardOverview.tsx', dashContent);

// FlipbooksList.tsx
let listContent = fs.readFileSync('src/pages/admin/FlipbooksList.tsx', 'utf8');
listContent = listContent.replace(/import \{ supabase, hasSupabaseConfig \} from '..\/..\/lib\/supabase';\n/g, '');
if (!listContent.includes('../../lib/firebase')) {
  listContent = dashImportReplacement + listContent;
}

const listFetchTarget = `        if (hasSupabaseConfig) {
          const { data, error } = await supabase.from('flipbooks').select('*').order('created_at', { ascending: false });
          if (data && data.length > 0) {
            setFlipbooks(data);
          } else {
            const preview = await previewStore.load();
            if (preview) setFlipbooks([preview]);
          }
        } else {
          const preview = await previewStore.load();
          if (preview) {
            setFlipbooks([preview]);
          }
        }`;
        
const listFetchReplacement = `        if (user) {
          const q = query(
            collection(db, 'flipbooks'),
            where('user_id', '==', user.uid)
          );
          const querySnapshot = await getDocs(q);
          const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
          books.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          
          if (books.length > 0) {
            setFlipbooks(books);
          } else {
            const preview = await previewStore.load();
            if (preview) setFlipbooks([preview]);
          }
        } else {
          const preview = await previewStore.load();
          if (preview) {
            setFlipbooks([preview]);
          }
        }`;
listContent = listContent.replace(listFetchTarget, listFetchReplacement);
fs.writeFileSync('src/pages/admin/FlipbooksList.tsx', listContent);

