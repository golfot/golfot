const express = require('express');
const router = express.Router();

// GET /api/player route
router.get('/api/movie', (req, res) => {
    // Logic to handle player API
    res.json({ message: 'Player API endpoint reached!' });
});

// Route to serve HTML with iframe
router.get('/', (req, res) => {
    // Set the referer URL
    const referer = "https://artist.dutamovie21.cloud/";
    // Set the iframe URL
    const iframeUrl = "https://vidhidepre.com/embed/v5xyj2j9puch";

    // Set response headers to control referer
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Send HTML with iframe to client
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
            <iframe id="webview" src="${iframeUrl}" referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </body>
        </html>
    `);
});

module.exports = router;
