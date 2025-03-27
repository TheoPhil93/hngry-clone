
import { SectionList, View } from 'react-native';
import ProductItem from './ProductItem';
import RecipeImportModal from './RecipeImportModal';
import React, { useState } from 'react';





const ProductList = ({ sections, toggleGekauft, iconMapping, styles, renderSectionHeader }) => {
const handleDeleteProduct = (product) => { setProducts((prev) => prev.filter((p) => p.id !== product.id)); };
const [recipeModalVisible, setRecipeModalVisible] = useState(false);

const importRecipe = async (link) => {
  const apiKey = b225b690d712481daffe2149c1aa5b13; 
  const url = `https://api.spoonacular.com/recipes/extract?apiKey=${apiKey}&url=${encodeURIComponent(link)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.extendedIngredients) {
      alert('Keine Zutaten gefunden.');
      return [];
    }

    // extrahiere Name + ID (optional: Menge)
    return data.extendedIngredients.map((ing) => ({
      id: ing.id?.toString() || ing.name + Math.random(),
      name: ing.name,
      amount: 1,
    }));
  } catch (err) {
    console.error('Fehler beim Import:', err);
    alert('Import fehlgeschlagen.');
    return [];
  }
};

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductItem 
        item={item} 
        toggleGekauft={toggleGekauft} 
        iconMapping={iconMapping} 
        styles={styles} />
      )}
      renderSectionHeader={renderSectionHeader}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={() => <View style={styles.separator} />}
      ListFooterComponent={() => <View style={styles.separator} />}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
    
  );
};

export default ProductList;
