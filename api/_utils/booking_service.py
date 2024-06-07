from api._utils.virtual_gym.client import login
from api._utils.sessions.client import get_sessions, book_session

day_mapping = {
    "mon": "lunes",
    "tue": "martes",
    "wed": "miércoles",
    "thu": "jueves",
    "fri": "viernes",
    "sat": "sábado",
    "sun": "domingo",
}


def get_session_to_book(sessions, activity, time, day_of_week):
    day_name = day_mapping.get(day_of_week, "")
    for session in sessions:
        if (
            session["time"] == time
            and session["activity"]["name"] == activity
            and session["startedAt"].split()[0].lower() == day_name
        ):
            return session["id"]
    return None


def book(key, email, activity, time, day_of_week):
    cookies = login(key)
    sessions = get_sessions(cookies)
    if "error" in sessions:
        return sessions["error"]  # Return the error message

    session_id = get_session_to_book(sessions, activity, time, day_of_week)
    if session_id:
        print(f"Reservando sesión {activity} a las {time} para {email}")
        response = book_session(cookies, session_id)
        if "error" in response:
            return response["error"]  # Return the error message
        return None  # Success
    else:
        error_message = f"No se ha encontrado ninguna sesión para {email}"
        print(error_message)
        return error_message
