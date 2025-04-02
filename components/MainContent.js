// components/MainContent.js
import React from 'react';
import { View, SectionList, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MainContent = ({ 
  suche, 
  vorgeschlageneProdukte, 
  sections, 
  hinzufuegen, 
  handleOpenMengeModal, 
  renderSectionHeader 
}) => {
  return (
    <View style={{ flex: 1 }}>
      {suche !== '' ? (
        <SectionList
          sections={[{ title: 'Einkaufsvorschläge', data: vorgeschlageneProdukte }]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => hinzufuegen(item)}>
              <View style={styles.itemRow}>
                <MaterialCommunityIcons
                  name={/* hier ggf. iconMapping Logik */}
                  size={24}
                  color="#f8b107"
                  style={styles.iconLeft}
                />
                <Text style={styles.itemText}>
                  {typeof item === 'string' ? item : item.name} – {typeof item === 'string' ? '1' : item.menge} {typeof item === 'string' ? 'Stück' : item.einheit}
                </Text>
                {typeof item !== 'string' && (
                  <TouchableOpacity onPress={() => handleOpenMengeModal(item)}>
                    <MaterialCommunityIcons
                      name="plus-circle-outline"
                      size={24}
                      color="#f8b107"
                      style={styles.iconRight}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          )}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        // Anderer Content, z.B. die Einkaufsliste
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemRow: { /* Deine Styles */ },
  iconLeft: { /* Deine Styles */ },
  iconRight: { /* Deine Styles */ },
  itemText: { /* Deine Styles */ },
  separator: { /* Deine Styles */ },
});

export default MainContent;
