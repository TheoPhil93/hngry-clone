import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/* 
  Dieses Beispiel ist "self-contained":
  - Enthält eine Dummy-Liste searchResults
  - Implementiert die SuggestionItem-Logik inline
  - Zeigt ein kleines MengeModal inline
  => So kannst du es 1:1 kopieren und testen.
*/

export default function SearchScreen() {
  // Beispiel-Daten (wie sie sonst via API/Suche kommen)
  const [searchResults] = useState([
    { id: '1', name: 'limette' },
    { id: '2', name: 'lauch' },
    { id: '3', name: 'laktosefreie milch' },
    { id: '4', name: 'joghurt' },
  ]);

  // Speichert, was bereits hinzugefügt wurde
  // Jeder Eintrag hat z. B. { id, name, amount }
  const [addedProducts, setAddedProducts] = useState([]);

  // Für das Mengen-Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Prüft, ob ein Produkt schon hinzugefügt wurde
  const isAdded = (productId) => {
    return addedProducts.some((p) => p.id === productId);
  };

  // Wird aufgerufen, wenn auf das Plus-Icon getippt wird
  const handleAddProduct = (product) => {
    // Nur hinzufügen, wenn noch nicht vorhanden
    if (!isAdded(product.id)) {
      setAddedProducts((prev) => [...prev, { ...product, amount: 1 }]);
    }
  };

  // Wird aufgerufen, wenn auf das Öffnen-Icon getippt wird
  const handleOpenMengeMenu = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  // Minimales Mengen-Modal (inline)
  const MengeModal = ({ visible, product, onClose }) => {
    if (!product) return null; // Falls kein Produkt ausgewählt

    return (
      <Modal visible={visible} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={{ marginBottom: 10 }}>
              Menge für {product.name} einstellen
            </Text>
            {/* Hier könntest du einen Picker oder TextInput einbauen */}
            <Button title="Schließen" onPress={onClose} />
          </View>
        </View>
      </Modal>
    );
  };

  // Minimale SuggestionItem-Komponente (inline)
  const SuggestionItem = ({ product, added, onAdd, onOpen }) => {
    // Wechselt je nach Status das Icon
    const iconName = added ? 'open-in-new' : 'add';

    // Bestimme die Aktion beim Drücken
    const handlePress = added ? () => onOpen(product) : () => onAdd(product);

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{product.name}</Text>
        <Pressable onPress={handlePress} style={styles.iconButton}>
          <MaterialIcons name={iconName} size={24} color="#fff" />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#222' }}>
      {searchResults.map((product) => (
        <SuggestionItem
          key={product.id}
          product={product}
          added={isAdded(product.id)}
          onAdd={handleAddProduct}
          onOpen={handleOpenMengeMenu}
        />
      ))}

      <MengeModal
        visible={modalVisible}
        product={selectedProduct}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Text links, Icon rechts
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
  },
  iconButton: {
    backgroundColor: '#f0ad4e', // z. B. Orange
    padding: 8,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
});