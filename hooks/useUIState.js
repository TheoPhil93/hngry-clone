// hooks/useUIState.js
import { useState, useRef, useCallback } from 'react';
import { Animated } from 'react-native';

export function useUIState(initialTab = 'einkaufsliste') {
  const [suche, _setSuche] = useState('');
  const [listName] = useState('Meine Einkaufsliste');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [showMengeModal, setShowMengeModal] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [selectedSuggestionName, setSelectedSuggestionName] = useState(null);

  // Drawer Animation
  const drawerWidth = 250;
  const slideAnim = useRef(new Animated.Value(-drawerWidth)).current;

  const toggleMenu = useCallback(() => {
    const toValue = menuOpen ? -drawerWidth : 0;
    Animated.timing(slideAnim, { toValue, duration: 300, useNativeDriver: true }).start(() => {
      if (toValue === -drawerWidth) setMenuOpen(false);
    });
    if (toValue === 0) setMenuOpen(true);
  }, [menuOpen, slideAnim]);

  // === KORREKT: Wrapper für setSuche ===
  // === NEU: Wrapper Funktion für setSuche ===
  const setSuche = useCallback((value) => {
    // LOG 3: Wird die State-Update-Funktion aufgerufen?
    console.log('useUIState: setSuche called with:', value);
    _setSuche(value); // Rufe den originalen Setter auf
}, []);

  const handleSetSuche = useCallback((text) => {
      setSuche(text);
      setSelectedSuggestionName(null); 
  }, []); 
  const handleOpenMengeModal = useCallback((item) => {
    setSelectedItemForModal(item);
    setShowMengeModal(true);
  }, []);
  const handleCloseMengeModal = useCallback(() => {
    setShowMengeModal(false);
    setSelectedItemForModal(null);
  }, []);
  const handleOpenRecipeModal = useCallback(() => {
    setRecipeModalVisible(true);
  }, []);
  const handleCloseRecipeModal = useCallback(() => {
    setRecipeModalVisible(false);
  }, []);
  const handleSelectSuggestion = useCallback((name) => {
      setSelectedSuggestionName(name);
  }, []);


  // === KORREKTER Return-Block mit handleSetSuche etc. ===
  return {
    suche,
    // handleSetSuche, 
    setSuche: setSuche,
    listName,
    menuOpen,
    toggleMenu,
    slideAnim,
    selectedTab,
    setSelectedTab,
    recipeModalVisible,
    openRecipeModal: handleOpenRecipeModal,   // Umbenannt
    closeRecipeModal: handleCloseRecipeModal, // Umbenann
    showMengeModal,
    selectedItemForModal,
    openMengeModal: handleOpenMengeModal,     // Umbenannt
    closeMengeModal: handleCloseMengeModal,   // Umbenannt
    selectedSuggestionName,                  // Neu
    handleSelectSuggestion,                  // Neu
  };
}