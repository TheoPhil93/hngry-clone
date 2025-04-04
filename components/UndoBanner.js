// components/UndoBanner.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';


export default function UndoBanner({ isVisible, item, onUndo }) {

  if (!isVisible || !item) return null;

  return (
    <View style={styles.snackbarContainer}>
      <Text style={styles.snackbarText}>{item.name} wurde eingekauft.</Text>
      <TouchableOpacity onPress={onUndo}>
        <Text style={styles.snackbarAction}>Rückgängig</Text>
      </TouchableOpacity>
    </View>
  );
}