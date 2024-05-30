const fetch = require('node-fetch');
const timeago = require('timeago.js');

// Register Indonesian locale for timeago
timeago.register('id', (number, index, total_sec) => [
    ['baru saja', 'sebentar'],
    ['%s detik yang lalu', 'dalam %s detik'],
    ['1 menit yang lalu', 'dalam 1 menit'],
    ['%s menit yang lalu', 'dalam %s menit'],
    ['1 jam yang lalu', 'dalam 1 jam'],
    ['%s jam yang lalu', 'dalam %s jam'],
    ['1 hari yang lalu', 'dalam 1 hari'],
    ['%s hari yang lalu', 'dalam %s hari'],
    ['1 minggu yang lalu', 'dalam 1 minggu'],
    ['%s minggu yang lalu', 'dalam %s minggu'],
    ['1 bulan yang lalu', 'dalam 1 bulan'],
    ['%s bulan yang lalu', 'dalam %s bulan'],
    ['1 tahun yang lalu', 'dalam 1 tahun'],
    ['%s tahun yang lalu', 'dalam %s tahun']
][index]);

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

    // Mengambil nilai parameter id dari permintaan
    const id = req.query.id || 'default_id'; // Gantilah 'default_id' dengan ID default yang sesuai

    const url = `https://www.sofascore.com/api/v1/unique-tournament/${id}/media`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Proses data
        const formattedMedia = data.media.map(item => {
            const timeAgo = timeago.format(new Date(item.createdAtTimestamp * 1000), 'id'); // Konversi timestamp ke milidetik
            return {
                title: item.title,
                subtitle: item.subtitle,
                url: item.url,
                thumbnailUrl: item.thumbnailUrl,
                mediaType: item.mediaType,
                doFollow: item.doFollow,
                keyHighlight: item.keyHighlight,
                id: item.id,
                createdAt: timeAgo,
                sourceUrl: item.sourceUrl
            };
        });

        res.json(formattedMedia);
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ error: 'Error fetching media' });
    }
};
