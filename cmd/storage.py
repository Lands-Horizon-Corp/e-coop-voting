import requests

url = "https://t3.storageapi.dev/roomy-carton-ffoz3zmhr7ct/coop/coop-1.png"
r = requests.get(url)

print(r.status_code)  # 200
