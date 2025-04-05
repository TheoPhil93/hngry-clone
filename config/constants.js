// config/constants.js

// 1. Starte deinen FastAPI-Server (z.B. auf Port 5000)
// 2. Starte Ngrok: ngrok http 5000
// 3. Kopiere die https://...ngrok.io URL von Ngrok
// 4. Füge sie hier ein und hänge "/scrape" an!

// Beispiel (ersetze dies durch DEINE aktuelle Ngrok URL!):
const NGROK_URL = "https://c332-83-173-211-78.ngrok-free.app"; // Beispiel!

export const SCRAPER_API_URL = `${NGROK_URL}/scrape`;
export const UNDO_TIMEOUT = 5000; // Dein alter Timeout-Wert