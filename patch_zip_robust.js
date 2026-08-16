import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/CreateFlipbook.tsx', 'utf8');

const handleFileChangeStart = content.indexOf('const handleFileChange =');
const handleFileChangeEnd = content.indexOf('const removeFile =', handleFileChangeStart);

const newFunction = `const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const filesList = e.target?.files || e.dataTransfer?.files;
    if (filesList && filesList.length > 0) {
      const selectedFiles = Array.from(filesList as File[]).sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}));
      
      // Handle ZIP Files
      const isZip = selectedFiles.some(f => f.name.toLowerCase().endsWith('.zip') || f.type.includes('zip'));
      
      if (isZip) {
        setIsProcessing(true);
        const zipFile = selectedFiles.find(f => f.name.toLowerCase().endsWith('.zip') || f.type.includes('zip'));
        if (zipFile) {
          try {
            const zip = new JSZip();
            const loadedZip = await zip.loadAsync(zipFile);
            const extractedFiles: File[] = [];
            
            const entries = Object.entries(loadedZip.files);
            for (const [relativePath, zipEntry] of entries) {
              if (!zipEntry.dir && relativePath.match(/\\.(jpg|jpeg|png|webp|gif)$/i)) {
                // Ignore __MACOSX and hidden files
                if (relativePath.includes('__MACOSX') || relativePath.split('/').pop()?.startsWith('.')) continue;
                
                const blob = await zipEntry.async('blob');
                const file = new File([blob], relativePath.split('/').pop() || 'image.jpg', { type: blob.type || 'image/jpeg' });
                extractedFiles.push(file);
              }
            }
            
            extractedFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}));
            
            setFiles(prev => {
              const prevIsPDF = prev.length > 0 && prev[0].type === 'application/pdf';
              if (prevIsPDF) return extractedFiles;
              return [...prev, ...extractedFiles];
            });
          } catch (err) {
            console.error("Failed to parse zip", err);
            alert("Failed to parse zip file. Please ensure it contains valid images.");
          }
        }
        setIsProcessing(false);
      } else {
        const isPDF = selectedFiles.some(f => (f as any).type === 'application/pdf');

        if (isPDF) {
          if (selectedFiles.length > 1) {
              alert('Please upload either a single PDF or multiple images.');
              return;
          }
          setFiles(selectedFiles);
        } else {
          setFiles(prev => {
              const prevIsPDF = prev.length > 0 && prev[0].type === 'application/pdf';
              if (prevIsPDF) return selectedFiles;
              return [...prev, ...selectedFiles];
          });
        }
      }
      
      if (e.target && e.target.value !== undefined) {
        try { e.target.value = ''; } catch(e) {}
      }
    }
  };

  `;

content = content.substring(0, handleFileChangeStart) + newFunction + content.substring(handleFileChangeEnd);

fs.writeFileSync('src/pages/admin/CreateFlipbook.tsx', content);
console.log("Patched robust ZIP handling.");
