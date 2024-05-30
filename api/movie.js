const https = require('https');
const { JSDOM } = require('jsdom');

const targetUrl = 'https://tv.idlixofficial.net/movie/page/';

module.exports = (req, res) => {
    // Menambahkan header CORS ke dalam respons
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Mengatasi preflight request (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Mengambil ID dari query
    const id = req.query.id;

    if (!id) {
        res.status(400).json({ error: 'Parameter id tidak ditemukan' });
        return;
    }

    // Menentukan header User-Agent
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
        }
    };

    // Melakukan permintaan GET ke targetUrl dengan ID yang diberikan
    https.get(targetUrl + id, options, (response) => {
        let html = ''; // Variabel untuk menyimpan data HTML

        // Kumpulkan data HTML ketika ada
        response.on('data', (chunk) => {
            html += chunk;
        });

        // Setelah semua data diterima
        response.on('end', () => {
            try {
                // Membuat objek DOM dari HTML yang diterima
                const dom = new JSDOM(html);
                const document = dom.window.document;

                // Menemukan semua elemen film
                const movies = Array.from(document.querySelectorAll('div#archive-content article.item.movies'));

                // Array untuk menyimpan data film
                const moviesData = [];

                movies.forEach(movie => {
                    // Mengambil slug dari elemen <h3> yang di dalamnya terdapat elemen <a>
                    const slugElement = movie.querySelector('h3 a');
                    const slug = slugElement.getAttribute('href');
                    const poster = movie.querySelector('img').getAttribute('src');
                    const title = slugElement.textContent.trim();

                    // Menambahkan data film ke dalam array moviesData
                    moviesData.push({
                        slug: slug,
                        poster: poster,
                        title: title
                    });
                });

                // Menanggapi dengan data film dalam format JSON
                res.status(200).json(moviesData);
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }).on('error', (error) => {
        res.status(500).json({ error: 'Internal Server Error' });
    });
};
