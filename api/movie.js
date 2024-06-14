const request = require('request');

export default function handler(req, res) {
    const videoUrl = req.query.url;

    // Set the referer header to your domain
    const options = {
        url: videoUrl,
        headers: {
            'Referer': 'https://artist.dutamovie21.cloud/hit-man-2023/'
        }
    };

    // Pipe the request to the response
    request(options).pipe(res);
}
