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

        // Memeriksa apakah respons berhasil
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Memeriksa apakah data dan kunci 'data' tersedia
        if (!data || !data.data) {
            throw new Error('Invalid data structure');
        }

        // Mengambil 'key' dari respons
        const key = data.key;

        // Mengambil informasi yang dibutuhkan dari array 'data'
        const userData = data.data.map(item => {
            const mediaEntity = item.mediaEntities?.find(media => media.type === 'video' || media.type === 'photo');
            const mp4Variant = mediaEntity?.type === 'video' 
                ? mediaEntity?.videoInfo?.variants?.find(variant => variant.type === 'video/mp4') 
                : null;

            return {
                text: item.text,
                type: mediaEntity ? mediaEntity.type : null,
                videoURL: mp4Variant ? mp4Variant.url : null
            };
        });

        res.json({ key, userData });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Error fetching data' });
    }
};
