// scraperService.js
export async function fetchRecipe(recipeUrl) {
    try {
        const response = await fetch("YOUR_NGROK_URL/scrape", { //Hier die Ngrok URL einfügen
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ recipeUrl })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching recipe:", error);
        throw error;
    }
}