const https = require('https'); // Mengimpor modul HTTPS untuk melakukan permintaan HTTPS
const { JSDOM } = require('jsdom'); // Mengimpor modul JSDOM untuk memanipulasi dokumen HTML
const targetUrl = require('./targeturl');

// Token autentikasi yang valid
const VALID_TOKEN = '6d978867a2a731bc3e63b98be0aa6fbc'; // Token autentikasi yang diberikan

module.exports = (req, res) => {
    // Menambahkan header CORS ke dalam respons
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Mengatasi preflight request (OPTIONS)
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

    // Melakukan permintaan GET ke situs web sumber
    https.get(targetUrl, (response) => {
        let html = ''; // Variabel untuk menyimpan data HTML

        // Kumpulkan data HTML ketika ada
        response.on('data', (chunk) => {
            html += chunk;
        });

        // Setelah semua data diterima
        response.on('end', () => {
            // Membuat objek DOM dari HTML yang diterima
            const dom = new JSDOM(html);
            const document = dom.window.document;

            // Menemukan semua elemen pertandingan
            const matches = document.querySelectorAll('.listDec.zhibo.content .today.myList a');

            // Array untuk menyimpan data pertandingan
            const matchData = [];

            matches.forEach(match => {
                const fullLink = match.getAttribute('href'); // Mengambil link asli dari elemen <a>

                let paramOnly = null; // Inisialisasi paramOnly dengan null

                // Memeriksa apakah fullLink tidak null sebelum mencoba mendapatkan parameternya
                if (fullLink) {
                    const startIndex = fullLink.lastIndexOf('-') + 1;
                    if (startIndex !== -1) {
                        paramOnly = fullLink.substring(startIndex); // Mengambil bagian setelah tanda strip terakhir
                    }
                }

                const homeTeamImg = match.querySelector('.home_team img').getAttribute('data-src');
                const homeTeamName = match.querySelector('.home_team p').textContent.trim();
                const awayTeamImg = match.querySelector('.visit_team img').getAttribute('data-src');
                const awayTeamName = match.querySelector('.visit_team p').textContent.trim();

                // Mendapatkan tanggal pertandingan
                let dateElement = match.closest('.today.myList').querySelector('.date-p');
                let date;
                if (dateElement) {
                    date = dateElement.textContent.trim();
                } else {
                    dateElement = match.closest('.today.myList').querySelector('.todayTitle');
                    date = dateElement ? dateElement.textContent.trim() : 'Tanggal tidak ditemukan';
                }

                // Mendapatkan nama kompetisi
                const leagueElement = match.querySelector('.type p:nth-child(2)');
                const league = leagueElement ? leagueElement.textContent.trim() : 'Kompetisi tidak ditemukan';

                // Mendapatkan jam pertandingan
                const timeElement = match.querySelector('.type p:nth-child(3)');
                const time = timeElement ? timeElement.textContent.trim() : 'Jam tidak ditemukan';

                // Menambahkan data pertandingan ke dalam array matchData
                matchData.push({
                    date: date,
                    time: time,
                    league: league,
                    fullLink: "https://bolasiar.htmlplayer.xyz/?server=beta&param=" + paramOnly, // Menggunakan URL yang diinginkan
                    homeTeam: {
                        img: homeTeamImg,
                        name: homeTeamName
                    },
                    awayTeam: {
                        img: awayTeamImg,
                        name: awayTeamName
                    },
                    url: fullLink 
                });
            });

            // Mengirimkan data pertandingan sebagai respons JSON
            res.status(200).json(matchData);
        });
    }).on('error', (err) => {
        // Menangani kesalahan jika permintaan gagal
        res.status(500).json({ error: 'Error fetching data', details: err.message });
    });
};
