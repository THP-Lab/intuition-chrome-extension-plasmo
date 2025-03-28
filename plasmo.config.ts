import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],

  css: ["./src/styles/global.css"],

  run_at: "document_end"
}
