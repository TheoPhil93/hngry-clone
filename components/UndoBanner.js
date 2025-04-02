// components/UndoBanner.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function UndoBanner({ showUndoBanner, undoItem, undoPurchase, styles }) {
  if (!showUndoBanner || !undoItem) return null;

  return (
    <View style={styles.snackbarContainer}>
      <Text style={styles.snackbarText}>{undoItem.name} wurde eingekauft.</Text>
      <TouchableOpacity onPress={undoPurchase}>
        <Text style={styles.snackbarAction}>Rückgängig</Text>
      </TouchableOpacity>
    </View>
  );
}