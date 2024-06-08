const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const url = 'https://api.sotwe.com/v3/user/aditendeur';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
