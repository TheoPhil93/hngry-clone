// App.js
import React, { useMemo, useCallback } from 'react'; // useCallback hinzugefügt
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Importiere Hooks und Utils
import { useUIState } from './hooks/useUIState'; // Benötigt die *einfache* Version ohne Suggestion-State
import { useShoppingList } from './hooks/useShoppingList'; // Benötigt die Version mit addProduct, die Objekte kann!
import { parseIngredient } from './utils/ingredientParser'; // Stellt sicher, dass dies die verbesserte Version ist

// Importiere Komponenten
import Header from './components/Header';
import Drawer from './components/Drawer';
import ProductList from './components/ProductList';
import SuggestionList from './components/SuggestionList';
import MengeModal from './components/MengeModal';
import RecipeImportModal from './components/RecipeImportModal';
import BottomTabBar from './components/BottomTabBar';
import UndoBanner from './components/UndoBanner';

// Importiere Konfiguration und Styles
import { categories } from './config/categories';
import { iconMapping } from './config/iconMapping';
import { styles, colors } from './styles'; // colors für Vorrat/Imports

export default function App() {

  // === Hooks ===
  // Vereinfachte Destrukturierung aus useUIState (passend zum einfachen Workflow)
  const {
    suche, setSuche, // setSuche direkt holen
    listName, menuOpen, toggleMenu, slideAnim,
    selectedTab, setSelectedTab, recipeModalVisible, openRecipeModal,
    closeRecipeModal, showMengeModal, selectedItemForModal,
    openMengeModal, closeMengeModal,
  } = useUIState('einkaufsliste');

  // useShoppingList (addProduct muss Objekte verarbeiten können!)
  const {
    liste, addProduct, togglePurchased, updateProduct, undoItem,
    showUndoBanner, undoPurchase, sections,
  } = useShoppingList([]);

  // === Berechnete Werte ===
  const allProducts = useMemo(() => Object.values(categories).flat(), []);
  const vorgeschlageneProdukte = useMemo(() => {
    if (suche.trim() === '') return [];
    const suchbegriffLower = suche.toLowerCase();
    return allProducts.filter(p =>
      (typeof p === 'string' && p.startsWith(suchbegriffLower)) &&
      !liste.some(item => {
          if (!item || typeof item.name !== 'string') {
              console.error('!!! Fehlerhaftes Item in Liste gefunden (bei Vorschlägen):', JSON.stringify(item));
              return true; // Überspringen, um Absturz zu vermeiden
          }
          return item.name?.toLowerCase() === p.toLowerCase(); // p ist hier sicher ein String
      })
    );
  }, [suche, allProducts, liste]);

  // === Handler-Funktionen ===

  // Für den einfachen Workflow ("Tipp fügt direkt hinzu"):
  const handleAddSuggestion = useCallback((name) => {
    addProduct(name); // Ruft addProduct mit String auf (setzt Defaults, Flag false)
    setSuche('');     // Leert Suche direkt
  }, [addProduct, setSuche]);

  // Für Mengen-Modal (aktualisiert immer und setzt Flag)
  const handleSaveMenge = useCallback((itemFromModal) => {
    const itemToUpdate = { ...itemFromModal, mengeWurdeGesetzt: true };
    console.log("handleSaveMenge - Updating item:", JSON.stringify(itemToUpdate));
    updateProduct(itemToUpdate);
    closeMengeModal();
  }, [updateProduct, closeMengeModal]);

  // Für Rezeptimport (nutzt parseIngredient und add/update mit Objekten)
  const handleImportIngredients = useCallback((ingredientStrings) => {
    console.log("Importing ingredients:", ingredientStrings);
    const itemsToAdd = [];
    const itemsToUpdate = [];

    for (const ingredientStr of ingredientStrings) {
      const parsed = parseIngredient(ingredientStr); // Parser verwenden

      if (parsed) {
        console.log("Parsed:", parsed);
        const existingItemIndex = liste.findIndex(item => item.name.toLowerCase() === parsed.name.toLowerCase());

        if (existingItemIndex > -1) {
          // Item existiert -> Update vorbereiten
          const existingItem = liste[existingItemIndex];
          console.log("Item exists, preparing update for:", existingItem.name);
          const itemForUpdate = {
            ...existingItem,
            menge: parsed.menge, // Neue Menge/Einheit/Notiz
            einheit: parsed.einheit,
            note: parsed.note,
            mengeWurdeGesetzt: true, // Flag setzen
          };
          itemsToUpdate.push(itemForUpdate);
        } else {
          // Item ist neu -> Hinzufügen vorbereiten
          console.log("Item is new, preparing add for:", parsed.name);
           // Objekt für addProduct erstellen
          const itemForAdd = {
            name: parsed.name,
            menge: parsed.menge,
            einheit: parsed.einheit,
            note: parsed.note,
            // WICHTIG: mengeWurdeGesetzt wird von addProduct (Objekt-Fall) auf true gesetzt!
          };
          itemsToAdd.push(itemForAdd);
        }
      } else {
        console.warn("Could not parse ingredient string:", ingredientStr);
      }
    }

    // Updates und Adds ausführen
    console.log("Items to update:", itemsToUpdate);
    console.log("Items to add:", itemsToAdd);
    itemsToUpdate.forEach(item => updateProduct(item)); // Update ausführen
    // WICHTIG: addProduct muss das Objekt verarbeiten können!
    itemsToAdd.forEach(item => addProduct(item));     // Add mit Objekt ausführen

    closeRecipeModal();
  }, [liste, addProduct, updateProduct, closeRecipeModal]);

  // --- Rendering ---
  return (
    <View style={styles.container}>
      <Drawer menuOpen={menuOpen} toggleMenu={toggleMenu} slideAnim={slideAnim} />
      <Header
        listName={listName}
        toggleMenu={toggleMenu}
        suche={suche}
        setSuche={setSuche} // Übergibt setSuche direkt
        onOpenRecipeModal={openRecipeModal}
        // Keine Suggestion-Handler mehr übergeben
      />

      {/* KORREKTER Conditional Block für Tabs */}
      <View style={styles.contentContainer}>
        {selectedTab === 'einkaufsliste' ? (
          // Fall 1: Tab ist "einkaufsliste"
          <>
            {suche.trim() !== '' ? (
              // Fall 1a: Suche ist aktiv -> Zeige Vorschläge
              <SuggestionList
                suggestions={vorgeschlageneProdukte}
                onAddProduct={handleAddSuggestion} // Handler für direkten Add
                iconMapping={iconMapping}
              />
            ) : (
              // Fall 1b: Suche ist inaktiv -> Zeige Produktliste
              <ProductList
                 sections={sections}
                 onTogglePurchased={togglePurchased}
                 iconMapping={iconMapping}
                 onOpenMengeModal={openMengeModal} // Für Pfeil in Hauptliste
              />
            )}
          </> // Ende Fragment Einkaufsliste

        ) : (
          // Fall 2: Tab ist "vorrat"
          <View style={styles.centered}>
            <MaterialCommunityIcons name="store-outline" size={50} color={colors.textSecondary} />
            <Text style={{ color: colors.text, fontSize: 18, marginTop: 10 }}>
              Vorrat kommt bald!
            </Text>
          </View>
        )}
      </View>
      {/* Ende Conditional Block */}

      <UndoBanner // Bleibt
        isVisible={showUndoBanner}
        item={undoItem}
        onUndo={undoPurchase}
      />
      <BottomTabBar // Bleibt
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />
      {/* MengeModal bleibt für Bearbeitung über ProductList */}
      {showMengeModal && selectedItemForModal && (
         <MengeModal
           visible={showMengeModal}
           onClose={closeMengeModal}
           onSave={handleSaveMenge} // Nutzt korrekte Version
           item={selectedItemForModal}
         />
       )}
       {/* RecipeImportModal bleibt */}
       {recipeModalVisible && (
          <RecipeImportModal
            visible={recipeModalVisible}
            onClose={closeRecipeModal}
            onImport={handleImportIngredients} // Nutzt korrekte Version
          />
       )}
    </View>
  );
} // Ende der App-Komponente