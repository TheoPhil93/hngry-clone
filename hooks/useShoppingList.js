// hooks/useShoppingList.js
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { categories } from '../config/categories';
import { UNDO_TIMEOUT } from '../config/constants';

export function useShoppingList(initialList = []) {
  const [liste, setListe] = useState(initialList);
  const [undoItem, setUndoItem] = useState(null);
  const [showUndoBanner, setShowUndoBanner] = useState(false);
  const undoTimerRef = useRef(null);

  // Produkt hinzufügen (handhabt Strings und Objekte)
  const addProduct = useCallback((productDataOrItem) => {
    console.log("addProduct - Received:", JSON.stringify(productDataOrItem));

    let newItemData = {};
    let name = '';
    let mengeWurdeGesetzt = false; // Default für Flag

    // Prüfe, ob wir nur einen Namen oder ein ganzes Item-Objekt bekommen haben
    if (typeof productDataOrItem === 'string') {
      // --- Fall 1: Nur Name bekommen (z.B. einfacher Suggestion-Click) ---
      name = productDataOrItem;
      if (!name || name.trim() === '') { console.error("addProduct: Empty name string received"); return; }
      mengeWurdeGesetzt = false; // Menge wurde NICHT explizit gesetzt

    } else if (typeof productDataOrItem === 'object' && productDataOrItem.name) {
      // --- Fall 2: Objekt bekommen (z.B. von Rezeptimport oder AddModal) ---
      name = productDataOrItem.name;
      if (!name || name.trim() === '') { console.error("addProduct: Empty name in object received", JSON.stringify(productDataOrItem)); return; }
      // Wenn Objekt kommt, wurde Menge explizit gesetzt (entweder im Modal oder vom Parser)
      mengeWurdeGesetzt = true;

    } else {
      console.log("addProduct - Invalid input:", JSON.stringify(productDataOrItem));
      return;
    }

    // --- Gemeinsame Logik für beide Fälle ---
    const lowerName = name.toLowerCase(); // Kleinschreibung für Vergleiche verwenden!
    if (liste.some(item => item.name.toLowerCase() === lowerName)) {
       console.log(`Produkt "${name}" ist bereits auf der Liste.`);
       return; // Abbruch bei Duplikat
    }

    // Rubrik bestimmen (mit lowerName!)
    let rubrik = 'Sonstiges';
    console.log(`addProduct: Looking for category for '${lowerName}'`);
    // Stelle sicher, dass categories importiert wurde!
    for (const [catName, products] of Object.entries(categories)) {
       if (products.includes(lowerName)) {
           rubrik = catName;
           console.log(`addProduct: Found category '${catName}' for '${lowerName}'`);
           break;
       }
    }
    if (rubrik === 'Sonstiges') {
        console.log(`addProduct: No category found for '${lowerName}', defaulting to 'Sonstiges'.`);
    }

    // Erstelle newItemData basierend auf dem Typ der Eingabe
    newItemData = {
      id: (typeof productDataOrItem === 'object' ? productDataOrItem.id : null) || Date.now().toString(),
      // WICHTIG: Formatiere den Namen HIER, nachdem die Kategorie bestimmt wurde
      name: name.charAt(0).toUpperCase() + name.slice(1), // Namen verwenden, der für Kategorie-Suche genutzt wurde
      gekauft: false,
      rubrik: rubrik, // Bestimmte Rubrik
      // Menge/Einheit aus Objekt nehmen ODER Defaults setzen
      menge: (typeof productDataOrItem === 'object' ? productDataOrItem.menge : 1) ?? 1,
      einheit: (typeof productDataOrItem === 'object' ? productDataOrItem.einheit : 'Stück') ?? 'Stück',
      note: (typeof productDataOrItem === 'object' ? productDataOrItem.note : null) ?? null, // Notiz übernehmen/default
      mengeWurdeGesetzt: mengeWurdeGesetzt, // Korrektes Flag setzen
    };

    console.log("addProduct - Constructed newItemData:", JSON.stringify(newItemData));
    setListe(prev => [...prev, newItemData]);

  }, [liste]);

  // Kaufstatus umschalten
  const togglePurchased = useCallback((id) => {
    let itemToUndo = null;
    setListe(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { 
          ...item, 
          gekauft: !item.gekauft 
        };
        if (updatedItem.gekauft) itemToUndo = updatedItem;
        return updatedItem;
      }
      return item;
    }));

    if (itemToUndo) {
      setUndoItem(itemToUndo);
      setShowUndoBanner(true);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      undoTimerRef.current = setTimeout(() => {
        setShowUndoBanner(false);
        setUndoItem(null);
        undoTimerRef.current = null;
      }, UNDO_TIMEOUT);
    }
  }, []);

  // Kauf rückgängig machen
  const undoPurchase = useCallback(() => {
    if (!undoItem) return;
    setListe(prev => prev.map(item => 
      item.id === undoItem.id ? { ...item, gekauft: false } : item
    ));
    setShowUndoBanner(false);
    setUndoItem(null);
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
  }, [undoItem]);

  // Produkt aktualisieren
  const updateProduct = useCallback((updatedItem) => {
    setListe(prev => prev.map(item => 
      item.id === updatedItem.id 
        ? { ...item, ...updatedItem, mengeWurdeGesetzt: true }
        : item
    ));
  }, []);

  // Timer cleanup
  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  // Gruppierte Liste erstellen
  const sections = useMemo(() => {
    const purchased = liste.filter(item => item.gekauft);
    const notPurchased = liste.filter(item => !item.gekauft);

    const grouped = notPurchased.reduce((acc, item) => {
      const key = item.rubrik;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([title, data]) => ({ title, data }))
      .sort((a, b) => a.title.localeCompare(b.title))
      .concat(purchased.length > 0 ? [{ 
        title: 'GEKAUFTE PRODUKTE', 
        data: purchased 
      }] : []);
  }, [liste]);

  return {
    liste,
    addProduct,
    togglePurchased,
    updateProduct,
    undoItem,
    showUndoBanner,
    undoPurchase,
    sections
  };
}