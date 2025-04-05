# main.py (oder recipe_scraper.py)

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from recipe_scrapers import scrape_me
import requests # NEU: Importieren
import json

from fastapi.middleware.cors import CORSMiddleware

class RecipeURL(BaseModel):
    recipeUrl: HttpUrl

app = FastAPI()

# CORS Middleware (bleibt wichtig)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

# === NEUE /scrape Funktion ===
@app.post("/scrape")
async def scrape_recipe_data(url_data: RecipeURL):
    recipe_url = str(url_data.recipeUrl)
    print(f"Received request to scrape URL: {recipe_url}")

    # Definiere einen realistischen Browser User-Agent
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
        # Du kannst hier auch andere User-Agents testen, falls dieser nicht geht
    }

    try:
        # Schritt 1: HTML mit requests und Header herunterladen
        print(f"Fetching HTML for {recipe_url} with User-Agent...")
        response = requests.get(recipe_url, headers=headers, timeout=10) # Timeout hinzufügen
        response.raise_for_status() # Wirft einen Fehler bei HTTP-Fehlern (wie 403, 404, 500 etc.)

        html_content = response.text
        print(f"Successfully fetched HTML (length: {len(html_content)}).")

        # Schritt 2: Heruntergeladenen HTML-Inhalt an recipe-scrapers übergeben
        # Wir übergeben die URL weiterhin, damit der richtige Parser gewählt wird,
        # und den HTML-Inhalt über das 'html'-Argument (falls unterstützt)
        # oder wir initialisieren direkt die Klasse (robuster)
        # Da scrape_me(html=...) nicht offiziell dokumentiert ist, versuchen wir es nicht.
        # Stattdessen verwenden wir scrape_me nur, um den Scraper zu initialisieren
        # und geben ihm dann den HTML-Inhalt über eine interne Methode (falls verfügbar)
        # oder wir parsen direkt, was scrape_me unterstützt.
        # Der Standardweg ist, dass scrape_me die URL selbst holt.
        # Wir versuchen, die interne Session zu beeinflussen oder gehen einen anderen Weg.

        # Korrektur: scrape_me holt normalerweise selbst. Um Header zu setzen,
        # müssen wir es anders machen. Wir lassen scrape_me die URL,
        # aber konfigurieren die zugrundeliegende requests Session, falls möglich,
        # oder parsen manuell, was aber die Bibliothek umgeht.

        # EINFACHERER VERSUCH: Manche Versionen von recipe-scrapers
        # erlauben das Setzen via Klassen-Attribut *vor* dem Scrapen.
        # Dies ist aber nicht offiziell dokumentiert und kann brechen.
        # from recipe_scrapers import settings
        # settings.HEADERS = headers # VERSUCH (nicht empfohlen, da undokumentiert)

        # STANDARDWEG (ohne Header-Anpassung für recipe-scrapers direkt):
        # Wir belassen es erstmal dabei, dass scrape_me die URL selbst holt,
        # und sehen, ob die Bibliothek vielleicht intern schon einen besseren User-Agent nutzt
        # oder ob der Fehler woanders lag. Wenn 403 weiterhin kommt, IST das Setzen
        # von Headern mit dieser Bibliothek komplexer.

        # Da wir im vorherigen Schritt 403 bekamen, versuchen wir jetzt doch den
        # undokumentierten Weg über settings, auch wenn er brechen könnte.
        # Alternative wäre, auf eine andere Bibliothek oder manuelle requests auszuweichen.

        try:
             from recipe_scrapers import settings
             settings.HEADERS = headers
             print("Attempting to set HEADERS via recipe_scrapers.settings")
        except ImportError:
             print("Could not import settings from recipe_scrapers to set HEADERS.")
        except AttributeError:
             print("recipe_scrapers.settings does not have HEADERS attribute.")


        print(f"Scraping {recipe_url} using recipe-scrapers...")
        # Scraper initialisieren (holt URL jetzt hoffentlich mit gesetztem Header)
        scraper = scrape_me(recipe_url) # wild_mode entfernt

        title = scraper.title()
        ingredients = scraper.ingredients()
        total_time = scraper.total_time()
        yields = scraper.yields()

        # Setze Header zurück, um andere Anfragen nicht zu beeinflussen (falls settings funktioniert hat)
        try:
            from recipe_scrapers import settings
            settings.HEADERS = None
        except (ImportError, AttributeError):
            pass


        print(f"Successfully scraped: {title}")

        return {
            "title": title,
            "ingredients": ingredients,
            "total_time": total_time,
            "yields": yields
        }

    except requests.exceptions.RequestException as e:
        # Fehler beim Herunterladen der Seite mit requests
        print(f"Error fetching URL {recipe_url} with requests: {e}")
        raise HTTPException(status_code=503, detail=f"Could not fetch recipe page: {str(e)}") # Service Unavailable
    except Exception as e:
        # Fehler beim Scrapen mit recipe-scrapers oder anderer Fehler
        print(f"Error scraping URL {recipe_url}: {e}")
        # Gib den Fehler zurück, den recipe-scrapers oder requests geworfen hat
        # Wenn es ein HTTPError von requests war, ist der Statuscode schon drin
        status_code = e.response.status_code if hasattr(e, 'response') else 500
        raise HTTPException(status_code=status_code, detail=f"Could not scrape recipe: {str(e)}")

# Optional: Test-Endpunkt
@app.get("/")
def read_root():
    return {"Status": "Recipe Scraper API is running!"}

# --- Starten mit: uvicorn main:app --reload --port 5000 ---