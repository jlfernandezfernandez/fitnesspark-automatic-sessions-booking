import os
from http.server import BaseHTTPRequestHandler
from booking import book


class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        users = os.environ.get("USERS")
        if users:
            users_split = users.split(",")
            for user in users_split:
                user_split = user.split(":")
                name = user_split[0]
                key = user_split[1]
                book(key, name)

        self.send_response(200)
        return
