import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/CreateFlipbook.tsx', 'utf8');

if (!content.includes("import JSZip")) {
    content = content.replace(
        "import * as pdfjsLib from 'pdfjs-dist';",
        "import * as pdfjsLib from 'pdfjs-dist';\nimport JSZip from 'jszip';"
    );
}

const targetFileChange = `  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const filesList = e.target?.files || e.dataTransfer?.files;
    if (filesList && filesList.length > 0) {
      const selectedFiles = Array.from(filesList as File[]).sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}));
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
      
      e.target.value = '';
    }
  };`;

const replacementFileChange = `  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement> | any) => {
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
      
      if (e.target.value) {
        e.target.value = '';
      }
    }
  };`;

if (content.includes(targetFileChange)) {
  content = content.replace(targetFileChange, replacementFileChange);
} else {
  console.log("Could not find targetFileChange.");
}

// Update the accept attribute to include zip
const inputTarget = `accept="application/pdf, image/*"`;
const inputReplacement = `accept="application/pdf, image/*, application/zip, .zip"`;
content = content.replace(inputTarget, inputReplacement);

const labelTarget = `Click or drag PDF or Images to upload`;
const labelReplacement = `Click or drag PDF, Images, or a ZIP folder to upload`;
content = content.replace(labelTarget, labelReplacement);

const subLabelTarget = `Upload a single PDF or multiple Images.`;
const subLabelReplacement = `Upload a single PDF, multiple Images, or a .zip file of images.`;
content = content.replace(subLabelTarget, subLabelReplacement);


fs.writeFileSync('src/pages/admin/CreateFlipbook.tsx', content);
console.log("Patched ZIP upload support.");
