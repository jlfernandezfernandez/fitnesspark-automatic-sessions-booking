from api._utils.virtual_gym.client import login
from api._utils.sessions.client import get_sessions, book_session

day_mapping = {
    "mon": "Lunes",
    "tue": "Martes",
    "wed": "Miércoles",
    "thu": "Jueves",
    "fri": "Viernes",
    "sat": "Sábado",
    "sun": "Domingo",
}


def get_session_to_book(sessions, activity, time, day_of_week):
    day_name = day_mapping.get(day_of_week, "").lower()
    for session in sessions:
        session_day = (
            session["startedAt"].split()[0].lower()
        )  # Obtener el día de la semana
        print(f"session_day {session_day} and day_name {day_name}")
        if (
            session["time"] == time
            and session["activity"]["name"] == activity
            and session_day == day_name
        ):
            return (activity, time, session["id"])
    return None


def book(key, email, activity, time, day_of_week):
    cookies = login(key)
    sessions = get_sessions(cookies)
    if "error" in sessions:
        return sessions["error"]  # Return the error message

    session_info = get_session_to_book(sessions, activity, time, day_of_week)
    if session_info:
        session_name, session_hour, session_id = session_info
        print(f"Reservando sesión {session_name} a las {session_hour} para {email}")
        response = book_session(cookies, session_id)
        if "error" in response:
            return response["error"]  # Return the error message
        return None  # Success
    else:
        error_message = f"No se ha encontrado ninguna sesión para {email}"
        print(error_message)
        return error_message
