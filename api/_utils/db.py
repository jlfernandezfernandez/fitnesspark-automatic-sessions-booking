import json
import os
import psycopg2
import logging


def create_db_connection():
    try:
        connection = psycopg2.connect(
            os.environ.get("POSTGRES_URL"), options="-c client_encoding=UTF8"
        )
        return connection
    except Exception as e:
        logging.error(f"Error creating database connection: {e}")
        raise e


def fetch_reservations(connection):
    query = """
        SELECT reservations.*, users.fitnesspark_email, users.fitnesspark_password 
        FROM reservations
        JOIN users ON reservations.user_id = users.user_id
        WHERE users.is_active = TRUE 
          AND users.is_linked_with_fitnesspark = TRUE
          AND reservations.is_active = TRUE
    """
    try:
        with connection.cursor() as cursor:
            cursor.execute(query)
            records = cursor.fetchall()
            col_names = [desc[0] for desc in cursor.description]
        return col_names, records
    except Exception as e:
        logging.error(f"Error fetching reservations: {e}")
        return [], []


def is_already_booked(reservation_id, week_start_date, connection):
    query = """
        SELECT 1 FROM weekly_bookings 
        WHERE reservation_id = %s AND week_start_date = %s
    """
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, (reservation_id, week_start_date))
            result = cursor.fetchone()
        return bool(result)
    except Exception as e:
        logging.error(f"Error checking booking: {e}")
        return False


def mark_as_booked(
    reservation_id, user_id, week_start_date, connection, session_datetime
):
    query = """
        INSERT INTO weekly_bookings (user_id, reservation_id, week_start_date, booking_date, session_datetime)
        VALUES (%s, %s, %s, NOW(), %s)
    """
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                query, (user_id, reservation_id, week_start_date, session_datetime)
            )
        connection.commit()
    except Exception as e:
        logging.error(f"Error marking as booked: {e}")
        connection.rollback()


def log_failed_reservation(reservation, connection):
    query = """
        INSERT INTO failed_reservations (user_id, reservation_id, date_of_failure, error_message, session_activity, session_time, session_datetime)
        VALUES (%s, %s, NOW(), %s, %s, %s, %s)
    """
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                query,
                (
                    reservation["userId"],
                    reservation["id"],
                    json.dumps(reservation.get("error_message"), ensure_ascii=False),
                    reservation["activity"],
                    reservation["time"],
                    reservation["session_datetime"],
                ),
            )
        connection.commit()
    except Exception as e:
        logging.error(f"Error logging failed reservation: {e}")
        connection.rollback()
