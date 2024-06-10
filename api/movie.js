const https = require('https');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const url = 'https://new6.ngefilm21.yachts/country/indonesia/page/3';

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

            const articles = document.querySelectorAll('article');
            let results = [];

            articles.forEach(article => {
                const img = article.querySelector('img');
                const title = article.querySelector('h2');
                const link = title.querySelector('a');

                results.push({
                    poster: img ? img.src : 'N/A',
                    title: title ? title.textContent.trim() : 'N/A',
                    slug: link ? link.href : 'N/A'
                });
            });

            res.status(200).json(results);
        });

    }).on('error', (err) => {
        res.status(500).json({ error: err.message });
    });
};
