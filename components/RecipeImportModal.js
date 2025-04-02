// RecipeImportModal.js
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import RecipeScraper from './RecipeScraper';

const RecipeImportModal = ({ visible, onClose, onImport }) => {
  const [url, setUrl] = useState('');
  const [scrapedRecipe, setScrapedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ersetze "localhost" oder "192.168.x.x" je nach deinem Setup.
      const response = await fetch('http://192.168.1.10:5004/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeUrl: url })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setScrapedRecipe(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (scrapedRecipe && scrapedRecipe.ingredients) {
      onImport(scrapedRecipe.ingredients);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.header}>Rezept importieren</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="Rezept-URL eingeben"
          autoCapitalize="none"
        />
        <Button title="Rezept scrapen" onPress={handleScrape} />
        {loading && <Text>Lade...</Text>}
        {error && <Text style={styles.error}>Fehler: {error}</Text>}
        {scrapedRecipe && (
          <View style={styles.recipePreview}>
            <Text style={styles.recipeTitle}>{scrapedRecipe.title}</Text>
            <Text>Gesamtzeit: {scrapedRecipe.total_time} Minuten</Text>
            <Text>Portionen: {scrapedRecipe.yields}</Text>
            <Text>Zutaten:</Text>
            {scrapedRecipe.ingredients.map((ing, idx) => (
              <Text key={idx}>- {ing}</Text>
            ))}
          </View>
        )}
        <Button title="Importieren" onPress={handleImport} disabled={!scrapedRecipe} />
        <Button title="Schließen" onPress={onClose} color="red" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 4 },
  error: { color: 'red', marginVertical: 10 },
  recipePreview: { marginVertical: 20 },
  recipeTitle: { fontSize: 20, fontWeight: 'bold' }
});

export default RecipeImportModal;
