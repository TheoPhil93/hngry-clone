// components/MainContentDisplay.js
import React from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet } from 'react-native'; // StyleSheet importieren
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProductList from './ProductList';

// Die ProductSuggestions Komponente (oder Logik) anpassen:
const ProductSuggestions = ({
    suggestions,
    liste, // <-- Empfängt die aktuelle Liste
    hinzufuegen,
    handleOpenMengeModal, // <-- Empfängt die Funktion zum Öffnen des Modals
    iconMapping,
    styles
}) => {

    // Hilfsfunktion, um zu prüfen, ob ein Item schon in der Liste ist
    // und um das komplette Item-Objekt zu bekommen
    const findExistingItem = (suggestionName) => {
        return liste.find(item => item.name.toLowerCase() === suggestionName.toLowerCase());
    };

    return (
        <SectionList
            sections={[{ title: 'Einkaufsvorschläge', data: suggestions }]}
            keyExtractor={(item, index) => `suggestion-${index}-${item}`}
            renderItem={({ item: suggestionName }) => { 
                // --- DEBUG LOGGING ---
                console.log('--- Rendering Suggestion Item ---');
                console.log('Suggestion Name:', suggestionName);

                const existingItem = findExistingItem(suggestionName);
                const isAdded = !!existingItem; // Prüfen, ob das Item schon existiert

                console.log('Is Added?:', isAdded);
                console.log('Existing Item Object:', existingItem);
                // --- END DEBUG LOGGING ---

                
                return (
                    <View style={[styles.itemRow, isAdded ? styles.itemRowAdded : null]}>
                        {/* Linke Seite: Icon und Name */}
                        <View style={styles.itemLeft}>
                            <MaterialCommunityIcons
                                name={iconMapping[suggestionName.toLowerCase()] || 'help-circle-outline'}
                                size={24}
                                color={isAdded ? '#888' : '#D3D3D3'} // Andere Farbe wenn hinzugefügt
                                style={styles.iconLeft}
                            />
                            <Text style={[styles.itemText, isAdded ? styles.itemTextAdded : null]}>
                                {suggestionName}
                            </Text>
                        </View>

                        {/* Rechte Seite: Button (dynamisch) */}
                        <TouchableOpacity
                            style={[styles.actionButton, isAdded ? styles.openButton : styles.addButton]}
                            onPress={() => {
                                if (isAdded) {
                                    console.log('Öffnen geklickt für:', existingItem);
                                    handleOpenMengeModal(existingItem); // Modal mit dem existierenden Item öffnen
                                } else {
                                    console.log('Hinzufügen geklickt für:', suggestionName);
                                    hinzufuegen(suggestionName);      // Item hinzufügen
                                }
                            }}
                        >
                            {isAdded ? (
                                <Text style={styles.openButtonText}>Öffnen</Text>
                            ) : (
                                <MaterialCommunityIcons name="plus" size={24} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </View>
                );
            }}
            renderSectionHeader={({ section }) => (
                <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeaderText}>{section.title.toUpperCase()}</Text>
                </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListHeaderComponent={() => <View style={styles.separator} />}
            ListFooterComponent={() => <View style={styles.separator} />}
        />
    );
};


// --- Hauptkomponente ---
export default function MainContentDisplay({
    selectedTab,
    suche,
    vorgeschlageneProdukte,
    liste, // <-- Empfängt die Liste
    sections,
    hinzufuegen,
    toggleGekauft,
    handleOpenMengeModal, // <-- Empfängt die Funktion
    iconMapping,
    styles // <-- Empfängt die Styles
}) {

    const renderSectionHeader = React.useCallback(/* ... wie gehabt ... */);

    if (selectedTab === 'einkaufsliste') {
        if (suche !== '') {
            // Zeige Suchvorschläge
            return (
                <View style={{ flex: 1 }}>
                    <ProductSuggestions
                        suggestions={vorgeschlageneProdukte}
                        liste={liste} // <-- Weitergeben
                        hinzufuegen={hinzufuegen}
                        handleOpenMengeModal={handleOpenMengeModal} // <-- Weitergeben
                        iconMapping={iconMapping}
                        styles={styles} // <-- Weitergeben
                    />
                </View>
            );
        } else {
            // Zeige die normale Einkaufsliste
            return (
                 <View style={{ flex: 1 }}>
                    <ProductList
                        // ... props wie gehabt ...
                        toggleGekauft={toggleGekauft} // Für den Haken
                    />
                </View>
            );
        }
    }
    // ... Rest der Komponente ...
    return null;
}

// Füge die spezifischen Styles für die Buttons hinzu (innerhalb von MainContentDisplay oder global)
// Diese Styles müssen ggf. an die von App.js übergebenen Styles angepasst/gemerged werden.
const suggestionStyles = StyleSheet.create({
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 15, // Runde Buttons
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 70, // Mindestbreite
    },
    addButton: {
        backgroundColor: '#f8b107', // Orange für Hinzufügen
    },
    openButton: {
        backgroundColor: '#555', // Grau für Öffnen
    },
    openButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    // Optional: Style für bereits hinzugefügte Zeilen
    itemRowAdded: {
       // backgroundColor: '#1a1a1a' // Etwas anderer Hintergrund?
    },
    itemTextAdded: {
        color: '#888' // Text etwas ausgrauen?
    }
});

// WICHTIG: Die Styles in MainContentDisplay (`styles`) und die neuen `suggestionStyles`
// müssen kombiniert oder referenziert werden. Am einfachsten ist es, wenn du die
// neuen Styles (actionButton, addButton, etc.) direkt in das `styles`-Objekt in `App.js` aufnimmst
// und dann hier über `styles.actionButton` etc. darauf zugreifst.