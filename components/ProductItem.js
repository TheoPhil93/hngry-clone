// components/ProductItem.js
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// === Styles importieren! ===
import { styles, colors } from '../styles';

// === Korrekte Props erwarten! ===
const ProductItem = React.memo(({ item, onTogglePurchased, iconMapping, onOpenMengeModal }) => {
  console.log(`ProductItem rendering ${item.name} - mengeWurdeGesetzt: ${item.mengeWurdeGesetzt}`);
  const iconName = iconMapping[item.name.toLowerCase()] || 'food-variant';
  const itemStyle = item.gekauft ? styles.itemTextGekauft : styles.itemText;
  const iconColor = item.gekauft ? colors.textGekauft : colors.text;

  return (
    <View style={styles.itemRow}>

      {/* === Linke Seite: Schaltet Kaufstatus um === */}
      <TouchableOpacity
        style={styles.itemLeft}
        onPress={() => onTogglePurchased(item.id)}
        activeOpacity={0.7}
        testID={`product-item-toggle-${item.id}`}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={iconColor}
          style={styles.iconLeft}
        />
        <Text style={[itemStyle, { flexShrink: 1 }]}>
          {item.name}
        </Text>
      </TouchableOpacity>

      {/* === Rechte Seite: Zeigt Menge/Separator an und öffnet Modal via Pfeil === */}
      <View style={styles.itemRight}>
          {/* Wrapper für Menge und Separator */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

          {item.mengeWurdeGesetzt && (
            <>
              {/* Menge/Einheit */}
                <Text style={[styles.amount, item.gekauft && { color: colors.textGekauft }]}>
                   {item.menge} {item.einheit}
                 </Text>
              
              {/* Vertikaler Trennstrich */}
              <View style={styles.verticalSeparator} /> 
            </>
          )}

          </View>
          {/* Pfeil-Icon */}
          <TouchableOpacity
            onPress={onOpenMengeModal}
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