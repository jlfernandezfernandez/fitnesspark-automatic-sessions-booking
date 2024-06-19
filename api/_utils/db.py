import os
import psycopg2
import logging
from datetime import datetime
import json


def create_db_connection():
    logging.info("Creating database connection")
    return psycopg2.connect(os.environ.get("POSTGRES_URL"))


def fetch_reservations(connection):
    logging.info("Fetching reservations")
    query = """
        SELECT reservations.*, users.fitnesspark_email, users.fitnesspark_password 
        FROM reservations
        JOIN users ON reservations.user_id = users.user_id
        WHERE users.is_active = TRUE 
          AND users.is_linked_with_fitnesspark = TRUE
          AND reservations.is_active = TRUE
    """
    return execute_query(connection, query)


def execute_query(connection, query, params=None):
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


def is_already_booked(reservation_id, week_start_date, connection):
    logging.info(
        f"Checking if reservation {reservation_id} is already booked for the week starting on {week_start_date}"
    )
    query = """
        SELECT 1 FROM weekly_bookings 
        WHERE reservation_id = %s AND week_start_date = %s
    """
    _, result = execute_query(connection, query, (reservation_id, week_start_date))
    return bool(result)


def mark_as_booked(reservation_id, user_id, week_start_date, connection):
    logging.info(
        f"Marking reservation {reservation_id} as booked for the week starting on {week_start_date}"
    )
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO weekly_bookings (user_id, reservation_id, week_start_date)
                VALUES (%s, %s, %s)
                """,
                (user_id, reservation_id, week_start_date),
            )
        connection.commit()
    except Exception as e:
        logging.error(f"Error marking reservation as booked: {e}")


def log_failed_reservation(reservation, connection):
    logging.info(
        f"Logging failed reservation for {reservation['fitnesspark_email']} - Activity: {reservation['activity']} at {reservation['time']} on {reservation['day_of_week']}"
    )
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO failed_reservations (user_id, reservation_id, date_of_failure, error_message, session_activity, session_time)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    reservation["userId"],
                    reservation["id"],
                    datetime.now(),
                    json.dumps(reservation.get("error_message")),
                    reservation["activity"],
                    reservation["time"],
                ),
            )
        connection.commit()
    except Exception as e:
        logging.error(f"Error logging failed reservation: {e}")
