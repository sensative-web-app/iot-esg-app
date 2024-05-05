import crypto from "node:crypto"
import fs from "node:fs/promises"

const apiUrl = process.env.ESG_REPORT_API_URL ||
      "https://staging.yggio.net/api"

async function main() {
  let username = process.env.ESG_REPORT_USERNAME
  let password = process.env.ESG_REPORT_PASSWORD
  let filename = process.argv[2] ?? process.env.ESG_REPORT_TEMPLATE

  let fileData = await fs.readFile(filename)
  let api = await login(username, password)

  console.log(await api.getReportBases())
  console.log(await api.uploadReportTemplate("test.xlsx", fileData))
}

async function login(username, password) {
  let token = null

  async function request(path, data, headers={}) {
    let response = await fetch(`${apiUrl}/${path}`, {
      method: data === undefined ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, */*;q=0.9",
        "Authorization": token ? `Bearer ${token}` : null,
        ...headers,
      },
      body: data === undefined ? undefined
        : data instanceof Buffer ? data
        : JSON.stringify(data),
    })

    if (response.status >= 400) {
      let body = await response.text()
      throw new Error(`Response status ${response.status}: ${body}`)
    }
    else if (response.headers.get("Content-Type").includes("json")) {
      return await response.json()
    }
    else {
      return await response.text()
    }
  }

  token = (await request("auth/local", {username, password})).token

  return {
    getReportBases: request.bind(null, "reports/report-bases"),
    uploadReportTemplate(filename, buffer) {
      const xlsxType = ("application/vnd.openxmlformats-officedocument" +
                        ".spreadsheetml.sheet")
      let formData = encodeFormData(filename, xlsxType, buffer)
      return request("reports/file/upload", formData.body, {
        "Content-Type": formData.contentType,
      })
    },
  }
}

/**
 * Encode multi-part form data as specified in RFC 7578.
 */
function encodeFormData(filename, contentType, buffer) {
  if (!/^[\w.]+$/.test(filename))
    throw Error(`Bad filename: ${filename}`)

  let boundary
  while (!boundary || buffer.includes(boundary)) {
    boundary = crypto.randomBytes(20).toString("hex")
  }

  let boundaryBuffer = Buffer.concat([
    Buffer.from("--"),
    Buffer.from(boundary)])

  let headerBuffer = Buffer.concat([
    Buffer.from('Content-Disposition: form-data; name="file";' +
                ` filename="${filename}"\r\n`),
    Buffer.from(`Content-Type: ${contentType}\r\n`),
    Buffer.from("\r\n")])

  let body = Buffer.concat([
    boundaryBuffer,
    Buffer.from("\r\n"),
    headerBuffer,
    buffer,
    Buffer.from("\r\n"),
    boundaryBuffer,
    Buffer.from("--\r\n")])

  return {
    contentType: `multipart/form-data; boundary=${boundary}`,
    body,
  }
}

await main()
