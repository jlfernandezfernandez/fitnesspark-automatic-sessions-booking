import os
import psycopg2
import base64
from http.server import BaseHTTPRequestHandler
from datetime import datetime, timedelta
from api._utils.booking_service import book
import logging

logging.basicConfig(level=logging.INFO)


class handler(BaseHTTPRequestHandler):
    valid_days = {"mon", "tue", "wed", "thu", "fri"}

    def do_GET(self):
        logging.info("Handling GET request")
        weekday = self.calculate_target_weekday(5)
        logging.info(f"Calculated weekday: {weekday}")

        if weekday not in self.valid_days:
            logging.warning(f"Weekday {weekday} not in valid days")
            self.send_no_bookings_response()
            return

        col_names, records = self.fetch_reservations(weekday)
        if records:
            logging.info(f"Found {len(records)} reservations")
            formatted_data = self.format_reservations(col_names, records)
            logging.info(
                f"Formatted data ready for booking: {formatted_data}"
            )  # Log de toda la lista formatted_data
            for reservation in formatted_data:
                logging.info(
                    f"Processing reservation for {reservation['fitnesspark_email']} - Activity: {reservation['activity']} at {reservation['time']}"
                )
                self.book_reservation(reservation)
        else:
            logging.info("No reservations found")
        self.send_success_response()

    def calculate_target_weekday(self, days_ahead):
        target_date = datetime.now() + timedelta(days=days_ahead)
        weekday = target_date.strftime("%a").lower()
        logging.debug(f"Target date: {target_date}, Weekday: {weekday}")
        return weekday

    def fetch_reservations(self, weekday):
        logging.info(f"Fetching reservations for weekday: {weekday}")
        connection = self.create_db_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT reservations.*, users.fitnesspark_email, users.fitnesspark_password FROM reservations
                JOIN users ON reservations.user_id = users.user_id
                WHERE users.is_active = TRUE AND users.is_linked_with_fitnesspark = TRUE
                AND reservations.is_active = TRUE AND reservations.day_of_week = %s
                """,
                (weekday,),
            )
            records = cursor.fetchall()
            if cursor.description:
                col_names = [desc[0] for desc in cursor.description]
            else:
                col_names = []
            logging.info(f"Fetched {len(records)} records")
        connection.close()
        return col_names, records

    def create_db_connection(self):
        logging.info("Creating database connection")
        return psycopg2.connect(os.environ.get("POSTGRES_URL"))

    def format_reservations(self, col_names, records):
        logging.info("Formatting reservations")
        formatted_data = [
            {
                "userId": record["user_id"],
                "fitnesspark_email": record["fitnesspark_email"],
                "key": self.encode_base64(
                    f"{record['fitnesspark_email']}:{self.decode_base64(record['fitnesspark_password'])}"
                ),
                "activity": record["activity"],
                "time": record["time"].strftime("%H:%M"),
            }
            for record in [dict(zip(col_names, row)) for row in records]
        ]
        logging.info(f"Formatted {len(formatted_data)} reservations")
        return formatted_data

    def encode_base64(self, data):
        return base64.b64encode(data.encode("utf-8")).decode("utf-8")

    def decode_base64(self, data):
        return base64.b64decode(data).decode("utf-8")

    def book_reservation(self, reservation):
        logging.info(
            f"Booking reservation for {reservation['fitnesspark_email']} - Activity: {reservation['activity']} at {reservation['time']}"
        )
        book(
            reservation["key"],
            reservation["fitnesspark_email"],
            reservation["activity"],
            reservation["time"],
        )

    def send_no_bookings_response(self):
        logging.info("Sending no bookings response")
        self.send_response(204)
        self.end_headers()

    def send_success_response(self):
        logging.info("Sending success response")
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
