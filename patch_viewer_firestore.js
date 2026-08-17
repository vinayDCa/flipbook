import fs from 'fs';

let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

const importTarget = `import { previewStore } from '../../lib/store';`;
const importReplacement = `import { previewStore } from '../../lib/store';\nimport { db } from '../../lib/firebase';\nimport { doc, getDoc } from 'firebase/firestore';`;
content = content.replace(importTarget, importReplacement);

const loadTarget = `      if (slug === 'preview') {
        const previewData = await previewStore.load();
        if (previewData) {
          setCatalogue(previewData);
        } else {
          navigate('/admin/create');
        }
      } else {
        // Fallback to demo for any other slug until backend is connected
        setCatalogue(DEMO_CATALOGUE);
      }`;
      
const loadReplacement = `      if (slug === 'preview') {
        const previewData = await previewStore.load();
        if (previewData) {
          setCatalogue(previewData);
        } else {
          navigate('/admin/create');
        }
      } else if (slug) {
        try {
          const docRef = doc(db, 'flipbooks', slug);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCatalogue(docSnap.data());
          } else {
            setCatalogue(DEMO_CATALOGUE);
          }
        } catch (e) {
          setCatalogue(DEMO_CATALOGUE);
        }
      } else {
        setCatalogue(DEMO_CATALOGUE);
      }`;

content = content.replace(loadTarget, loadReplacement);
fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);

console.log("Patched viewer firestore");
