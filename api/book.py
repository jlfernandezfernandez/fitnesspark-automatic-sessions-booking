import logging
from http.server import BaseHTTPRequestHandler
from datetime import datetime, timedelta
from api._utils.db import (
    create_db_connection,
    fetch_reservations,
    is_already_booked,
    mark_as_booked,
    log_failed_reservation,
)
from api._utils.booking_service import book_reservation
from api._utils.helpers import encode_base64, decode_base64

logging.basicConfig(level=logging.INFO)


class handler(BaseHTTPRequestHandler):
    valid_days = {"mon", "tue", "wed", "thu", "fri"}

    def do_GET(self):
        logging.info("Handling GET request")
        week_start_date = self.get_week_start_date()
        logging.info(f"Week start date: {week_start_date}")

        connection = create_db_connection()
        try:
            reservations = self.get_reservations(connection)
            if reservations:
                logging.info(f"Found {len(reservations)} reservations")
                self.process_reservations(reservations, week_start_date, connection)
            else:
                logging.info("No reservations found")
            self.send_success_response()
        finally:
            connection.close()

    def get_week_start_date(self):
        today = datetime.now()
        start = today - timedelta(days=today.weekday())  # Monday of the current week
        return start.date()

    def get_reservations(self, connection):
        col_names, records = fetch_reservations(connection)
        return self.format_reservations(col_names, records)

    def format_reservations(self, col_names, records):
        logging.info("Formatting reservations")
        formatted_data = [
            {
                "id": record["id"],
                "userId": record["user_id"],
                "fitnesspark_email": record["fitnesspark_email"],
                "key": encode_base64(
                    f"{record['fitnesspark_email']}:{decode_base64(record['fitnesspark_password'])}"
                ),
                "activity": record["activity"],
                "time": record["time"],
                "day_of_week": record["day_of_week"],
            }
            for record in [dict(zip(col_names, row)) for row in records]
        ]
        logging.info(f"Formatted {len(formatted_data)} reservations")
        return formatted_data

    def process_reservations(self, reservations, week_start_date, connection):
        for reservation in reservations:
            if not is_already_booked(reservation["id"], week_start_date, connection):
                logging.info(
                    f"Processing reservation for {reservation['fitnesspark_email']} - Activity: {reservation['activity']} at {reservation['time']} on {reservation['day_of_week']}"
                )
                self.handle_reservation(reservation, week_start_date, connection)

    def handle_reservation(self, reservation, week_start_date, connection):
        success = book_reservation(reservation)
        if success:
            mark_as_booked(
                reservation["id"],
                reservation["userId"],
                week_start_date,
                connection,
                reservation["session_datetime"],
            )
        elif (
            reservation.get("error_message")
            and reservation["error_message"]["message"]
            != "No se ha encontrado ninguna sesión para reservar."
        ):
            self.handle_failed_booking(reservation, week_start_date, connection)
        else:
            logging.info(
                f"No se ha encontrado ninguna sesión para {reservation['fitnesspark_email']} - Activity: {reservation['activity']} at {reservation['time']} on {reservation['day_of_week']}"
            )

    def handle_failed_booking(self, reservation, week_start_date, connection):
        if self.should_mark_as_booked(reservation):
            mark_as_booked(
                reservation["id"],
                reservation["userId"],
                week_start_date,
                connection,
                reservation["session_datetime"],
            )
        else:
            log_failed_reservation(reservation, connection)

    def should_mark_as_booked(self, reservation):
        error_message = reservation.get("error_message")
        return (
            isinstance(error_message, dict)
            and error_message.get("status_code") == 400
            and "Ya estás inscrito a esta clase." in error_message.get("message", "")
        )

    def send_success_response(self):
        logging.info("Sending success response")
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
