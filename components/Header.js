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
    paddingTop: 35,
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
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  backIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: '#fff'
  }
});
