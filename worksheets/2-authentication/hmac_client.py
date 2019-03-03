import hmac
import requests
import hashlib
import json

URL = 'http://127.0.0.1:3000/api/products'

ACCESS_KEY = 'uj&7AK6^A#e|R,Vn[m$A'
SECRET_KEY = 'uj&7AK6^A#e|R,Vn[m$A=^B;aaAb@{c]3@n=pnZW'

hash = hmac.new(bytearray(ACCESS_KEY.encode('utf-8')), bytearray(SECRET_KEY.encode('utf-8')), hashlib.sha256).hexdigest()

payload = {
    'access_key': ACCESS_KEY,
    'secret_key': SECRET_KEY
}

response = requests.post(url = URL, headers = {'Authorization': hash})

data = response.json()

print(json.dumps(data, indent=4, sort_keys=True))
