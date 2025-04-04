// components/RecipeImportModal.js
import React, { useState, useCallback } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { fetchRecipe } from '../config/scraperService'; // Importiere den Service
import { colors } from '../styles'; // Optional: Nutze zentrale Farben

const RecipeImportModal = ({ visible, onClose, onImport }) => {
  const [url, setUrl] = useState('');
  const [scrapedRecipe, setScrapedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScrape = useCallback(async () => {
    if (!url || url.trim() === '') {
        Alert.alert('Fehler', 'Bitte gib eine gültige URL ein.');
        return;
    }
    setLoading(true);
    setError(null);
    setScrapedRecipe(null); // Reset bei neuem Scrape
    try {
      const data = await fetchRecipe(url); // Nutze den Service
      // Prüfe, ob die erwarteten Daten (z.B. ingredients) vorhanden sind
      if (data && data.ingredients && Array.isArray(data.ingredients)) {
           setScrapedRecipe(data); // Speichere das ganze Objekt
      } else {
           throw new Error("Keine gültigen Zutaten im Rezept gefunden.");
      }
    } catch (err) {
        // Zeige den Fehler aus fetchRecipe oder den eigenen Fehler an
        setError(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
        Alert.alert('Fehler beim Scrapen', err.message || 'Konnte das Rezept nicht laden.');
    } finally {
      setLoading(false);
    }
  }, [url]); // Abhängigkeit von url

  const handleImport = useCallback(() => {
    // Stelle sicher, dass ein Rezept geladen ist und Zutaten vorhanden sind
    if (scrapedRecipe && scrapedRecipe.ingredients && scrapedRecipe.ingredients.length > 0) {
      // Extrahiere nur die Namen oder die relevanten Daten der Zutaten
      // Annahme: scraperService liefert ein Array von Strings oder Objekten mit 'name'
      const ingredientsToImport = scrapedRecipe.ingredients.map(ing =>
          typeof ing === 'string' ? ing : ing.name // Extrahiere Namen, falls Objekte
      ).filter(name => name && name.trim() !== ''); // Filter leere Einträge

      if(ingredientsToImport.length > 0) {
           onImport(ingredientsToImport); // Übergebe Array von Namen an App.js
           handleClose(); // Schließe Modal nach Import
      } else {
          Alert.alert('Importfehler', 'Keine gültigen Zutaten zum Importieren gefunden.');
      }
    } else {
        Alert.alert('Importfehler', 'Kein Rezept oder keine Zutaten zum Importieren vorhanden.');
    }
  }, [scrapedRecipe, onImport]); // Abhängigkeiten

  // Funktion zum Schließen und Zurücksetzen des Zustands
  const handleClose = () => {
      setUrl('');
      setScrapedRecipe(null);
      setLoading(false);
      setError(null);
      onClose(); // Rufe die übergebene onClose-Funktion auf
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={modalStyles.safeArea}>
         <ScrollView contentContainerStyle={modalStyles.container}>
            <Text style={modalStyles.header}>Rezept importieren</Text>

            <TextInput
                style={modalStyles.input}
                value={url}
                onChangeText={setUrl}
                placeholder="Rezept-URL eingeben (z.B. von Chefkoch)"
                autoCapitalize="none"
                keyboardType="url"
                clearButtonMode="while-editing" // Fügt 'x'-Button hinzu (iOS)
            />

            <View style={modalStyles.buttonContainer}>
                <Button title="Rezept analysieren" onPress={handleScrape} disabled={loading} />
            </View>

            {loading && <ActivityIndicator size="large" color={colors.primary} style={modalStyles.loader} />}

            {error && <Text style={modalStyles.error}>Fehler: {error}</Text>}

            {scrapedRecipe && (
                <View style={modalStyles.recipePreview}>
                    <Text style={modalStyles.recipeTitle}>{scrapedRecipe.title || 'Rezept ohne Titel'}</Text>
                    {/* Optional: Weitere Infos anzeigen */}
                    {scrapedRecipe.total_time && <Text>Zeit: {scrapedRecipe.total_time}</Text>}
                    {scrapedRecipe.yields && <Text>Portionen: {scrapedRecipe.yields}</Text>}

                    <Text style={modalStyles.ingredientsHeader}>Gefundene Zutaten:</Text>
                    {scrapedRecipe.ingredients.map((ing, idx) => (
                        <Text key={idx} style={modalStyles.ingredientItem}>
                            - {typeof ing === 'string' ? ing : ing.name}
                        </Text>
                    ))}
                </View>
            )}

            <View style={modalStyles.buttonContainer}>
                <Button
                    title="Zutaten zur Liste hinzufügen"
                    onPress={handleImport}
                    disabled={!scrapedRecipe || loading} // Deaktivieren, wenn kein Rezept oder am Laden
                />
            </View>

             <View style={modalStyles.buttonContainer}>
                <Button title="Schließen" onPress={handleClose} color={colors.red} />
            </View>
          </ScrollView>
      </View>
    </Modal>
  );
};

// Styles spezifisch für dieses Modal (unverändert)
const modalStyles = StyleSheet.create({
  safeArea: {
     flex: 1,
     paddingTop: 50,
     backgroundColor: colors.white,
  },
  container: {
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.black,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
      marginVertical: 10,
  },
  loader: {
      marginVertical: 20,
  },
  error: {
    color: colors.red,
    marginVertical: 15,
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  recipePreview: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.black,
  },
  ingredientsHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 15,
      marginBottom: 5,
      color: colors.black,
  },
  ingredientItem: {
      fontSize: 15,
      marginLeft: 10,
      color: colors.black,
      marginBottom: 3,
  }
});

export default RecipeImportModal;