import sys, os
from hmac import compare_digest


def serve_request(input_stream):
    request_body = input_stream.read()
    print(f"Read {len(request_body)} bytes from request body.")
    return [request_body]


def cli_main():
    # Redirect stdout to stderr and reserve stdout for data.
    out = os.fdopen(os.dup(sys.stdout.fileno()), "wb")
    os.dup2(sys.stderr.fileno(), sys.stdout.fileno())

    input_stream = sys.stdin.detach()

    result = serve_request(input_stream)
    for chunk in result:
        out.write(chunk)


def app(environ, respond):
    def auth_ok():
        secret = os.environ["SECRET_COOKIE_PASSWORD"]
        auth = environ.get("HTTP_AUTHORIZATION") or ""
        if not auth.startswith("Bearer "):
            return False
        request_token = auth.split(None, 1)[1]
        return compare_digest(secret, request_token)

    if auth_ok():
        result = serve_request(environ["wsgi.input"])
        respond("200 OK", [("Content-Type", "text/plain")])
        return result
    else:
        respond("403 Forbidden", [("Content-Type", "text/plain")])
        return [b"403 Forbidden"]


if __name__ == "__main__":
    cli_main()
