// components/BottomTabBar.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
// Importiere styles aus der zentralen Datei
import { styles } from '../styles'; // '../' geht eine Ebene höher

// Nimmt KEINE styles mehr als Prop entgegen!
export default function BottomTabBar({ selectedTab, onSelectTab }) {
  return (
    // Verwendet das importierte styles Objekt
    <View style={styles.bottomBar}>
      <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onSelectTab('einkaufsliste')}
          testID="tab-einkaufsliste"
      >
        <Text style={[styles.tabText, selectedTab === 'einkaufsliste' && styles.tabTextActive]}>
          Einkaufsliste
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onSelectTab('vorrat')}
          testID="tab-vorrat"
       >
        <Text style={[styles.tabText, selectedTab === 'vorrat' && styles.tabTextActive]}>
          Vorrat
        </Text>
      </TouchableOpacity>
    </View>
  );
}