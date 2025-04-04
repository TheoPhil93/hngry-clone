// components/Header.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Header({ listName, toggleMenu, suche, setSuche, onOpenRecipeModal }) {
  return (
    <View style={{ backgroundColor: '#000' }}>
      {/* Obere Zeile: Menü, Titel, Rezept-Button */}
      <View style={styles.headerTop}>
        <Pressable onPress={toggleMenu}>
          <MaterialIcons name="menu" size={28} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>{listName}</Text>
        <Pressable onPress={onOpenRecipeModal}>
          <MaterialIcons name="library-add" size={28} color="#fff" />
        </Pressable>
      </View>

      {/* Suchleiste */}
      <View style={styles.searchRow}>
        {suche !== '' && (
          <TouchableOpacity onPress={() => setSuche('')} style={styles.backIcon}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <TextInput
          style={styles.searchInput}
          placeholder="Was brauchst du?"
          placeholderTextColor="#888"
          value={suche}
          onChangeText={setSuche}
          clearButtonMode="while-editing" // Optional: Löschen-Button hinzufügen (iOS)
          returnKeyType="search" // Optional: Tastatur-Button
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8b107',
    paddingHorizontal: 16,
    paddingTop: 45, // Ggf. an SafeAreaView anpassen
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8b107',
    paddingHorizontal: 15,
    paddingBottom: 15, // Angepasst
    paddingTop: 5,    // Angepasst
    // borderBottomLeftRadius: 20, // Entfernt für bündigen Abschluss
    // borderBottomRightRadius: 20 // Entfernt
  },
  backIcon: {
    marginRight: 10, // Mehr Abstand
    padding: 5, // Klickbereich vergrößern
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff', // Heller für Kontrast
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10, // Angepasst
    fontSize: 16, // Größer
    color: '#000' // Dunkler Text
  }
});