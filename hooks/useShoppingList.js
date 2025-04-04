// hooks/useShoppingList.js
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { categories } from '../config/categories';
import { UNDO_TIMEOUT } from '../config/constants';

export function useShoppingList(initialList = []) {
  const [liste, setListe] = useState(initialList);
  const [undoItem, setUndoItem] = useState(null);
  const [showUndoBanner, setShowUndoBanner] = useState(false);
  const undoTimerRef = useRef(null);

  // addProduct: Nimmt NUR Namen, setzt Defaults und mengeWurdeGesetzt: false
  const addProduct = useCallback((productName) => {
    if (typeof productName !== 'string' || productName.trim() === '') return;
    const name = productName;
    const lowerName = name.toLowerCase();
    if (liste.some(item => item.name.toLowerCase() === lowerName)) {
      console.log(`Produkt "${name}" ist bereits auf der Liste.`);
      return;
    }
    let rubrik = 'Sonstiges';
    for (const [catName, products] of Object.entries(categories)) {
       if (products.includes(lowerName)) { rubrik = catName; break; }
    }
    const newItem = {
      id: Date.now().toString(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      gekauft: false, rubrik, menge: 1, einheit: 'Stück',
      mengeWurdeGesetzt: false, // Wichtig! Immer false hier.
    };
    console.log("addProduct (reverted) - Calling setListe with:", JSON.stringify(newItem));
    setListe(prev => [...prev, newItem]);
  }, [liste]);

  // togglePurchased: Bleibt wie es war
  const togglePurchased = useCallback((id) => { /* ... unverändert ... */
    let itemToUndo = null;
    setListe(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, gekauft: !item.gekauft };
          if (updatedItem.gekauft) itemToUndo = updatedItem;
          return updatedItem;
        }
        return item;
      })
    );
    if (itemToUndo) {
      setUndoItem(itemToUndo); setShowUndoBanner(true);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      undoTimerRef.current = setTimeout(() => {
        setShowUndoBanner(false); setUndoItem(null); undoTimerRef.current = null;
      }, UNDO_TIMEOUT);
    }
   }, []);

  // undoPurchase: Bleibt wie es war
  const undoPurchase = useCallback(() => { /* ... unverändert ... */
    if (!undoItem) return;
    setListe(prev =>
      prev.map(item => (item.id === undoItem.id ? { ...item, gekauft: false } : item))
    );
    setShowUndoBanner(false); setUndoItem(null);
    if (undoTimerRef.current) { clearTimeout(undoTimerRef.current); undoTimerRef.current = null; }
   }, [undoItem]);

  // updateProduct: Bleibt wie es war (einfaches Update)
  const updateProduct = useCallback((updatedItem) => {
    console.log("updateProduct called with:", JSON.stringify(updatedItem));
    setListe(prev =>
      prev.map(p => (p.id === updatedItem.id ? { ...p, ...updatedItem } : p))
    );
  }, []);

  // useEffect für Timer Cleanup: Bleibt
  useEffect(() => { /* ... unverändert ... */
    return () => { if (undoTimerRef.current) clearTimeout(undoTimerRef.current); };
   }, []);

  // sections: Bleibt wie es war
  const sections = useMemo(() => { /* ... unverändert ... */
    const purchased = liste.filter(item => item.gekauft);
    const notPurchased = liste.filter(item => !item.gekauft);
    const grouped = notPurchased.reduce((acc, product) => {
         const key = product.rubrik || 'Sonstiges';
         if (!acc[key]) acc[key] = [];
         acc[key].push(product);
         return acc;
    }, {});
    let sec = Object.keys(grouped)
         .map(catName => ({ title: catName, data: grouped[catName] }))
         .sort((a, b) => a.title.localeCompare(b.title));
    if (purchased.length > 0) {
         sec.push({ title: 'GEKAUFTE PRODUKTE', data: purchased });
    }
    return sec;
   }, [liste]);

  return {
    liste, addProduct, togglePurchased, updateProduct,
    undoItem, showUndoBanner, undoPurchase, sections
  };
}