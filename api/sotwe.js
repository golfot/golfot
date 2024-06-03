const axios = require('axios');

module.exports = async (req, res) => {
    const url = 'https://api.sotwe.com/v3/user/aditendeur';

    try {
        const response = await axios.get(url);
        const data = response.data;
        const result = {
            after: data.after,
            data: data.data.map(post => {
                const videoUrl = post.mediaEntities?.[0]?.videoInfo?.variants?.find(variant => variant.type === 'video/mp4')?.url || '';
                return {
                    text: post.text,
                    type: post.mediaEntities?.[0]?.type || '',
                    video: videoUrl
                };
            })
        };

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
};
