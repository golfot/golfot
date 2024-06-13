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

    const search = req.query.search || '';
    // Memeriksa apakah parameter code telah diberikan
    if (!search) {
        res.status(400).json({ error: 'Parameter search=indonesia atau negara tidak ditemukan' });
        return;
    }

    const urls = 'https://artist.dutamovie21.cloud/';
    let url = `${urls}?s=${search}&search=advanced&post_type=&index=&orderby=&genre=&movieyear=&country=indonesia&quality=`;
  

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
                const poster = article.querySelector('img[class="attachment-medium size-medium wp-post-image"') ? article.querySelector('img[class="attachment-medium size-medium wp-post-image"').getAttribute('src') : 'N/A';
                const title = article.querySelector('h2') ? article.querySelector('h2').textContent.trim() : 'N/A';
                let slug = article.querySelector('h2 a') ? article.querySelector('h2 a').getAttribute('href') : 'N/A';

                // Menetapkan nilai type berdasarkan nilai slug
                const type = slug.includes('/tv/') ? 'tv' : 'movie';
                
                // Menghapus bagian "https" dan domain dari slug menggunakan regex
                slug = slug.replace(/^https?:\/\/[^/]+/, '');

                // Menghapus simbol slash ('/') pertama dan terakhir dari slug
                slug = slug.replace(/^\/|\/$/g, '');
                
                results.push({
                    poster,
                    title,
                    slug,
                    type
                });
            });

            res.status(200).json(results);
        });

    }).on('error', (err) => {
        res.status(500).json({ error: err.message });
    });
};
