// utils/ingredientParser.js

// Verbesserte Funktion mit Notiz-Extraktion
export function parseIngredient(ingredientString) {
   if (typeof ingredientString !== 'string' || ingredientString.trim() === '') {
       return null;
   }

   let originalString = ingredientString.trim();
   let name = originalString;
   let menge = 1.0;
   let einheit = 'Stück';
   let note = null; // NEUES Feld für Notizen
   let quantityFound = false;

   // --- 1. Menge extrahieren (wie vorher) ---
   const quantityRegex = /^(?:(\d+[\.,]?\d*)\s*-\s*)?(\d+[\.,]?\d*)\s*(?:⁄|\/)\s*(\d+[\.,]?\d*)|^(?:(\d+[\.,]?\d*)\s*-\s*)?(\d+[\.,]?\d*)/;
   const quantityMatch = name.match(quantityRegex);

   if (quantityMatch) {
       let mengeStr = "";
       if (quantityMatch[3]) { // Fraction
           const whole = parseFloat(quantityMatch[2]?.replace(',', '.')) || 0; // Optional chaining added
           const numerator = parseFloat(quantityMatch[2]?.replace(',', '.'));
           const denominator = parseFloat(quantityMatch[3]?.replace(',', '.'));
           if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
                menge = whole + (numerator / denominator);
                mengeStr = quantityMatch[0].trim();
                quantityFound = true;
           }
       } else if (quantityMatch[5]) { // Simple number or range
            mengeStr = quantityMatch[5].replace(',', '.');
            if (quantityMatch[4]) { // Range
                const rangeEnd = parseFloat(quantityMatch[5].replace(',', '.'));
                if(!isNaN(rangeEnd)) menge = rangeEnd; else menge = 1;
            } else {
                const parsedMenge = parseFloat(mengeStr);
                if (!isNaN(parsedMenge)) menge = parsedMenge; else menge = 1;
            }
            quantityFound = true;
        }
       if (quantityFound) {
           name = name.substring(quantityMatch[0].length).trim();
       } else {
           // Reset if parsing failed strangely
            name = originalString;
            menge = 1.0;
       }
   } else {
      name = originalString;
      menge = 1.0;
   }


   // --- 2. Einheit extrahieren (wie vorher, aus dem verbliebenen 'name') ---
   const units = ['Stück', 'Prise', 'Prisen', 'Bund', 'Pck.', 'Pkg.', 'EL', 'TL', 'ml', 'cl', 'l', 'g', 'kg', 'gr', 'Dose', 'Zehe', 'Zehen', 'Blatt'];
   let unitFound = false;
   for (const u of units) {
       const regexStart = new RegExp(`^(${u})\\.?\\s+(.*)`, 'i');
       const matchStart = name.match(regexStart);
       if (matchStart && matchStart[2]) { // Ensure there's remaining name after unit
           einheit = (matchStart[1].toLowerCase() === 'gr') ? 'g' : matchStart[1];
           name = matchStart[2].trim();
           unitFound = true;
           break;
       }
       const regexEnd = new RegExp(`^(.*?)\\s+${u}\\.?$`, 'i'); // Use ^(.*?) non-greedy start
       const matchEnd = name.match(regexEnd);
        if (!unitFound && matchEnd && matchEnd[1]) {
           einheit = (u.toLowerCase() === 'gr') ? 'g' : u;
           name = matchEnd[1].trim();
           unitFound = true;
           break;
       }
   }
   // If only quantity was found, unit remains 'Stück' unless explicitly parsed


   // --- 3. Notiz extrahieren und Namen bereinigen ---
   // Entferne zuerst Klammern am Ende
   name = name.replace(/\s*\([^)]*\)\s*$/, '').trim();

   // Suche nach dem ersten Komma im verbleibenden Namen
   const commaIndex = name.indexOf(',');
   if (commaIndex > 0) { // Nur wenn Komma nicht am Anfang steht
       const potentialName = name.substring(0, commaIndex).trim();
       const potentialNote = name.substring(commaIndex + 1).trim();
       // Einfache Prüfung: Ist der Teil nach dem Komma kurz oder enthält er typische Verarbeitungs-Keywords?
       // Dies ist eine sehr einfache Heuristik!
       const noteKeywords = ['gehackt', 'gewürfelt', 'frisch', 'klein', 'groß', 'fein', 'grob', 'sehr kräftige']; // Erweiterbar
       if (potentialNote.length < 25 || noteKeywords.some(kw => potentialNote.toLowerCase().includes(kw))) {
           name = potentialName;
           note = potentialNote; // Setze das Notiz-Feld
           console.log(`Extracted Note: '${note}' from Name: '${potentialName}'`);
       }
       // Ansonsten bleibt die Notiz im Namen, um Fehler zu vermeiden
   }

   // Finale Namensformatierung
   if (name) {
       name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
   } else {
       console.warn("Could not extract valid name from:", ingredientString);
       return null; // Ungültig, wenn kein Name übrig bleibt
   }

   console.log(`Parsed '${ingredientString}' -> Name: '${name}', Menge: ${menge}, Einheit: '${einheit}', Note: '${note}'`);
   // Gebe jetzt auch die Notiz zurück
   return { name, menge, einheit, note };
}