const apiUrl = "https://staging.yggio.net/api"

async function main() {
  let username = process.env.ESG_REPORT_USERNAME
  let password = process.env.ESG_REPORT_PASSWORD

  let api = await login(username, password)

  console.log(await api.getReportBases())
}

async function login(username, password) {
  let token = null

  async function request(path, data, headers={}) {
    let response = await fetch(`${apiUrl}/${path}`, {
      method: data === undefined ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : null,
        ...headers,
      },
      body: data === undefined ? undefined : JSON.stringify(data),
    })

    if (response.status >= 400) {
      let body = await response.text()
      throw new Error(`Response status ${response.status}: ${body}`)
    }
    else {
      return await response.json()
    }
  }

  token = (await request("auth/local", {username, password})).token

  return {
    getReportBases: request.bind(null, "reports/report-bases"),
  }
}

await main()
