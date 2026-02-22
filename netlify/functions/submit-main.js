exports.handler = async (event) => {

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
    const SECRET_TOKEN    = process.env.SECRET_TOKEN;

    if (!APPS_SCRIPT_URL || !SECRET_TOKEN) {
        return { statusCode: 500, body: "Server misconfigured" };
    }

    // Validasi origin — hanya dari domain kamu
    const allowedOrigins = [
        "https://gadaibpkbmobil.com",
        "https://www.gadaibpkbmobil.com"
    ];
    const origin = event.headers.origin || "";
    if (!allowedOrigins.includes(origin)) {
        return { statusCode: 403, body: "Forbidden" };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch {
        return { statusCode: 400, body: "Invalid JSON" };
    }

    // Token ditambahkan di server — tidak pernah ada di browser
    body.token = SECRET_TOKEN;

    try {
        await fetch(APPS_SCRIPT_URL, {
            method:  "POST",
            headers: { "Content-Type": "text/plain" },
            body:    JSON.stringify(body)
        });
    } catch (err) {
        console.error("Apps Script error:", err);
        return { statusCode: 502, body: "Failed to forward data" };
    }

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": origin,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ success: true })
    };
};

