const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Postavljanje EJS kao template enginea
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Posluživanje statičkih datoteka iz mape public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/graphs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'graphs.html'));
})

app.get('/gallery', (req, res) => {
    const folderPath = path.join(__dirname, 'public', 'img', 'gallery');
    if (!fs.existsSync(folderPath)) {
        return res.status(404).send('Folder with gallery cannot be found.');
    }

    const files = fs.readdirSync(folderPath);

    // Filtriramo samo slike
    const images = files
        .filter(file =>
            file.endsWith('.jpg') ||
            file.endsWith('.jpeg') ||
            file.endsWith('.png') ||
            file.endsWith('.webp') ||
            file.endsWith('.svg')
        )
        .map((file, index) => ({
            url: `/img/gallery/${file}`,
            id: `slika${index + 1}`,
            title: formatTitle(file),
            alt: formatTitle(file)
        }));

    res.render('gallery', { images });
});

function formatTitle(filename) {
    return filename
        .replace(/\.[^.]+$/, '')                 // ukloni ekstenziju
        .replace(/[-_]/g, ' ')                   // zamijeni crtice/podvlake razmakom
        .replace(/\b\w/g, c => c.toUpperCase()); // veliko početno slovo svake riječi
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
