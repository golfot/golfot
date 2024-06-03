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

    try {
        const response = await fetch('https://api.sotwe.com/v3/user/aditendeur');
        const data = await response.json();

        const result = {
            after: data.after,
            videos: data.data.map(post => {
                const videoEntities = post.mediaEntities || post.retweetedStatus?.mediaEntities;
                if (videoEntities && videoEntities.length > 0) {
                    const videoUrl = videoEntities[0].videoInfo?.variants?.find(variant => variant.type === 'video/mp4')?.url || '';
                    const displayURL = videoEntities[0].displayURL || '';
                    const type = videoEntities[0].type || '';
                    return { displayURL, type };
                }
                return null;
            }).filter(video => video !== null)
        };

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error' });
    }
};
