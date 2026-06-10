const TOKEN_URL = 'https://services.sentinel-hub.com/oauth/token';
const PROCESS_URL = 'https://services.sentinel-hub.com/api/v1/process';
const ALLOWED_LAYERS = new Set(['ndvi', 'ndmi']);

let tokenCache = {
    accessToken: '',
    expiresAt: 0
};

const evalscripts = {
    ndvi: `
        //VERSION=3
        function setup() {
            return { input: ["B08", "B04", "dataMask"], output: { bands: 4 } };
        }
        function evaluatePixel(sample) {
            let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04 + 0.0001);
            if (ndvi < 0.1) return [0.5, 0.5, 0.5, sample.dataMask];
            if (ndvi < 0.3) return [0.65, 0.35, 0.07, sample.dataMask];
            if (ndvi < 0.5) return [0.9, 0.9, 0.2, sample.dataMask];
            if (ndvi < 0.7) return [0.3, 0.8, 0.3, sample.dataMask];
            return [0.0, 0.4, 0.0, sample.dataMask];
        }
    `,
    ndmi: `
        //VERSION=3
        function setup() {
            return { input: ["B08", "B11", "dataMask"], output: { bands: 4 } };
        }
        function evaluatePixel(sample) {
            let ndmi = (sample.B08 - sample.B11) / (sample.B08 + sample.B11 + 0.0001);
            if (ndmi < -0.2) return [0.54, 0.27, 0.07, sample.dataMask];
            if (ndmi < 0.0)  return [0.82, 0.70, 0.54, sample.dataMask];
            if (ndmi < 0.2)  return [1.0,  1.0,  1.0,  sample.dataMask];
            if (ndmi < 0.4)  return [0.53, 0.80, 0.92, sample.dataMask];
            return [0.0, 0.0, 1.0, sample.dataMask];
        }
    `
};

function sendJson(res, status, body) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(body));
}

function isSameOrigin(req) {
    const host = req.headers.host;
    const origin = req.headers.origin;
    const referer = req.headers.referer || req.headers.referrer;

    try {
        if (origin && new URL(origin).host !== host) return false;
        if (referer && new URL(referer).host !== host) return false;
        return true;
    } catch {
        return false;
    }
}

async function getAccessToken() {
    const now = Date.now();
    if (tokenCache.accessToken && tokenCache.expiresAt > now + 30_000) {
        return tokenCache.accessToken;
    }

    const clientId = process.env.SENTINEL_CLIENT_ID;
    const clientSecret = process.env.SENTINEL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('missing_sentinel_credentials');
    }

    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret
        })
    });

    if (!response.ok) {
        throw new Error(`sentinel_oauth_${response.status}`);
    }

    const data = await response.json();
    if (!data.access_token) {
        throw new Error('sentinel_oauth_empty_token');
    }

    tokenCache = {
        accessToken: data.access_token,
        expiresAt: now + Math.max(60, Number(data.expires_in || 300)) * 1000
    };

    return data.access_token;
}

function buildProcessBody(layer, lat, lon) {
    const toDate = new Date();
    const fromDate = new Date(toDate);
    fromDate.setMonth(toDate.getMonth() - 3);

    return {
        input: {
            bounds: {
                bbox: [lon - 0.03, lat - 0.03, lon + 0.03, lat + 0.03]
            },
            data: [{
                type: 'sentinel-2-l2a',
                dataFilter: {
                    timeRange: {
                        from: fromDate.toISOString(),
                        to: toDate.toISOString()
                    },
                    maxCloudCoverage: 10
                }
            }]
        },
        output: {
            width: 800,
            height: 450,
            responses: [{ identifier: 'default', format: { type: 'image/png' } }]
        },
        evalscript: evalscripts[layer]
    };
}

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return sendJson(res, 405, { error: 'method_not_allowed' });
    }

    if (!isSameOrigin(req)) {
        return sendJson(res, 403, { error: 'forbidden_origin' });
    }

    const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
    const layer = String(url.searchParams.get('layer') || '').toLowerCase();
    const lat = Number(url.searchParams.get('lat'));
    const lon = Number(url.searchParams.get('lon'));

    if (!ALLOWED_LAYERS.has(layer) || !Number.isFinite(lat) || !Number.isFinite(lon)) {
        return sendJson(res, 400, { error: 'invalid_request' });
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        return sendJson(res, 400, { error: 'coordinates_out_of_range' });
    }

    try {
        const token = await getAccessToken();
        const sentinelResponse = await fetch(PROCESS_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(buildProcessBody(layer, lat, lon))
        });

        if (!sentinelResponse.ok) {
            return sendJson(res, sentinelResponse.status, { error: 'sentinel_process_failed' });
        }

        const imageBuffer = Buffer.from(await sentinelResponse.arrayBuffer());
        res.statusCode = 200;
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=21600, stale-while-revalidate=86400');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        return res.end(imageBuffer);
    } catch (error) {
        console.error('Sentinel API error:', error.message);
        return sendJson(res, 500, { error: 'sentinel_unavailable' });
    }
};
