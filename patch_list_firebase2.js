import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/FlipbooksList.tsx', 'utf8');

const target = `const q = query(
          collection(db, 'flipbooks'),
          where('user_id', '==', user.uid),
          orderBy('created_at', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        setFlipbooks(books);`;
const replacement = `const q = query(
          collection(db, 'flipbooks'),
          where('user_id', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        // Sort in memory to avoid needing composite index
        books.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setFlipbooks(books);`;
        
content = content.replace(target, replacement);
fs.writeFileSync('src/pages/admin/FlipbooksList.tsx', content);

// Let's also do the DashboardOverview
let dashboard = fs.readFileSync('src/pages/admin/DashboardOverview.tsx', 'utf8');
const dashboardImportTarget = `import { useState, useEffect } from 'react';`;
const dashboardImportReplacement = `import { useState, useEffect } from 'react';\nimport { db } from '../../lib/firebase';\nimport { collection, query, getDocs, where } from 'firebase/firestore';\nimport { useAuth } from '../../lib/auth';`;
dashboard = dashboard.replace(dashboardImportTarget, dashboardImportReplacement);

const dashboardComponentTarget = `export default function DashboardOverview() {`;
const dashboardComponentReplacement = `export default function DashboardOverview() {\n  const { user } = useAuth();`;
dashboard = dashboard.replace(dashboardComponentTarget, dashboardComponentReplacement);

const dashboardFetchTarget = `      try {
        setFlipbooks([]); // Placeholder until firestore query is added
      } catch (error) {`;
const dashboardFetchReplacement = `      try {
        if (!user) return;
        const q = query(
          collection(db, 'flipbooks'),
          where('user_id', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        books.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setFlipbooks(books.slice(0, 5));
      } catch (error) {`;
dashboard = dashboard.replace(dashboardFetchTarget, dashboardFetchReplacement);
fs.writeFileSync('src/pages/admin/DashboardOverview.tsx', dashboard);

console.log("Patched memory sort");
