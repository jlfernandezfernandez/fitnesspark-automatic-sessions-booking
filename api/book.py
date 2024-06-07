import os
import psycopg2
import base64
import json
from http.server import BaseHTTPRequestHandler
from datetime import datetime, timedelta
from api._utils.booking_service import book
import logging

logging.basicConfig(level=logging.INFO)


class handler(BaseHTTPRequestHandler):
    valid_days = {"mon", "tue", "wed", "thu", "fri"}

    def do_GET(self):
        logging.info("Handling GET request")
        week_start_date = self.get_week_start_date()
        logging.info(f"Week start date: {week_start_date}")

        connection = self.create_db_connection()
        try:
            col_names, records = self.fetch_reservations(connection)
            if records:
                logging.info(f"Found {len(records)} reservations")
                formatted_data = self.format_reservations(col_names, records)
                to_mark_as_booked = []
                to_log_failed = []

                for reservation in formatted_data:
                    if not self.is_already_booked(
                        reservation["id"], week_start_date, connection
                    ):
                        logging.info(
                            f"Processing reservation for {reservation['fitnesspark_email']} - Activity: {reservation['activity']} at {reservation['time']} on {reservation['day_of_week']}"
                        )
                        success = self.book_reservation(reservation)
                        if success:
                            to_mark_as_booked.append(
                                (
                                    reservation["id"],
                                    reservation["userId"],
                                    week_start_date,
                                )
                            )
                        else:
                            if self.handle_failed_reservation(
                                reservation, week_start_date, to_mark_as_booked
                            ):
                                to_mark_as_booked.append(
                                    (
                                        reservation["id"],
                                        reservation["userId"],
                                        week_start_date,
                                    )
                                )
                            else:
                                to_log_failed.append(reservation)

                self.batch_mark_as_booked(to_mark_as_booked, connection)
                self.batch_log_failed_reservations(to_log_failed, connection)
            else:
                logging.info("No reservations found")
            self.send_success_response()
        finally:
            connection.close()

    def get_week_start_date(self):
        today = datetime.now()
        start = today - timedelta(days=today.weekday())  # Lunes de la semana actual
        return start.date()

    def fetch_reservations(self, connection):
        logging.info("Fetching reservations")
        query = """
            SELECT reservations.*, users.fitnesspark_email, users.fitnesspark_password 
            FROM reservations
            JOIN users ON reservations.user_id = users.user_id
            WHERE users.is_active = TRUE 
              AND users.is_linked_with_fitnesspark = TRUE
              AND reservations.is_active = TRUE
        """
        return self.execute_query(connection, query)

    def execute_query(self, connection, query, params=None):
        try:
            with connection.cursor() as cursor:
                cursor.execute(query, params)
                records = cursor.fetchall()
                col_names = [desc[0] for desc in cursor.description]
        except Exception as e:
            logging.error(f"Error executing query: {e}")
            records = []
            col_names = []
        return col_names, records

    def create_db_connection(self):
        logging.info("Creating database connection")
        return psycopg2.connect(os.environ.get("POSTGRES_URL"))

    def format_reservations(self, col_names, records):
        logging.info("Formatting reservations")
        formatted_data = [
            {
                "id": record["id"],
                "userId": record["user_id"],
                "fitnesspark_email": record["fitnesspark_email"],
                "key": self.encode_base64(
                    f"{record['fitnesspark_email']}:{self.decode_base64(record['fitnesspark_password'])}"
                ),
                "activity": record["activity"],
                "time": record["time"],
                "day_of_week": record["day_of_week"],
            }
            for record in [dict(zip(col_names, row)) for row in records]
        ]
        logging.info(f"Formatted {len(formatted_data)} reservations")
        return formatted_data

    def encode_base64(self, data):
        return base64.b64encode(data.encode("utf-8")).decode("utf-8")

    def decode_base64(self, data):
        return base64.b64decode(data).decode("utf-8")

    def is_already_booked(self, reservation_id, week_start_date, connection):
        logging.info(
            f"Checking if reservation {reservation_id} is already booked for the week starting on {week_start_date}"
        )
        query = """
            SELECT 1 FROM weekly_bookings 
            WHERE reservation_id = %s AND week_start_date = %s
        """
        _, result = self.execute_query(
            connection, query, (reservation_id, week_start_date)
        )
        return bool(result)

    def batch_mark_as_booked(self, reservations, connection):
        logging.info(f"Marking {len(reservations)} reservations as booked")
        if not reservations:
            return
        query = """
            INSERT INTO weekly_bookings (user_id, reservation_id, week_start_date)
            VALUES %s
        """
        data = ", ".join(
            connection.cursor().mogrify("(%s,%s,%s)", res).decode("utf-8")
            for res in reservations
        )
        self.execute_query(connection, query % data)

    def batch_log_failed_reservations(self, reservations, connection):
        logging.info(f"Logging {len(reservations)} failed reservations")
        if not reservations:
            return
        query = """
            INSERT INTO failed_reservations (user_id, reservation_id, date_of_failure, error_message, session_activity, session_time)
            VALUES %s
        """
        data = ", ".join(
            connection.cursor()
            .mogrify(
                "(%s,%s,%s,%s,%s,%s)",
                (
                    res["userId"],
                    res["id"],
                    datetime.now(),
                    json.dumps(res.get("error_message")),
                    res["activity"],
                    res["time"],
                ),
            )
            .decode("utf-8")
            for res in reservations
        )
        self.execute_query(connection, query % data)

    def handle_failed_reservation(
        self, reservation, week_start_date, to_mark_as_booked
    ):
        error_message = reservation.get("error_message")
        if (
            error_message
            and error_message.get("status_code") == 400
            and "Ya estás inscrito a esta clase." in error_message.get("message", "")
        ):
            logging.info(
                f"Reservation already booked for {reservation['fitnesspark_email']} - Activity: {reservation['activity']} at {reservation['time']} on {reservation['day_of_week']}. Marking as booked."
            )
            to_mark_as_booked.append(
                (reservation["id"], reservation["userId"], week_start_date)
            )
            return True
        return False

    def book_reservation(self, reservation):
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
            if response is not None:
                reservation["error_message"] = (
                    response  # Save the error message if there is one
                )
                return False
            return True
        except Exception as e:
            logging.error(f"Error booking reservation: {e}")
            reservation["error_message"] = str(e)
            return False

    def send_no_bookings_response(self):
        logging.info("Sending no bookings response")
        self.send_response(204)
        self.end_headers()

    def send_success_response(self):
        logging.info("Sending success response")
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
