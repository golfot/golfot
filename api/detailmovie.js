const https = require('https');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = async (req, res) => {
    // Menambahkan header CORS ke dalam respons
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Mengatasi preflight request (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const url = 'https://new6.ngefilm21.yachts/dinda-2024/?player=3';

    https.get(url, (response) => {
        let data = '';

        // Mengumpulkan data yang diterima
        response.on('data', (chunk) => {
            data += chunk;
        });

        // Proses data setelah selesai diterima
        response.on('end', () => {
            const dom = new JSDOM(data);
            const document = dom.window.document;

            // Mengambil data simpinis
            const simpinisElement = document.querySelector('p span');
            const simpinis = simpinisElement ? simpinisElement.textContent.trim() : 'N/A';

            // Mengambil semua data detail movie
            const detailMovieElements = document.querySelectorAll('div.gmr-moviedata');
            let detailMovie = [];

            detailMovieElements.forEach(element => {
                const lines = element.textContent.trim().split('\n');
                let detailObject = {};
                lines.forEach(line => {
                    const parts = line.split(':');
                    const key = parts[0].trim();
                    const value = parts[1].trim();
                    detailObject[key] = value;
                });
                detailMovie.push(detailObject);
            });

            // Mengambil URL dari elemen iframe
            const iframeElement = document.querySelector('iframe');
            const iframeUrl = iframeElement ? iframeElement.getAttribute('src') : 'N/A';

            // Membuat objek detail movie
            const detailMovieObject = {
                simpinis,
                detailMovie,
                iframeUrl
            };

            res.status(200).json(detailMovieObject);
        });

    }).on('error', (err) => {
        res.status(500).json({ error: err.message });
    });
};
