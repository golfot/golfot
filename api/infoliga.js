const fetch = require('node-fetch');

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

    // Mengambil nilai parameter id dan ccode3 dari permintaan
    const id = req.query.id || 'default_id'; // Gantilah 'default_id' dengan ID default yang sesuai
    
    const url = `https://www.fotmob.com/api/leagues?id=${id}&ccode3=IDN`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Mengambil bagian detail dari respons
        const detailLiga = data.details;

          // Menghapus bagian itemListElement
        delete detailLiga.breadcrumbJSONLD.itemListElement;
        // Menghapus kunci tabs dan allAvailableSeasons jika ada
        delete detailLiga.tabs;
        delete detailLiga.allAvailableSeasons;

        res.json(detailLiga);
    } catch (error) {
        console.error('Error fetching league details:', error);
        res.status(500).json({ error: 'Error fetching league details' });
    }
};
