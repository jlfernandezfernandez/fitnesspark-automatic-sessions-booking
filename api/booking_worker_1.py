import os
from http.server import BaseHTTPRequestHandler
from api._utils.booking import book


class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        users = os.environ.get("USERS")
        if users:
            users_split = users.split(",")
            for user in users_split:
                user_split = user.split(":")
                name = user_split[0]
                key = user_split[1]
                book(key, name)
        return
