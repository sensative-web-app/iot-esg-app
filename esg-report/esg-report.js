import crypto from "node:crypto"
import fs from "node:fs/promises"

const apiUrl = process.env.ESG_REPORT_API_URL ||
      "https://staging.yggio.net/api"

async function main() {
  let username = process.env.ESG_REPORT_USERNAME
  let password = process.env.ESG_REPORT_PASSWORD
  let filename = process.argv[2] ?? process.env.ESG_REPORT_TEMPLATE

  let api = await login(username, password)

  //let fileData = await fs.readFile(filename)
  //console.log(await api.getReportBases())
  //let uploaded = await api.uploadReportTemplate("test.xlsx", fileData)
  //console.log(uploaded)
  //let spec = reportBaseSpec(uploaded.filename)

  let spec = reportBaseSpec("Standard-Connectivity")
  console.log(await api.createReportBase(spec))

  console.log(await api.getReportBases())
}

function reportBaseSpec(filename) {
  return {
    "name": "Not actually connectivity report",  // namn
    "description": "Trying some stuff!", // Beskrivning
    "fileName": filename, // Detta är namnet på filen som är bifogad i detta slack meddelande
    "secondsBetweenPoints": 0, // Hur många sekunder mellan varje tidsserie punkt från varje iotnod, (I detta fall 0 sekunder som betyder _alla_ tidsseriepunkter för varje vald nod)
    "sources": [  // Sources, en lista av olika filtreringar för hur och vad du vill hämta från våra databaser
      {
        "valueFunction": "mean", // en funktion riktad till våran tidsserie databas, `mean` värde för varje tidsseriepunkt i databasen
        "query": "electricityConsumption", // ett query på vilka noder du vill hämta från ditt konto (i detta fallet hämtar vi alla noder som har fältet `rssi`.) (Det är detta queryt som fyller upp `iotnodeRawData` arket)
        "fields": [ // Fields, en lista på fältnamn som du vill hämta från tiddserien. Här bestäms alltså vilka tidsseriefält du vill hämta, medans `query` hämtar alla fält, men bara det senaste värdena
          {
            "name": "electricityConsumption", // namnet på fältet du vill hämta ( i detta fall rssi )
            "prettyName": "electricity Consumption", // Prettyname är till för hur det ska se ut i vårat UI eller excel arken ( här kan stå vad som helst )
            "dataType": "float" // dataType, vilken datatyp är det på fältet, just nu har vi bara stöd för "float"
          },
          { // Samma gäller för snr, vill man lägga till fler går det bra också.
            "name": "snr",
            "prettyName": "SNR",
            "dataType": "float"
          }
        ]
      }
    ]
  }
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
    async getReportBases() {
      return await request("reports/report-bases")
    },
    async createReportBase(data) {
      return await request("reports/report-bases", data)
    },
    async uploadReportTemplate(filename, buffer) {
      const xlsxType = ("application/vnd.openxmlformats-officedocument" +
                        ".spreadsheetml.sheet")
      let formData = encodeFormData(filename, xlsxType, buffer)
      let text = await request("reports/file/upload", formData.body, {
        "Content-Type": formData.contentType,
      })
      let pattern = /File with name "([^"]+)" uploaded successfully/
      return {filename: text.match(pattern)[1]}
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
