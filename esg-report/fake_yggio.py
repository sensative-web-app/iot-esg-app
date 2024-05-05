#!/usr/bin/env python3

import sys, json
from wsgiref import simple_server


def app(environ, respond):
    path = environ["PATH_INFO"]
    if path == "/auth/local":
        respond("200 OK", [("Content-Type", "application/json")])
        body = {"token": "fake-token"}
        return [json.dumps(body).encode("utf-8")]
    elif path == "/reports/report-bases":
        respond("200 OK", [("Content-Type", "application/json")])
        body = []
        return [json.dumps(body).encode("utf-8")]
    elif length := environ.get("CONTENT_LENGTH"):
        post_data = environ["wsgi.input"].read(int(length))
        print(post_data)
        respond("200 OK", [("Content-Type", "application/json")])
        body = {}
        return [json.dumps(body).encode("utf-8")]
    else:
        respond("404 Not Found", [("Content-Type", "text/plain")])
        return [b"404 Not Found"]


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    httpd = simple_server.make_server("", port, app)
    print(f"Serving on port {port}.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()
