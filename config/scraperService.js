// config/scraperService.js
import { SCRAPER_API_URL } from './constants';

export async function fetchRecipe(recipeUrl) {
    console.log(`Sending request to: ${SCRAPER_API_URL} with URL: ${recipeUrl}`); // Logging hinzugefügt
    try {
        // Stelle sicher, dass die URL nicht leer ist
        if (!recipeUrl || typeof recipeUrl !== 'string' || recipeUrl.trim() === '') {
            throw new Error("Recipe URL is invalid or empty.");
        }

        const response = await fetch(SCRAPER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Ggf. weitere Header hinzufügen, falls dein Backend das erfordert (z.B. API-Key)
            },
            body: JSON.stringify({ recipeUrl: recipeUrl.trim() }) // Trimmen der URL
        });

        // Detailliertere Fehlerprüfung
        if (!response.ok) {
            let errorMessage = `HTTP error! Status: ${response.status}`;
            try {
                const errorBody = await response.json(); // Versuche, JSON-Fehlerdetails zu lesen
                errorMessage += ` - ${errorBody.message || JSON.stringify(errorBody)}`;
            } catch (e) {
                // Falls der Body kein JSON ist oder leer ist
                errorMessage += ` - ${response.statusText || 'Server returned an error'}`;
            }
            console.error("API Response Error:", errorMessage); // Logge den detaillierten Fehler
            throw new Error(errorMessage);
        }

        // Nur wenn die Antwort erfolgreich war (Status 2xx), parse JSON
        const data = await response.json();
        console.log("API Response Success:", data); // Logge die erfolgreiche Antwort
        return data;

    } catch (error) {
        // Logge den finalen Fehler, der entweder vom Fetch oder der Fehlerprüfung kommt
        console.error("Error fetching recipe:", error.message);
        // Werfe den Fehler weiter, damit er im UI behandelt werden kann
        throw error;
    }
}