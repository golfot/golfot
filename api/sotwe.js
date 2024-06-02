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

    // Mengambil nilai parameter next dari permintaan
    const next = req.query.next || 'default_next'; // Gantilah 'default_next' dengan nilai default yang sesuai

    const url = `https://api.sotwe.com/v3/user/aditendeur?after=${next}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Mengambil 'key' dan array 'data' dari respons
        const key = data.key;
        const userData = data.data;

        // Mengambil mediaEntities dengan tipe 'video'
        const videoEntities = userData.map(item => {
            return item.mediaEntities ? item.mediaEntities.filter(media => media.type === 'video') : [];
        }).flat();

        res.json({ key, videoEntities });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
};
