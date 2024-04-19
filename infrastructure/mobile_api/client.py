import requests


def login(username: str, password: str) -> str:
    url = "https://services.virtuagym.com/v2/auth/login"

    payload = {"username": username, "password": password}

    headers = {"Content-Type": "application/json"}

    response = requests.post(url, headers=headers, json=payload, timeout=10)

    access_token = ""
    if response.status_code == 200:
        response_json = response.json()
        access_token = response_json.get("accessToken")
    else:
        print("Error obtaining access-token:", response.text)

    return access_token
