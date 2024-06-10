const https = require('https');
const { JSDOM } = require('jsdom');
const targetUrl = require('./targeturl');

// Token autentikasi yang valid
const VALID_TOKEN = '6d978867a2a731bc3e63b98be0aa6fbc'; // Ganti dengan token autentikasi yang valid

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Memeriksa header Authorization
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(401).json({ error: 'No authorization header provided' });
        return;
    }

    const token = authHeader.split(' ')[1]; // Mengambil token dari header
    if (token !== VALID_TOKEN) {
        res.status(403).json({ error: 'Invalid token' });
        return;
    }

    const id = req.query.id || req.query; // Mengambil nilai parameter id dari permintaan
    
    if (!id) {
        res.status(400).json({ error: 'Parameter id tidak ditemukan' });
        return;
    }
    
    https.get(targetUrl + id, (response) => {
        let data = '';

        // Menerima data dari stream
        response.on('data', (chunk) => {
            data += chunk;
        });

        // Setelah data diterima sepenuhnya
        response.on('end', () => {
            // Mem-parse HTML menggunakan JSDOM
            const dom = new JSDOM(data);
            const document = dom.window.document;

            // Mengambil nilai dari elemen dengan class "mirroroption"
            const options = document.querySelectorAll('option.mirroroption');
            let servers = [];
            options.forEach((option, index) => {
                // Mendekode nilai option menggunakan base64
                const decodedValue = Buffer.from(option.value, 'base64').toString('utf-8');
                
                // Mengambil nilai dari atribut src dalam elemen iframe
                const srcValue = decodedValue.match(/src="([^"]+)"/)[1];
                
                servers.push({
                    [`server${index + 1}`]: srcValue
                });
            });

            // Mengkonversi nilai menjadi format JSON
            const jsonData = JSON.stringify(servers, null, 2);

            // Menampilkan data JSON di response
            res.setHeader('Content-Type', 'application/json');
            res.status(200).end(jsonData);
        });
    }).on('error', (e) => {
        console.error('Error:', e);
        res.status(500).end('Gagal mengambil data.');
    });
};
