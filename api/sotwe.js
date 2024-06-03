const axios = require('axios');

const fetchData = async () => {
    try {
        const response = await axios.get('https://api.sotwe.com/v3/user/aditendeur?after=');
        const responseData = response.data;

        const result = {
            after: responseData.after,
            videos: responseData.data.map(post => {
                const videoEntities = post.mediaEntities || post.retweetedStatus?.mediaEntities;
                if (videoEntities && videoEntities.length > 0) {
                    const videoUrl = videoEntities[0].videoInfo?.variants?.find(variant => variant.type === 'video/mp4')?.url || '';
                    const displayURL = videoEntities[0].displayURL || '';
                    const type = videoEntities[0].type || '';
                    return { displayURL, type, videoUrl };
                }
                return null;
            }).filter(video => video !== null)
        };

        return JSON.stringify(result, null, 2);
    } catch (error) {
        console.error('Error wuhh:', error);
        return JSON.stringify({ error: 'Error wuh' }, null, 2);
    }
};

fetchData()
    .then(jsonResult => console.log(jsonResult))
    .catch(err => console.error('Error:', err));
