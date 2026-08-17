import fs from 'fs';

// App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/import \{ hasSupabaseConfig \} from '\.\/lib\/supabase';\n/g, '');
appContent = appContent.replace(/if \(\!hasSupabaseConfig && window\.location\.pathname \!\=\= '\/setup'\) \{\n.*\n.*\}/g, '');
appContent = appContent.replace(/if \(\!hasSupabaseConfig && window\.location\.pathname \!\=\= '\/setup'\) \{/g, 'if (false) {');
fs.writeFileSync('src/App.tsx', appContent);

// DashboardOverview.tsx
let dashboardContent = fs.readFileSync('src/pages/admin/DashboardOverview.tsx', 'utf8');
const dashboardImportTarget = `import { useState, useEffect } from 'react';`;
const dashboardImportReplacement = `import { useState, useEffect } from 'react';\nimport { db } from '../../lib/firebase';\nimport { collection, query, getDocs, where } from 'firebase/firestore';\nimport { useAuth } from '../../lib/auth';`;
if (!dashboardContent.includes('../../lib/firebase')) {
  dashboardContent = dashboardContent.replace(dashboardImportTarget, dashboardImportReplacement);
}
const dashboardComponentTarget = `export default function DashboardOverview() {`;
const dashboardComponentReplacement = `export default function DashboardOverview() {\n  const { user } = useAuth();`;
if (!dashboardContent.includes('const { user } = useAuth();')) {
  dashboardContent = dashboardContent.replace(dashboardComponentTarget, dashboardComponentReplacement);
}

const dbTarget = `        if (!hasSupabaseConfig) {
          setFlipbooks([]);
          return;
        }
        
        const { data, error } = await supabase.from('flipbooks').select('*').order('created_at', { ascending: false }).limit(5);
        if (error) throw error;
        setFlipbooks(data || []);`;
        
const dbReplacement = `        if (!user) return;
        const q = query(
          collection(db, 'flipbooks'),
          where('user_id', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        books.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setFlipbooks(books.slice(0, 5));`;
dashboardContent = dashboardContent.replace(dbTarget, dbReplacement);
fs.writeFileSync('src/pages/admin/DashboardOverview.tsx', dashboardContent);

// FlipbooksList.tsx
let flipbooksContent = fs.readFileSync('src/pages/admin/FlipbooksList.tsx', 'utf8');
const flipbooksImportTarget = `import { useState, useEffect } from 'react';`;
const flipbooksImportReplacement = `import { useState, useEffect } from 'react';\nimport { db } from '../../lib/firebase';\nimport { collection, query, getDocs, where } from 'firebase/firestore';\nimport { useAuth } from '../../lib/auth';`;
if (!flipbooksContent.includes('../../lib/firebase')) {
  flipbooksContent = flipbooksContent.replace(flipbooksImportTarget, flipbooksImportReplacement);
}
const flipbooksComponentTarget = `export default function FlipbooksList() {`;
const flipbooksComponentReplacement = `export default function FlipbooksList() {\n  const { user } = useAuth();`;
if (!flipbooksContent.includes('const { user } = useAuth();')) {
  flipbooksContent = flipbooksContent.replace(flipbooksComponentTarget, flipbooksComponentReplacement);
}
const listTarget = `        if (!hasSupabaseConfig) {
          setFlipbooks([]);
          return;
        }

        const { data, error } = await supabase.from('flipbooks').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setFlipbooks(data || []);`;
const listReplacement = `        if (!user) return;
        const q = query(
          collection(db, 'flipbooks'),
          where('user_id', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        books.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setFlipbooks(books);`;
flipbooksContent = flipbooksContent.replace(listTarget, listReplacement);
fs.writeFileSync('src/pages/admin/FlipbooksList.tsx', flipbooksContent);

// PublicViewer.tsx
let viewerContent = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');
viewerContent = viewerContent.replace(/onPageChange=\{handlePageChangeWithSound\}/g, 'onPageChange={handlePageChange}');
fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', viewerContent);

console.log("Patched remaining syntax errors");
