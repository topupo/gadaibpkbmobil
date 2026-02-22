export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
    const SECRET_TOKEN    = process.env.SECRET_TOKEN;

    if (!APPS_SCRIPT_URL || !SECRET_TOKEN) {
        return res.status(500).json({ error: 'Server misconfigured' });
    }

    // Validasi origin
    const allowedOrigins = [
        'https://gadaibpkbmobil.com',
        'https://www.gadaibpkbmobil.com'
    ];
    const origin = req.headers.origin || '';
    if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    // Set CORS header
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Content-Type', 'application/json');

    const body = req.body;

    // Token ditambahkan di server
    body.token = SECRET_TOKEN;

    try {
        await fetch(APPS_SCRIPT_URL, {
            method:  'POST',
            headers: { 'Content-Type': 'text/plain' },
            body:    JSON.stringify(body)
        });
    } catch (err) {
        console.error('Apps Script error:', err);
        return res.status(502).json({ error: 'Failed to forward data' });
    }

    return res.status(200).json({ success: true });
}
