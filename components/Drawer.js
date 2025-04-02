import React from 'react';
import { TouchableOpacity, Animated, StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Drawer = ({ menuOpen, toggleMenu, slideAnim }) => {
  if (!menuOpen) return null;
  return (
    <>
      <TouchableOpacity style={drawerStyles.overlay} onPress={toggleMenu} activeOpacity={1} />
      <Animated.View style={[drawerStyles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <TouchableOpacity onPress={toggleMenu} style={drawerStyles.closeButton}>
          <MaterialCommunityIcons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={drawerStyles.drawerText}>Einstellungen</Text>
      </Animated.View>
    </>
  );
};

const drawerStyles = StyleSheet.create({
  drawer: { position: 'absolute', top: 0, left: 0, width: 250, height: '100%', backgroundColor: '#222', padding: 20, zIndex: 10 },
  drawerText: { color: '#fff', fontSize: 18, marginBottom: 20 },
  closeButton: { alignSelf: 'flex-end', marginTop: 20, marginBottom: 20 },
  overlay: { position: 'absolute', top: 0, left: 250, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0)', zIndex: 5 },
});

export default Drawer;
