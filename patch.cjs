const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/CreateFlipbook.tsx', 'utf8');
code = code.replace(`  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
        
    try {
      const arrayBuffer = await file.arrayBuffer();`, `  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
        
    try {
      const extractedPages = [];
      const isPDF = files[0].type === 'application/pdf';

      if (isPDF) {
        const arrayBuffer = await files[0].arrayBuffer();`);

code = code.replace(`        // Use JPEG for smaller memory footprint compared to PNG
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
        extractedPages.push({
          page_number: i,
          image_url: imageUrl,
          thumbnail_url: imageUrl
        });
            
        setProgress(Math.round((i / numPages) * 100));
      }
          
      await previewStore.save({
        title: 'Preview',
        slug: 'preview',
        page_count: numPages,
        pages: extractedPages,`, `        // Use JPEG for smaller memory footprint compared to PNG
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
        extractedPages.push({
          page_number: i,
          image_url: imageUrl,
          thumbnail_url: imageUrl
        });
            
        setProgress(Math.round((i / numPages) * 100));
      }
      } else {
        // Handle Multiple Images
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const imageUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          extractedPages.push({
            page_number: i + 1,
            image_url: imageUrl,
            thumbnail_url: imageUrl
          });

          setProgress(Math.round(((i + 1) / files.length) * 100));
        }
      }
          
      await previewStore.save({
        title: 'Preview',
        slug: 'preview',
        page_count: extractedPages.length,
        pages: extractedPages,`);

fs.writeFileSync('src/pages/admin/CreateFlipbook.tsx', code);
