import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet, SectionList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from './components/Header';
import Drawer from './components/Drawer';
import ProductList from './components/ProductList';
import { categories } from './config/categories';
import { iconMapping } from './config/iconMapping';
import RecipeImportModal from './components/RecipeImportModal';





export default function App() {
  const [suche, setSuche] = useState('');
  const [liste, setListe] = useState([]);
  const [listName, setListName] = useState('Meine Einkaufsliste');
  const [menuOpen, setMenuOpen] = useState(false);
  const [undoItem, setUndoItem] = useState(null);
  const [showUndoBanner, setShowUndoBanner] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showMengeModal, setShowMengeModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('einkaufsliste'); // 'einkaufsliste' oder 'vorrat'
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);


  const drawerWidth = 250;
  const slideAnim = useRef(new Animated.Value(-drawerWidth)).current;

  const importIngredients = (ingredients) => {
    setListe((prev) => [...prev, ...ingredients]);
    setRecipeModalVisible(false);
  };
  
  
  const toggleMenu = useCallback(() => {
    if (menuOpen) {
      Animated.timing(slideAnim, {
        toValue: -drawerWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [menuOpen, slideAnim]);

  const handleOpenMengeModal = (item) => {
    setSelectedItem(item);
    setShowMengeModal(true);
  };

  const handleCloseMengeModal = () => {
    setShowMengeModal(false);
  };

  const handleSaveMenge = (updatedItem) => {
    setListe(prev =>
      prev.map(p => (p.id === updatedItem.id ? { ...p, ...updatedItem } : p))
    );
    setShowMengeModal(false);
  };

  const hinzufuegen = useCallback((name) => {
    if (name.trim() === '') return;
    const lowerName = name.toLowerCase();
    let rubrik = 'Sonstiges';
    for (const [catName, products] of Object.entries(categories)) {
      if (products.includes(lowerName)) {
        rubrik = catName;
        break;
      }
    }
    if (!liste.some(item => item.name.toLowerCase() === lowerName)) {
      setListe(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          name,
          gekauft: false,
          rubrik,
          menge: 1,
          einheit: 'Stück'
        }
      ]);
    }
    setSuche('');
  }, [liste]);

  const toggleGekauft = useCallback((id) => {
    setListe(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, gekauft: !item.gekauft };
          if (updatedItem.gekauft) {
            setUndoItem(updatedItem);
            setShowUndoBanner(true);
          }
          return updatedItem;
        }
        return item;
      })
    );
  }, []);

  const undoPurchase = useCallback(() => {
    if (!undoItem) return;
    setListe(prev =>
      prev.map(item => (item.id === undoItem.id ? { ...item, gekauft: false } : item))
    );
    setUndoItem(null);
    setShowUndoBanner(false);
  }, [undoItem]);

  useEffect(() => {
    if (showUndoBanner) {
      const timer = setTimeout(() => {
        setShowUndoBanner(false);
        setUndoItem(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showUndoBanner]);

  const allProducts = useMemo(() => Object.values(categories).flat(), []);

  const vorgeschlageneProdukte = useMemo(() => {
    return allProducts.filter(p =>
      p.startsWith(suche.toLowerCase()) &&
      !liste.some(item => item.name.toLowerCase() === p)
    );
  }, [suche, allProducts, liste]);

  const sections = useMemo(() => {
    const purchased = liste.filter(item => item.gekauft);
    const notPurchased = liste.filter(item => !item.gekauft);
    const grouped = notPurchased.reduce((acc, product) => {
      if (!acc[product.rubrik]) acc[product.rubrik] = [];
      acc[product.rubrik].push(product);
      return acc;
    }, {});
    let sec = Object.keys(grouped).map(catName => ({
      title: catName,
      data: grouped[catName]
    }));
    sec.sort((a, b) => a.title.localeCompare(b.title));
    if (purchased.length > 0) {
      sec.push({ title: 'GEKAUFTE PRODUKTE', data: purchased });
    }
    return sec;
  }, [liste]);

  const renderSectionHeader = useCallback(({ section }) => (
    <View>
      <View style={styles.separator} />
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
      </View>
      <View style={styles.separator} />
    </View>
  ), [styles]);

  return (
    <View style={styles.container}>
      <Drawer menuOpen={menuOpen} toggleMenu={toggleMenu} slideAnim={slideAnim} />
      <Header listName={listName} toggleMenu={toggleMenu} suche={suche} setSuche={setSuche} onOpenRecipeModal={() => setRecipeModalVisible(true)} />

      {/* Hauptinhalt: Je nach ausgewähltem Tab */}
      {selectedTab === 'einkaufsliste' ? (
        suche !== '' ? (
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
        ) : (
          <View style={{ flex: 1 }}>
            <ProductList
              sections={sections}
              toggleGekauft={toggleGekauft}
              iconMapping={iconMapping}
              styles={styles}
              renderSectionHeader={renderSectionHeader}
            />
          </View>
        )
      ) : (
        // Vorrat-Ansicht (Platzhalter, kann später angepasst werden)
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 18 }}>Vorrat kommt bald!</Text>
        </View>
      )}

      {showUndoBanner && undoItem && (
        <View style={styles.snackbarContainer}>
          <Text style={styles.snackbarText}>{undoItem.name} wurde eingekauft.</Text>
          <TouchableOpacity onPress={undoPurchase}>
            <Text style={styles.snackbarAction}>Rückgängig</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Bar für Tab-Navigation */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedTab('einkaufsliste')}>
          <Text style={[styles.tabText, selectedTab === 'einkaufsliste' && styles.tabTextActive]}>Einkaufsliste</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedTab('vorrat')}>
          <Text style={[styles.tabText, selectedTab === 'vorrat' && styles.tabTextActive]}>Vorrat</Text>
        </TouchableOpacity>
      </View>
      <RecipeImportModal
  visible={recipeModalVisible}
  onClose={() => setRecipeModalVisible(false)}
  onImport={(ingredients) => {
    setListe((prev) => [...prev, ...ingredients]);
    setRecipeModalVisible(false);
  }}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  sectionHeaderContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#000', paddingVertical: 8, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#333' },
  sectionHeaderText: { fontSize: 14, fontWeight: '300', color: '#D3D3D3' },

  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#111' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', },
  itemRight: { marginLeft: 'auto'},
  iconLeft: { marginRight: 15, color: '#D3D3D3' },
  iconRight: { marginLeft: 'auto' },
  itemText: { marginRight: 'auto', fontSize: 16, color: '#D3D3D3' },
  amount: { marginLeft: 8, fontSize: 14, color: '#888', },
  itemTextGekauft: { textDecorationLine: 'line-through', color: '#888' },

  separator: { height: 1, backgroundColor: '#333' },

  snackbarContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, zIndex: 999 },
  snackbarText: { color: '#333', fontSize: 16 },
  snackbarAction: { color: '#f8b107', fontWeight: 'bold', marginLeft: 16 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#111', borderTopWidth: 1, borderTopColor: '#ccc', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, zIndex: 1000 },
  
  tabButton: { padding: 10 },
  tabText: { color: '#888', fontSize: 16 },
  tabTextActive: { color: '#f8b107', fontWeight: 'bold' },
  deleteButton: { backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 70, height: '100%', borderTopRightRadius: 8, borderBottomRightRadius: 8, },
});
