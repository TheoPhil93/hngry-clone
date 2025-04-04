// App.js
import React, { useMemo } from 'react';
// Stelle sicher, dass nur benötigte Komponenten importiert werden
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUIState } from './hooks/useUIState'; // Stellt sicher, dass diese Datei auch die vereinfachte Version ist
import { useShoppingList } from './hooks/useShoppingList'; // Stellt sicher, dass addProduct nur Namen nimmt

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
import { styles, colors } from './styles'; // colors für Vorrat-Text importieren (optional)

export default function App() {
  // Vereinfachte Destrukturierung aus useUIState (ohne Suggestion-Logik)
  const {
    suche, setSuche,
    listName, menuOpen, toggleMenu, slideAnim,
    selectedTab, setSelectedTab, recipeModalVisible, openRecipeModal,
    closeRecipeModal, showMengeModal, selectedItemForModal,
    openMengeModal, closeMengeModal,
  } = useUIState('einkaufsliste');

  // useShoppingList mit vereinfachtem addProduct
  const {
    liste, addProduct, togglePurchased, updateProduct, undoItem,
    showUndoBanner, undoPurchase, sections,
  } = useShoppingList([]);

  // --- Berechnete Werte ---
  const allProducts = useMemo(() => Object.values(categories).flat(), []);
  const vorgeschlageneProdukte = useMemo(() => {
    if (suche.trim() === '') return [];
    const suchbegriffLower = suche.toLowerCase();
    return allProducts.filter(p =>
      p.startsWith(suchbegriffLower) &&
      !liste.some(item => item.name.toLowerCase() === p)
    );
  }, [suche, allProducts, liste]);

  // --- Callback-Handler ---
  // handleSaveMenge aktualisiert nur noch bestehende Items und setzt Flag
  const handleSaveMenge = (itemFromModal) => {
    const itemToUpdate = { ...itemFromModal, mengeWurdeGesetzt: true };
    console.log("handleSaveMenge (reverted) - Updating item:", JSON.stringify(itemToUpdate));
    updateProduct(itemToUpdate);
    closeMengeModal();
  };

  // handleImportIngredients bleibt gleich
  const handleImportIngredients = (ingredientNames) => {
    ingredientNames.forEach(name => addProduct(name)); // Nutzt einfachen addProduct
    closeRecipeModal();
  };

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

      {/* === KORRIGIERTER contentContainer Block === */}
      <View style={styles.contentContainer}>
        {selectedTab === 'einkaufsliste' ? (
          // === Fall 1: Tab ist "einkaufsliste" ===
          <>
            {suche.trim() !== '' ? (
              // Fall 1a: Suche ist aktiv -> Zeige Vorschläge
              <SuggestionList
                suggestions={vorgeschlageneProdukte}
                // Übergibt addProduct; leert Suche nach Klick
                onAddProduct={(name) => {
                   addProduct(name);
                   setSuche('');
                }}
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
          </> // Ende Fragment für Einkaufsliste-Inhalt

        ) : (
          // === Fall 2: Tab ist NICHT "einkaufsliste" (also "vorrat") ===
          <View style={styles.centered}>
            <MaterialCommunityIcons name="store-outline" size={50} color={colors.textSecondary} />{/* Farbe angepasst */}
            <Text style={{ color: colors.text, fontSize: 18, marginTop: 10 }}>{/* Farbe angepasst */}
              Vorrat kommt bald!
            </Text>
          </View>
        )}
      </View>
      {/* === Ende KORRIGIERTER contentContainer Block === */}

      <UndoBanner // Bleibt
        isVisible={showUndoBanner}
        item={undoItem}
        onUndo={undoPurchase}
      />
      <BottomTabBar // Bleibt
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />
      {/* MengeModal bleibt für Bearbeitung */}
      {showMengeModal && selectedItemForModal && (
         <MengeModal
           visible={showMengeModal}
           onClose={closeMengeModal}
           onSave={handleSaveMenge} // Nutzt vereinfachte Version
           item={selectedItemForModal}
         />
       )}
       {/* RecipeImportModal bleibt */}
       {recipeModalVisible && (
          <RecipeImportModal
            visible={recipeModalVisible}
            onClose={closeRecipeModal}
            onImport={handleImportIngredients}
          />
       )}
    </View>
  );
}