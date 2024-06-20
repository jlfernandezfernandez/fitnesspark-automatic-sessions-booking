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
        return True, None
    if session["isFull"]:
        return False, "La sesión está completa."
    if session["remainingPlace"] <= 1:
        return False, "No hay suficientes plazas libres."

    session_date = datetime.fromisoformat(session["session_datetime"]).date()
    today = datetime.now().date()
    if (session_date - today).days > 5:
        return False, "No se puede reservar con más de 5 días de antelación."

    return True, None


def reserve_session(cookies, session_info, email, activity, time):
    session_id = session_info["id"]
    logging.info(f"Reservando sesión {activity} a las {time} para {email}")
    response = book_session(cookies, session_id)
    if "error" in response:
        return "error", response
    return "reserva", session_info


def book(key, email, activity, time, day_of_week):
    try:
        cookies = login(key)
        sessions = get_sessions(cookies)
        if "error" in sessions:
            return "error", sessions["error"]

        session_info = get_session_to_book(sessions, activity, time, day_of_week)
        if not session_info:
            logging.error(f"No se ha encontrado ninguna sesión para {email}")
            return "none", None

        can_book, error_message = can_book_session(session_info)
        if not can_book:
            logging.error(error_message)
            return "error", error_message

        if not session_info["isBooked"]:
            return reserve_session(cookies, session_info, email, activity, time)

        return "reserva", session_info

    except Exception as e:
        logging.error(f"Error booking reservation: {e}")
        return "error", str(e)


def book_reservation(reservation):
    logging.info(
        f"Booking reservation for {reservation['fitnesspark_email']} - Activity: {reservation['activity']} at {reservation['time']} on {reservation['day_of_week']}"
    )
    try:
        status, response = book(
            reservation["key"],
            reservation["fitnesspark_email"],
            reservation["activity"],
            reservation["time"],
            reservation["day_of_week"],
        )
        if status == "reserva" and isinstance(response, dict):
            reservation.update(
                {
                    "session_datetime": response.get("session_datetime"),
                    "isBooked": response.get("isBooked"),
                    "isFull": response.get("isFull"),
                    "remainingPlace": response.get("remainingPlace"),
                }
            )
            return True
        elif status == "error":
            reservation["error_message"] = {"message": response}
            return False
        else:
            logging.info(
                f"No se ha encontrado ninguna sesión para {reservation['fitnesspark_email']}"
            )
            return False

    except Exception as e:
        logging.error(f"Error booking reservation: {e}")
        reservation["error_message"] = {"message": str(e)}
        return False
