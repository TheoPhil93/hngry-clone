// components/ProductSuggestions.js
import React from 'react';
import { View, Text, TouchableOpacity, SectionList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProductSuggestions({ suche, liste, hinzufuegen, handleOpenMengeModal, iconMapping, styles }) {
  const allProducts = useMemo(() => Object.values(categories).flat(), []);

  const vorgeschlageneProdukte = useMemo(() => {
    return allProducts.filter(p =>
      p.startsWith(suche.toLowerCase()) &&
      !liste.some(item => item.name.toLowerCase() === p)
    );
  }, [suche, allProducts, liste]);

  return (
    <View style={{ flex: 1 }}>
      <SectionList
        sections={[{ title: 'Einkaufsvorschläge', data: vorgeschlageneProdukte }]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => hinzufuegen(item)}>
            <View style={styles.itemRow}>
              <MaterialCommunityIcons
                name={iconMapping[item] || 'cart-outline'}
                size={24}
                color="#f8b107"
                style={styles.iconLeft}
              />
              <Text style={styles.itemText}>{item} – 1 Stück</Text>
              <TouchableOpacity onPress={() => handleOpenMengeModal(item)}>
                <MaterialCommunityIcons
                  name="plus-circle-outline"
                  size={24}
                  color="#f8b107"
                  style={styles.iconRight}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}