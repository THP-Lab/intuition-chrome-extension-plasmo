import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  // Spécifie sur quelles URLs l'extension s'exécute
  matches: ["<all_urls>"],

  // Fichiers CSS à injecter
  css: ["./src/styles/global.css"],

  // Configuration du content script
  run_at: "document_end"
}
