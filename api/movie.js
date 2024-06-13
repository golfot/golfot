const axios = require('axios');
const express = require('express');
const app = express();
const port = 3000;

async function loadUrlWithReferer() {
    try {
        const response = await axios.get('https://vidhidepre.com/embed/v5xyj2j9puch', {
            headers: {
                'Referer': 'https://artist.dutamovie21.cloud/'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error loading the URL:', error);
        return null;
    }
}

app.get('/api/movie', async (req, res) => {
    const data = await loadUrlWithReferer();
    if (data) {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Loaded URL</title>
            </head>
            <body>
                <iframe srcdoc="${data}" width="100%" height="600" frameborder="0"></iframe>
            </body>
            </html>
        `);
    } else {
        res.send('Failed to load the URL');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
