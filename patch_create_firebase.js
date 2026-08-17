import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/CreateFlipbook.tsx', 'utf8');

const importTarget = `import { previewStore } from '../../lib/store';`;
const importReplacement = `import { previewStore } from '../../lib/store';\nimport { db } from '../../lib/firebase';\nimport { collection, addDoc } from 'firebase/firestore';\nimport { useAuth } from '../../lib/auth';`;
content = content.replace(importTarget, importReplacement);

const componentTarget = `export default function CreateFlipbook() {`;
const componentReplacement = `export default function CreateFlipbook() {\n  const { user } = useAuth();`;
content = content.replace(componentTarget, componentReplacement);

const saveTarget = `      // Just save to local preview store for now
      await previewStore.save({
        title,
        description,
        cover_image: base64Pages[0],
        pages,
        hotspots,
        page_count: pages.length
      });`;
const saveReplacement = `      const catalogueData = {
        title,
        description,
        cover_image: base64Pages[0],
        pages,
        hotspots,
        page_count: pages.length,
        created_at: new Date().toISOString(),
        user_id: user?.uid || 'anonymous'
      };
      
      // Save to local preview store
      await previewStore.save(catalogueData);
      
      // Save to Firestore
      try {
        await addDoc(collection(db, 'flipbooks'), catalogueData);
      } catch (err) {
        console.error("Failed to save to Firestore:", err);
      }`;
content = content.replace(saveTarget, saveReplacement);

fs.writeFileSync('src/pages/admin/CreateFlipbook.tsx', content);
console.log("Patched CreateFlipbook to use Firestore");
