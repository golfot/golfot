const puppeteer = require('puppeteer');

(async () => {
    // Mulai browser Puppeteer
    const browser = await puppeteer.launch();

    // Buka halaman baru
    const page = await browser.newPage();

    // Array untuk menyimpan data URL yang ditangkap
    let capturedUrls = [];

    // Tangkap semua permintaan jaringan
    page.on('request', request => {
        const url = request.url();
        console.log('Request URL:', url);

        // Jika URL mengandung "master.m3u8", tambahkan ke array capturedUrls
        if (url.includes('master.m3u8')) {
            capturedUrls.push(url);
            console.log('Captured URL:', url);
        }
    });

    // Buka halaman web target
    const targetUrl = 'https://artist.dutamovie21.cloud/sweet-release-2024/?player=3'; // Ganti dengan URL target
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });

    // Tunggu beberapa detik untuk memastikan semua permintaan telah ditangkap
    await page.waitForTimeout(10000); // 10 detik

    // Tutup browser
    await browser.close();

    // Mengkonversi nilai menjadi format JSON
    const jsonData = JSON.stringify({ capturedUrls }, null, 2);
    console.log(jsonData);
})();
