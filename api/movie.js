const https = require('https');
const { JSDOM } = require('jsdom');

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

    const id = req.query.id;

    if (!id) {
        res.status(400).json({ error: 'Parameter id tidak ditemukan' });
        return;
    }

    const targetUrl = `https://tv.idlixofficial.net/movie/page/${id}`;
    const moviesData = [];

    https.get(targetUrl, (response) => {
        let data = '';

        // Menerima data dari stream
        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            try {
                // Mem-parse HTML menggunakan JSDOM
                const { document } = new JSDOM(data).window;
                // Memilih semua elemen film dari halaman
                const movies = Array.from(document.querySelectorAll('div#archive-content article.item.movies'));
                
                // Mengambil data yang diperlukan dari setiap film dan push ke dalam array moviesData
                movies.forEach(movie => {
                    const slugElement = movie.querySelector('h3 a');
                    const movieObj = {
                        slug: slugElement.getAttribute('href'),
                        poster: movie.querySelector('img').getAttribute('src'),
                        title: movie.querySelector('h3').textContent.trim()
                    };
                    moviesData.push(movieObj);
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
