// hooks/useUIState.js
import { useState, useRef, useCallback } from 'react';
import { Animated } from 'react-native';

export function useUIState(initialTab = 'einkaufsliste') {
  const [suche, setSuche] = useState(''); // Original setSuche
  const [listName] = useState('Meine Einkaufsliste');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [showMengeModal, setShowMengeModal] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);

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

  // Interne Handler für Modals
  const handleOpenMengeModal = useCallback((item) => {
    setSelectedItemForModal(item);
    setShowMengeModal(true);
  }, []);
  const handleCloseMengeModal = useCallback(() => {
    setShowMengeModal(false);
    setSelectedItemForModal(null);
  }, []);
  const handleOpenRecipeModal = useCallback(() => { setRecipeModalVisible(true); }, []);
  const handleCloseRecipeModal = useCallback(() => { setRecipeModalVisible(false); }, []);

  // Return-Block (vereinfacht)
  return {
    suche,
    setSuche, // setSuche direkt zurückgeben
    listName,
    menuOpen,
    toggleMenu,
    slideAnim,
    selectedTab,
    setSelectedTab,
    recipeModalVisible,
    openRecipeModal: handleOpenRecipeModal,
    closeRecipeModal: handleCloseRecipeModal,
    showMengeModal,
    selectedItemForModal,
    openMengeModal: handleOpenMengeModal,
    closeMengeModal: handleCloseMengeModal,
  };
}