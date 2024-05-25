import { encodeFormData } from "./utils";
import fs from "fs/promises"
//import {createWriteStream} from "fs"
//import {Writable} from "stream"

const apiUrl = process.env.NEXT_PUBLIC_YGGIO_API_URL;

export default function createReportApiWrapper(token: string) {
  async function getReportBases() {
    return await request("reports/report-bases")
  }

  async function createReportBase(data: any) {
    return await request("reports/report-bases", data)
  }

  async function deleteReportBase(id: string) {
    let url = "reports/report-bases/" + encodeURIComponent(id)
    return await request(url, undefined, {}, "DELETE")
  }

  async function uploadReportTemplate(filename: string, buffer: Buffer) {
    // Uploading is currently broken due to a confirmed Yggio bug
    // which corrupts the file.
    const xlsxType = ("application/vnd.openxmlformats-officedocument" +
      ".spreadsheetml.sheet")
    let formData = encodeFormData(filename, xlsxType, buffer)
    let text = await request("reports/file/upload", formData.body, {
      "Content-Type": formData.contentType,
    })
    let pattern = /File with name "([^"]+)" uploaded successfully/
    return { filename: text.match(pattern)[1] }
  }

  async function generateReport(reportBaseId: string) {
    let periodDays = 365
    let now = Date.now()
    let requestBody = {
      "startTime": now - periodDays * 24 * 3600 * 1000,
      "endTime": now,
      "includeRawData": true,
      queryParametersInputs: {},
    }
    let url = "reports/report-bases/" +
      encodeURIComponent(reportBaseId) +
      "/generate"
    return await request(url, requestBody)
  }

  async function request(
    path: string,
    data: any = undefined,
    headers = {},
    action: string | null = null,
  ) {
    let response = await fetch(`${apiUrl}/${path}`, {
      method: action ? action
        : data !== undefined ? "POST"
          : "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, */*;q=0.9",
        "Authorization": `Bearer ${token}`,
        ...headers,
      },
      body: data === undefined ? undefined
        : data instanceof Buffer ? data
          : JSON.stringify(data),
    })

    let responseContentType = response.headers.get("Content-Type") ?? ""

    if (response.status >= 400) {
      let body = await response.text()
      throw new Error(`Response status ${response.status}: ${body}`)
    }
    else if (responseContentType.includes("json")) {
      return await response.json()
    }
    else {
      return await response.text()
    }
  }

  return {
    getReportBases,
    createReportBase,
    deleteReportBase,
    uploadReportTemplate,
    generateReport,
  }
}