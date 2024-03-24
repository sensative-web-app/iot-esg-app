import { setupServer } from "msw/node"
import { http, HttpResponse } from "msw"

const yggioUrl = process.env.NEXT_PUBLIC_YGGIO_API_URL
const validToken = "valid-token"

const handlers = [
  http.get(`${yggioUrl}/iotnodes/abc123/stats`, ({request}) => {
    // Based on the response for nodeId 60a3ab8b007e8f00076009eb,
    // measurement averageTemperature.
    const data = [
      {
        "mean": 22.5,
        "time": "2024-03-14T14:06:44.896Z",
        "value": 22.5,
      },
      {
        "mean": 22.4,
        "time": "2024-03-14T13:51:44.974Z",
        "value": 22.4,
      },
    ]
    return serveNodeResponseIfAuthorized(request, data)
  }),

  http.get(`${yggioUrl}/iotnodes/def456/stats`, ({request}) => {
    // Based on the actual 404 error response from Yggio.
    const text = "Could not find entity with query { 'orionId.id': 'def456' }"
    return new HttpResponse(text, {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    })
  }),
]

function serveNodeResponseIfAuthorized(request, responseData) {
  switch (request.headers.get("Authorization")) {
  case `Bearer ${validToken}`:
    return HttpResponse.json(responseData)
  default:
    // Based on the actual error response from Yggio.
    return new HttpResponse("Invalid authorization token", {
      status: 422,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    })
  }
}

export const server = setupServer(...handlers)
