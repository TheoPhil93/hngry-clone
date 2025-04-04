// components/ProductList.js
import React, { useCallback } from 'react';
import { SectionList, View, Text } from 'react-native';
import ProductItem from './ProductItem';
// Importiere styles direkt aus der korrekten Datei im Root-Verzeichnis
import { styles } from '../styles'; // '../' geht eine Ebene höher aus 'components' raus

// Die ProductList ist jetzt nur noch für die Anzeige zuständig
const ProductList = ({ sections, onTogglePurchased, iconMapping, onOpenMengeModal }) => {

  // Optimierter renderSectionHeader mit useCallback
  const renderSectionHeader = useCallback(({ section }) => (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
      </View>
  ), []); // Keine Abhängigkeiten, da nur Styles verwendet werden

  // Optimierter renderItem mit useCallback
  // Stelle sicher, dass onTogglePurchased korrekt von App.js übergeben wird
  const renderItem = useCallback(({ item }) => (
    <ProductItem
      item={item}
      onTogglePurchased={onTogglePurchased} // Diese Prop muss von App.js kommen
      iconMapping={iconMapping}
      styles={styles}
      onOpenMengeModal={() => onOpenMengeModal(item)}
    />
  ), [onTogglePurchased, iconMapping, onOpenMengeModal]); // Abhängigkeiten hinzufügen

  // ItemSeparator mit useCallback
  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  // Überprüfe, ob sections gültig ist, bevor SectionList gerendert wird
  if (!sections || !Array.isArray(sections)) {
     console.warn("ProductList sections prop is not a valid array:", sections);
     return (
         <View style={[styles.centered, {flex: 1}]}>
             <Text style={{ color: styles.text.color }}>Lade Liste...</Text>
         </View>
     );
   }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      ItemSeparatorComponent={renderSeparator} 
      stickySectionHeadersEnabled={false}
      contentContainerStyle={{ paddingBottom: 80 }}
    />
  );
};

export default ProductList;