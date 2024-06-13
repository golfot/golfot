const express = require('express');
const request = require('request');
const app = express();
const port = process.env.PORT || 3000;

// Endpoint untuk menyajikan halaman HTML dengan iframe
app.get('/api/player', (req, res) => {
    // Set referer dan iframe URL
    const referer = "https://artist.dutamovie21.cloud/";
    const iframeUrl = "https://vidhidepre.com/embed/v5xyj2j9puch";

    // Kirim HTML dengan iframe ke client
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>WebView with Referer</title>
        </head>
        <body>
            <h1>WebView with Referer</h1>
            <iframe id="webview" src="/proxy" width="100%" height="500px" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </body>
        </html>
    `);
});

// Proxy endpoint untuk mengatur referer header
app.get('/proxy', (req, res) => {
    const referer = "https://artist.dutamovie21.cloud/";
    const iframeUrl = "https://vidhidepre.com/embed/v5xyj2j9puch";

    // Buat permintaan ke iframe URL dengan referer header yang diatur
    const options = {
        url: iframeUrl,
        headers: {
            'Referer': referer
        }
    };

    // Stream respons dari iframe URL ke klien
    request(options).pipe(res);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
