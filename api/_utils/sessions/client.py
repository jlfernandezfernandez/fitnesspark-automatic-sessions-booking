import datetime
import json
import requests

headers = {
    "authority": "adherent.fitnesspark.es",
    "accept": "*/*",
    "accept-language": "es-ES,es;q=0.9,en;q=0.8",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "origin": "https://adherent.fitnesspark.es",
    "referer": "https://adherent.fitnesspark.es/",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
}


def format_date_for_payload() -> str:
    current_date = datetime.datetime.now()
    desired_date = current_date + datetime.timedelta(days=(7 - current_date.weekday()))
    return desired_date.strftime("%a %b %d %Y %H:%M:%S GMT%z")


def get_sessions(cookies):
    url = "https://adherent.fitnesspark.es/ajax/sessions"
    payload = f"week={format_date_for_payload()}"
    response = requests.request(
        "POST", url, data=payload, headers=headers, timeout=5, cookies=cookies
    )
    if response.ok:
        json_response = json.loads(response.text)
        return json_response["sessions"]
    else:
        error_message = {
            "status_code": response.status_code,
            "message": response.json().get("message", "Unknown error"),
            "context": "al obtener sesiones",
        }
        return {"error": error_message}


def book_session(cookies, session_id):
    url = f"https://adherent.fitnesspark.es/ajax/book/session/{session_id}"
    response = requests.request(
        "POST", url, headers=headers, timeout=5, cookies=cookies
    )
    if response.ok:
        return {"success": response.text}
    else:
        error_message = {
            "status_code": response.status_code,
            "message": response.json().get("message", "Unknown error"),
            "context": f"al reservar sesión {session_id}",
        }
        return {"error": error_message}
