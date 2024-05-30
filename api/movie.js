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

    // Mengambil nilai parameter numberpage dari query
    const numberpage = req.query.numberpage || 1;

    // Mengambil data film dari halaman yang sesuai
    function fetchMovies(pageNumber) {
        const url = `https://tv.idlixofficial.net/movie/page/${pageNumber}`;
        
        return new Promise((resolve, reject) => {
            https.get(url, (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.on('end', () => {
                    // Mem-parse HTML menggunakan JSDOM
                    const { document } = new JSDOM(data).window;
                    // Memilih semua elemen film dari halaman
                    const movies = Array.from(document.querySelectorAll('div#archive-content article.item.movies'));
                    // Mengambil data yang diperlukan dari setiap film
                    const movieData = movies.map(movie => ({
                        slug: movie.querySelector('a').getAttribute('href'),
                        poster: movie.querySelector('img').getAttribute('src'),
                        title: movie.querySelector('h3').textContent.trim()
                    }));
                    resolve(movieData);
                });
            }).on('error', (err) => {
                reject(err);
            });
        });
    }

    try {
        const movies = await fetchMovies(numberpage);
        // Menanggapi dengan data film dalam format JSON
        res.status(200).json(movies);
    } catch (error) {
        // Menanggapi kesalahan dengan kode status 500 dan pesan kesalahan
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
