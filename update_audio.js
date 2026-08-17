import fs from 'fs';
let content = fs.readFileSync('src/pages/viewer/PublicViewer.tsx', 'utf8');

content = content.replace("usePageTurnSound('https://cdn.freesound.org/previews/411/411639_5121236-lq.mp3')", "usePageTurnSound('/flip.wav')");
content = content.replace("https://upload.wikimedia.org/wikipedia/commons/4/4b/Piano_sonata_no._14_in_C-sharp_minor_%22Moonlight%22%2C_Op._27_No._2_-_I._Adagio_sostenuto.ogg", "https://cdn.pixabay.com/download/audio/2022/05/16/audio_b8c91021bc.mp3?filename=relaxing-music-119247.mp3");

fs.writeFileSync('src/pages/viewer/PublicViewer.tsx', content);
