from api._utils.virtual_gym.client import login
from api._utils.sessions.client import get_sessions, book_session


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
