import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProductItem = React.memo(({ item, toggleGekauft, iconMapping, styles }) => {
  const iconName = iconMapping[item.name.toLowerCase()] || 'cart-outline';
  const backgroundColor = item.gekauft ? '#000' : '#111';

  return (
    <TouchableOpacity onPress={() => toggleGekauft(item.id)}>
      <View style={[styles.itemRow, { backgroundColor }]}>
        {/* Linke Seite */}
        <View style={styles.itemLeft}>
          <MaterialCommunityIcons
            name={iconName}
            size={24}
            color={item.gekauft ? '#555' : '#D3D3D3'}
            style={styles.iconLeft}
          />
          <Text style={[styles.itemText, item.gekauft && styles.itemTextGekauft]}>
            {item.name}
          </Text>
          <Text style={styles.amount}>{item.amount}</Text>
        </View>

        {/* Rechte Seite */}
        <View style={styles.itemRight}>
          {item.gekauft ? (
            <MaterialCommunityIcons
              name="check-bold"
              size={20}
              color="#f8b107"
            />
          ) : (
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#888"
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default ProductItem;
