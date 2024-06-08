const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { username } = req.query;
    const apiUrl = `https://api.sotwe.com/v3/user/${username}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error fetching data from ${apiUrl}: ${response.statusText}`);
        }
        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
