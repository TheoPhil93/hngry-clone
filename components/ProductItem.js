// components/ProductItem.js
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles, colors } from '../styles'; // Importiert Styles direkt

// Erwartet korrekte Props von App.js -> ProductList
const ProductItem = React.memo(({ item, onTogglePurchased, iconMapping, onOpenMengeModal }) => {
  // Icon bestimmen (mit Fallback)
  const iconName = iconMapping[item.name.toLowerCase()] || 'food-variant';
  // Styles basierend auf 'gekauft'-Status
  const itemStyle = item.gekauft ? styles.itemTextGekauft : styles.itemText;
  const iconColor = item.gekauft ? colors.textGekauft : colors.text;

  return (
    <View style={styles.itemRow}>
      {/* === Linke Seite: Schaltet Kaufstatus um === */}
      <TouchableOpacity
        style={styles.itemLeft}
        onPress={() => onTogglePurchased(item.id)} // Nutzt onTogglePurchased
        activeOpacity={0.7}
        testID={`product-item-toggle-${item.id}`}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={iconColor}
          style={styles.iconLeft}
        />
        {/* Wrapper für Name und Notiz */}
        <View style={{ flexShrink: 1, flexDirection: 'column' }}>
            <Text style={[itemStyle]}>
              {item.name}
            </Text>
            {/* Notiz anzeigen, falls vorhanden */}
            {item.note && (
                <Text style={styles.itemNote}>
                    {item.note}
                </Text>
            )}
        </View>
      </TouchableOpacity>

      {/* === Rechte Seite: Zeigt Menge/Separator an und öffnet Modal via Pfeil === */}
      <View style={styles.itemRight}>
          {/* Wrapper für Menge und Separator */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Menge/Einheit anzeigen, wenn Flag gesetzt ist */}
              {item.mengeWurdeGesetzt && (
                <Text style={[styles.amount, item.gekauft && { color: colors.textGekauft }]}>
                   {item.menge} {item.einheit}
                 </Text>
              )}
              {/* Vertikaler Trennstrich (immer sichtbar, wenn Menge gesetzt?) -> Ja, oder nur wenn Menge != 1 Stück? Aktuell immer wenn Flag true */}
               {item.mengeWurdeGesetzt && ( // Nur anzeigen, wenn Menge gesetzt wurde
                  <View style={styles.verticalSeparator} />
               )}
          </View>
          {/* Pfeil-Icon zum Öffnen des Modals */}
          <TouchableOpacity
            onPress={onOpenMengeModal} // Nutzt onOpenMengeModal
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID={`product-item-details-${item.id}`}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={28}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
      </View>
    </View>
  );
});

export default ProductItem;