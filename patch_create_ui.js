import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/CreateFlipbook.tsx', 'utf8');

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
console.log("Patched Create UI text");
