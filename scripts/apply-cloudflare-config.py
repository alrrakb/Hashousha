import os
import sys
import json
import urllib.request

# Load from .env if present
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
if os.path.exists(env_path):
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                os.environ.setdefault(k.strip(), v.strip())

TOKEN = os.getenv('CLOUDFLARE_API_TOKEN')
ZONE_ID = os.getenv('CLOUDFLARE_ZONE_ID')

if not TOKEN or not ZONE_ID:
    print("❌ Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID in environment / .env", file=sys.stderr)
    sys.exit(1)

headers = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json'
}

def make_request(url, method='GET', data=None):
    body = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8')
        print(f"HTTP {e.code} Error for {method} {url}: {err_msg}", file=sys.stderr)
        return json.loads(err_msg) if err_msg.startswith('{') else None
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        return None

def verify_and_sync():
    print(f"📡 Cloudflare Zone: {ZONE_ID}")
    
    # Verify zone settings
    settings = ['ssl', 'brotli', 'early_hints', 'http3', 'always_use_https', 'security_level', 'browser_check']
    for s in settings:
        res = make_request(f"https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/settings/{s}")
        if res and res.get('success'):
            print(f"   - {s}: {res['result']['value']}")

if __name__ == '__main__':
    verify_and_sync()
