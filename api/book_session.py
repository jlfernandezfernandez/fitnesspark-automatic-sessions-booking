import os
from http.server import BaseHTTPRequestHandler
from infrastructure.mobile_api.client import login


class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        username = os.environ.get("USERNAME") or "default"
        password = os.environ.get("PASSWORD") or "default"

        access_token = login(username, password)

        if access_token:
            print(f"Token de acceso obtenido correctamente: {access_token}")
        else:
            print(
                "No se pudo obtener el token de acceso. La reserva de sesión no se ha realizado."
            )
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        return
