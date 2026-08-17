import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/FlipbooksList.tsx', 'utf8');

const importTarget = `import { useState, useEffect } from 'react';`;
const importReplacement = `import { useState, useEffect } from 'react';\nimport { db } from '../../lib/firebase';\nimport { collection, query, orderBy, getDocs, where } from 'firebase/firestore';\nimport { useAuth } from '../../lib/auth';`;
content = content.replace(importTarget, importReplacement);

const componentTarget = `export default function FlipbooksList() {`;
const componentReplacement = `export default function FlipbooksList() {\n  const { user } = useAuth();`;
content = content.replace(componentTarget, componentReplacement);

const fetchTarget = `      try {
        setFlipbooks([]); // Placeholder until firestore query is added
      } catch (error) {`;
const fetchReplacement = `      try {
        if (!user) return;
        const q = query(
          collection(db, 'flipbooks'),
          where('user_id', '==', user.uid),
          orderBy('created_at', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        setFlipbooks(books);
      } catch (error) {`;
content = content.replace(fetchTarget, fetchReplacement);

fs.writeFileSync('src/pages/admin/FlipbooksList.tsx', content);
console.log("Patched FlipbooksList to use Firestore");
