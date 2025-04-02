// components/BottomTabBar.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function BottomTabBar({ selectedTab, setSelectedTab, styles }) {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedTab('einkaufsliste')}>
        <Text style={[styles.tabText, selectedTab === 'einkaufsliste' && styles.tabTextActive]}>Einkaufsliste</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedTab('vorrat')}>
        <Text style={[styles.tabText, selectedTab === 'vorrat' && styles.tabTextActive]}>Vorrat</Text>
      </TouchableOpacity>
    </View>
  );
}