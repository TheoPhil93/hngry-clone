// components/MengeModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

const MengeModal = ({ visible, onClose, onSave, item }) => {
  const [quantity, setQuantity] = useState('1');

  // Wenn ein Item übergeben wird, setze die aktuelle Menge
  useEffect(() => {
    if (item && item.menge) {
      setQuantity(item.menge.toString());
    }
  }, [item]);

  const handleSave = () => {
    const updatedItem = { ...item, menge: parseFloat(quantity) || 1 };
    onSave(updatedItem);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>Menge anpassen</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
          <Button title="Speichern" onPress={handleSave} />
          <Button title="Schließen" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 8,
    alignItems: 'center'
  },
  header: {
    fontSize: 20,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '100%',
    marginBottom: 10,
    borderRadius: 4
  }
});

export default MengeModal;
