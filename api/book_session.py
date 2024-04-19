import os
from infrastructure.mobile_api.client import login


def book_session():
    username = os.environ.get("USERNAME") or "default"
    password = os.environ.get("PASSWORD") or "default"

    access_token = login(username, password)

    if access_token:
        print(f"Token de acceso obtenido correctamente: {access_token}")
    else:
        print(
            "No se pudo obtener el token de acceso. La reserva de sesión no se ha realizado."
        )


if __name__ == "__main__":
    book_session()
