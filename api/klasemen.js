const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // Menambahkan header CORS ke dalam respons
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Mengatasi preflight request (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Mengambil nilai parameter id dari permintaan
    const id = req.query.id || 'default_id'; // Gantilah 'default_id' dengan ID default yang sesuai

    const url = `https://www.fotmob.com/api/tltable?leagueId=${id}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Mengambil array 'all' dari respons
        const allStandings = data[0].data.table.all;

        res.json(allStandings);
    } catch (error) {
        console.error('Error fetching standings:', error);
        res.status(500).json({ error: 'Error fetching standings' });
    }
};
