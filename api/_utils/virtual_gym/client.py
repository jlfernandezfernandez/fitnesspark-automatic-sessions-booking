from requests_html import HTMLSession


def build_url(key):
    base_url = "https://virtuagym.com/autologin"
    query_params = {
        "redirect": "autologin?member_information_forward=https://adherent.fitnesspark.es/autologin",
        "in_app": "1",
        "key": key,
    }
    url = (
        base_url
        + "?"
        + "&".join([f"{key}={value}" for key, value in query_params.items()])
    )
    return url


def login(key: str) -> dict:
    cookies = {}
    session = HTMLSession()

    url = build_url(key)
    session.get(url)
    cookies = session.cookies.get_dict()

    return cookies
