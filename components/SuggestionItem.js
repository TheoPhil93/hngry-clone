import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function SuggestionItem({ product, added, onAdd, onOpen }) {
  // Wähle je nach Status das passende Icon
  const iconName = added ? 'open-in-new' : 'add';

  // Bestimme, was beim Drücken passieren soll
  const handlePress = added
    ? () => onOpen(product)   // Wenn schon hinzugefügt -> öffne Menü
    : () => onAdd(product);   // Wenn noch nicht hinzugefügt -> füge hinzu

  return (
    <View style={styles.container}>
      {/* Name des Produkts links */}
      <Text style={styles.productName}>{product.name}</Text>

      {/* Icon (Plus oder Öffnen) ganz rechts */}
      <Pressable onPress={handlePress} style={styles.iconContainer}>
        <MaterialIcons name={iconName} size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Text links, Icon rechts
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // z. B. bei dunklem Hintergrund
  },
  productName: {
    fontSize: 16,
    color: '#fff', // wenn dein Hintergrund dunkel ist
  },
  iconContainer: {
    backgroundColor: '#f0ad4e', // z. B. Orange
    padding: 8,
    borderRadius: 4,
  },
});
