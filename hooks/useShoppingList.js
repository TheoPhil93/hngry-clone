// hooks/useShoppingList.js
import { useState } from 'react';

export default function useShoppingList(initialList = []) {
  const [liste, setListe] = useState(initialList);

  const addProduct = (product) => {
    setListe(prev => [...prev, product]);
  };

  const updateProduct = (updatedProduct) => {
    setListe(prev =>
      prev.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p)
    );
  };

  return { liste, addProduct, updateProduct };
}
