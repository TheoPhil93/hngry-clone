// components/TestInputScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function TestInputScreen() {
  const [text, setText] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>Test Eingabe:</Text>
        <TextInput
          style={styles.input}
          placeholder="Hier tippen..."
          value={text}
          onChangeText={(inputText) => {
            console.log('>>> TestInput onChangeText:', inputText); // Log hier
            setText(inputText);
          }}
        />
        <Text style={styles.output}>Eingabe: {text}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#333' },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { color: 'white', marginBottom: 5, fontSize: 18 },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
    color: 'black',
  },
  output: { color: 'white', marginTop: 10, fontSize: 16 },
});