// components/SuggestionList.js
import React, { useCallback } from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles, colors } from '../styles';

// Erwartet nur onAddProduct
const SuggestionList = ({ suggestions, onAddProduct, iconMapping }) => {

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);
  const renderListHeader = useCallback(() => (
     <View style={styles.sectionHeaderContainer}>
       <Text style={styles.sectionHeaderText}>Vorschläge</Text>
     </View>
  ), []);

  const renderSuggestion = useCallback(({ item: suggestionName }) => {
    const iconName = iconMapping[suggestionName.toLowerCase()] || 'food-variant';
    return (
      // Ruft direkt onAddProduct auf
      <TouchableOpacity onPress={() => onAddProduct(suggestionName)} activeOpacity={0.7}>
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
             <MaterialCommunityIcons name={iconName} size={24} color={colors.text} style={styles.iconLeft} />
             <Text style={styles.itemText}>
               {suggestionName.charAt(0).toUpperCase() + suggestionName.slice(1)}
             </Text>
          </View>
          <View style={styles.itemRight}>
             {/* Einfaches Plus-Icon */}
             <MaterialCommunityIcons name="plus-circle-outline" size={28} color={colors.primary}/>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [onAddProduct, iconMapping]); // Abhängigkeit onAddProduct

  return (
    <FlatList
      data={suggestions}
      keyExtractor={(item, index) => item + index}
      renderItem={renderSuggestion}
      ItemSeparatorComponent={renderSeparator}
      ListHeaderComponent={renderListHeader}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 80 }}
    />
  );
};

export default SuggestionList;