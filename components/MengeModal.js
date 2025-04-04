// components/MengeModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

const MengeModal = ({ visible, onClose, onSave, item }) => {
  // State für Menge und Einheit
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('Stück');

  // Wenn sich das Item ändert (oder beim ersten Öffnen),
  // setze die aktuellen Werte aus dem Item im Modal
  useEffect(() => {
    if (item) {
      setQuantity(item.menge ? item.menge.toString() : '1');
      setUnit(item.einheit || 'Stück');
    } else {
      // Standardwerte, falls kein Item übergeben wird (sollte nicht passieren)
      setQuantity('1');
      setUnit('Stück');
    }
  }, [item]); // Effekt läuft, wenn sich 'item' ändert

  const handleSave = () => {
    // Stelle sicher, dass quantity eine gültige Zahl ist, sonst Standardwert 1
    const numQuantity = parseFloat(quantity.replace(',', '.')); // Komma durch Punkt ersetzen für Dezimalzahlen
    const finalQuantity = !isNaN(numQuantity) && numQuantity > 0 ? numQuantity : 1;

    // Stelle sicher, dass unit nicht leer ist, sonst Standardwert 'Stück'
    const finalUnit = unit.trim() !== '' ? unit.trim() : 'Stück';

    // Erstelle das aktualisierte Item-Objekt
    const updatedItem = {
        ...item, // Behalte alle anderen Eigenschaften des Items bei (id, name, gekauft etc.)
        menge: finalQuantity,
        einheit: finalUnit
    };
    onSave(updatedItem); // Rufe die onSave Funktion aus App.js (via useShoppingList) auf
    // Das Schließen des Modals wird jetzt in App.js nach dem Speichern gemacht
  };

  // Verhindert das Schließen, wenn außerhalb geklickt wird (optional)
  const handleRequestClose = () => {
      // Hier könntest du eine Warnung anzeigen, wenn Änderungen nicht gespeichert wurden
      onClose(); // Schließt das Modal trotzdem
  }

  return (
    <Modal
        visible={visible}
        animationType="fade" // Oder "slide"
        transparent={true}
        onRequestClose={handleRequestClose} // Für Android Back-Button
    >
        {/* Overlay für den Hintergrund */}
        <View style={styles.overlay}>
            {/* KeyboardAvoidingView, damit die Tastatur das Modal nicht verdeckt */}
            <KeyboardAvoidingView
                 behavior={Platform.OS === "ios" ? "padding" : "height"}
                 style={styles.keyboardAvoidingContainer}
            >
                {/* Container für den Modal-Inhalt */}
                <View style={styles.container}>
                    <Text style={styles.header}>Menge anpassen für:</Text>
                    <Text style={styles.itemName}>{item?.name || 'Produkt'}</Text>

                    <View style={styles.inputRow}>
                        {/* Eingabefeld für die Menge */}
                        <TextInput
                            style={[styles.input, styles.inputMenge]}
                            keyboardType="numeric" // Zeigt numerische Tastatur
                            value={quantity}
                            onChangeText={setQuantity}
                            placeholder="Menge"
                            autoFocus={true} // Fokussiert dieses Feld beim Öffnen
                        />
                        {/* Eingabefeld für die Einheit */}
                        <TextInput
                            style={[styles.input, styles.inputEinheit]}
                            value={unit}
                            onChangeText={setUnit}
                            placeholder="Einheit (z.B. Stück, kg)"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Buttons zum Speichern und Schließen */}
                    <View style={styles.buttonRow}>
                        <Button title="Abbrechen" onPress={onClose} color="#888" />
                        <Button title="Speichern" onPress={handleSave} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Dunkleres Overlay
    justifyContent: 'center', // Zentriert vertikal
    alignItems: 'center',     // Zentriert horizontal
  },
  keyboardAvoidingContainer: {
      width: '90%', // Breite des Containers für KeyboardAvoidingView
  },
  container: {
    backgroundColor: '#fff', // Heller Hintergrund für das Modal
    padding: 20,
    borderRadius: 12,       // Abgerundete Ecken
    alignItems: 'stretch', // Streckt Elemente horizontal
    width: '100%',          // Nimmt die Breite des KAV-Containers ein
    shadowColor: "#000",    // Schatten (iOS)
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,           // Schatten (Android)
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    textAlign: 'center',
  },
  itemName: {
    fontSize: 18,
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputRow: {
      flexDirection: 'row',
      marginBottom: 20,
      justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: '#f9f9f9' // Leichter Hintergrund für Input
  },
  inputMenge: {
      flex: 1, // Nimmt verfügbaren Platz (ca. 40%)
      marginRight: 10,
      textAlign: 'right',
  },
  inputEinheit: {
      flex: 1.5, // Nimmt mehr Platz (ca. 60%)
  },
  buttonRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end', // Buttons nach rechts
      marginTop: 10,
  }
});

export default MengeModal;