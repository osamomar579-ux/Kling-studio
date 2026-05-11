export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  const klingPath = Array.isArray(path) ? path.join('/') : path;
  const klingUrl = `https://api-singapore.klingai.com/v1/${klingPath}`;

  try {
    const authHeader = req.headers['authorization'];

    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    };

    if (req.method === 'POST' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const klingRes = await fetch(klingUrl, fetchOptions);
    const data = await klingRes.json();

    return res.status(klingRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
