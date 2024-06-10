const https = require('https');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const url = 'https://new6.ngefilm21.yachts/country/indonesia/page/3';

https.get(url, (res) => {
    let data = '';

    // Mengumpulkan data yang diterima
    res.on('data', (chunk) => {
        data += chunk;
    });

    // Proses data setelah selesai diterima
    res.on('end', () => {
        const dom = new JSDOM(data);
        const document = dom.window.document;

        const articles = document.querySelectorAll('article');
        let results = [];

        articles.forEach(article => {
            const img = article.querySelector('img');
            const title = article.querySelector('h2');
            const link = title.querySelector('a');

            results.push({
                poster: img ? img.src : 'N/A',
                title: title ? title.textContent : 'N/A',
                slug: link ? link.href : 'N/A'
            });
        });

        console.log(JSON.stringify(results, null, 2));
    });

}).on('error', (err) => {
    console.error('Error:', err.message);
});
