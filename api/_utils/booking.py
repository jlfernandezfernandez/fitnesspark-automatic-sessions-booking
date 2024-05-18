import datetime
import yaml

from api._utils.virtual_gym.client import login
from api._utils.sessions.client import get_sessions, book_session

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


def get_session_to_book(sessions, activity, time):
    for session in sessions:
        if session["time"] == time:
            if session["activity"]["name"] == activity:
                return (activity, time, session["id"])


def book(key, email, activity, time):
    cookies = login(key)
    sessions = get_sessions(cookies)
    session_info = get_session_to_book(sessions, activity, time)

    if session_info:
        session_name, session_hour, session_id = session_info
        print(f"Reservando sesión {session_name} a las {session_hour} para {email}")
        book_session(cookies, session_id)
    else:
        print(f"No se ha encontrado ninguna sesión para {email}")


def __main__():
    book("*****", "jordi.ff97@gmail.com", "BODY COMBAT", "19:00")


if __name__ == "__main__":
    __main__()
