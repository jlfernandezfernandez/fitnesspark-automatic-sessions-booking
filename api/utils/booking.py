import datetime
import yaml

from api.utils.virtual_gym.client import login
from api.utils.sessions.client import get_sessions, book_session

days_of_week = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
]


def load_config():
    with open("configmap.yml", "r", encoding="utf-8") as file:
        config = yaml.safe_load(file)
    return config


def get_desired_day():
    current_date = datetime.datetime.now()
    desired_date = current_date + datetime.timedelta(days=5)
    desired_day = desired_date.weekday()

    return days_of_week[desired_day]


def get_session_to_book(sessions, name):
    config = load_config()
    desired_day = get_desired_day()

    if name in config and desired_day in config[name]["reservations"]:
        desired_activity = config[name]["reservations"][desired_day][0]["activity"]
        desired_hour = config[name]["reservations"][desired_day][0]["time"]

        for session in sessions:
            if session["time"] == desired_hour:
                if session["activity"]["name"] == desired_activity:
                    return (desired_activity, desired_hour, session["id"])


def book(key, name):
    cookies = login(key)
    sessions = get_sessions(cookies)
    session_info = get_session_to_book(sessions, name)

    if session_info:
        session_name, session_hour, session_id = session_info
        print(f"Reservando sesión {session_name} a las {session_hour} para {name}")
        book_session(cookies, session_id)
    else:
        print(f"No se ha encontrado ninguna sesión para {name}")


def __main__():
    book("*****", "jordi")


if __name__ == "__main__":
    __main__()
