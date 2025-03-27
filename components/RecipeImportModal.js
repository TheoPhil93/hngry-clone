import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import cheerio from 'cheerio-without-node-native';

export default function RecipeImportModal({ visible, onClose, onImport }) {
  const [link, setLink] = useState('');

  const extractIngredientsFromHTML = async (html) => {
    const $ = cheerio.load(html);

    const zutaten = [];
    console.log('Chefkoch HTML geladen ✅');

    $('.ds-recipe-ingredients__list-item').each((_, el) => {
        const menge = $(el).find('.ds-quantity').text().trim();
        const name = $(el).find('.ds-ingredient-name').text().trim();
      
        if (name) {
          zutaten.push({ menge, name });
        }
      });
      

    return zutaten;
  };

  const handleImport = async () => {
    if (!link.startsWith('http')) {
      Alert.alert('Ungültiger Link', 'Bitte gib einen gültigen Rezept-Link ein.');
      return;
    }

    try {
      const response = await fetch(link);
      const html = await response.text();

      const zutaten = await extractIngredientsFromHTML(html);

      if (!zutaten || zutaten.length === 0) {
        Alert.alert('Keine Zutaten gefunden', 'Es konnten keine Zutaten extrahiert werden.');
        return;
      }

      // Konvertieren in Einkaufslisten-Format
      const items = zutaten.map((zutat, index) => ({
        id: Date.now().toString() + index,
        name: zutat.name,
        gekauft: false,
        rubrik: 'Sonstiges',
        menge: parseFloat(zutat.menge) || 1,
        einheit: zutat.menge.replace(/[0-9.,\s]/g, '').trim() || 'Stück',
      }));

      onImport(items);
      setLink('');
    } catch (error) {
      Alert.alert('Fehler beim Import', error.message);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <Text style={styles.title}>Rezept importieren</Text>

            <Text style={styles.label}>Chefkoch-Link einfügen</Text>
            <TextInput
              style={styles.input}
              placeholder="https://www.chefkoch.de/..."
              placeholderTextColor="#888"
              value={link}
              onChangeText={setLink}
              autoCapitalize="none"
            />

            <Button title="Zutaten automatisch importieren" onPress={handleImport} />
            <View style={{ marginTop: 8 }}>
              <Button title="Abbrechen" onPress={onClose} color="#888" />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    width: '90%',
    borderRadius: 8,
    maxHeight: '85%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#000',
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    color: '#000',
  },
});
