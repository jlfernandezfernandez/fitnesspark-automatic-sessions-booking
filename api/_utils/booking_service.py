from api._utils.virtual_gym.client import login
from api._utils.sessions.client import get_sessions, book_session
import logging
from datetime import datetime

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
            session_datetime = datetime.fromtimestamp(session["timestamp"]).isoformat()
            return {
                "id": session["id"],
                "session_datetime": session_datetime,
                "isBooked": session["isBooked"],
                "isFull": session["isFull"],
                "remainingPlace": session["remainingPlace"],
            }
    return None


def can_book_session(session):
    if not session:
        return False, "No se ha encontrado ninguna sesión para reservar."
    if session["isBooked"]:
        return (
            True,
            None,
        )  # Si ya está reservado, podemos considerar que la sesión está reservada
    if session["isFull"]:
        return False, "La sesión está completa."
    if session["remainingPlace"] <= 8:
        return False, "No hay suficientes plazas libres."

    session_date = datetime.fromisoformat(session["session_datetime"]).date()
    today = datetime.now().date()
    if (session_date - today).days > 5:
        return False, "No se puede reservar con más de 5 días de antelación."

    return True, None


def book(key, email, activity, time, day_of_week):
    cookies = login(key)
    sessions = get_sessions(cookies)
    if "error" in sessions:
        return sessions["error"]  # Return the error message

    session_info = get_session_to_book(sessions, activity, time, day_of_week)
    if session_info:
        can_book, error_message = can_book_session(session_info)
        if can_book:
            if not session_info["isBooked"]:
                session_id = session_info["id"]
                logging.info(f"Reservando sesión {activity} a las {time} para {email}")
                response = book_session(cookies, session_id)
                if "error" in response:
                    return response  # Return the error message
            return session_info  # Success, return session info
        else:
            logging.error(error_message)
            return error_message
    else:
        error_message = f"No se ha encontrado ninguna sesión para {email}"
        logging.error(error_message)
        return error_message


def book_reservation(reservation):
    logging.info(
        f"Booking reservation for {reservation['fitnesspark_email']} - Activity: {reservation['activity']} at {reservation['time']} on {reservation['day_of_week']}"
    )
    try:
        response = book(
            reservation["key"],
            reservation["fitnesspark_email"],
            reservation["activity"],
            reservation["time"],
            reservation["day_of_week"],
        )
        if isinstance(response, dict):
            reservation["session_datetime"] = response["session_datetime"]
            reservation["isBooked"] = response["isBooked"]
            reservation["isFull"] = response["isFull"]
            reservation["remainingPlace"] = response["remainingPlace"]
            return True
        else:
            reservation["error_message"] = {
                "message": response
            }  # Save the error message as a dict
            return False
    except Exception as e:
        logging.error(f"Error booking reservation: {e}")
        reservation["error_message"] = {"message": str(e)}
        return False
