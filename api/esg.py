import sys, os
from io import BytesIO
from hmac import compare_digest
from pathlib import Path
from runpy import run_path

transform_report = run_path(Path(__file__).parent / "../transform_report.py")


def serve_request(input_stream):
    input_buffer = BytesIO(input_stream.read())
    output_buffer = BytesIO()
    transform_report["main"](input_buffer, output_buffer)
    return [output_buffer.getvalue()]


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
