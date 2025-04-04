// styles.js
import { StyleSheet } from 'react-native';

// Definiere das colors-Objekt
export const colors = {
  primary: '#f8b107', // Gelb/Orange
  background: '#000',
  surface: '#111', // Etwas helleres Schwarz für Elemente
  text: '#D3D3D3', // Helles Grau für Text
  textSecondary: '#888', // Dunkleres Grau für sekundären Text/Icons
  textGekauft: '#555', // Grau für durchgestrichenen Text
  separator: '#333',
  white: '#fff',
  black: '#000',
  red: 'red',
  snackbarBackground: '#fff',
  snackbarText: '#333',
};

// Definiere und exportiere das styles-Objekt
export const styles = StyleSheet.create({
  // --- Container ---
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
     flex: 1,
  },
  centered: { // Style für den Vorrat-Platzhalter
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- ProductList / SuggestionList ---
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: colors.separator,
    borderTopWidth: 1,
    borderTopColor: colors.separator,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.text, 
    textTransform: 'uppercase',
  },
  separator: { // Wird für ItemSeparatorComponent verwendet
    height: 1,
    backgroundColor: colors.separator,
    marginHorizontal: 16,
  },
  verticalSeparator: {
    height: '30', // Höhe relativ zur Zeilenhöhe (anpassen bei Bedarf)
    width: 1, // Dicke des Strichs
    backgroundColor: colors.separator, // Farbe des Strichs (aus deinen Farben)
    marginHorizontal: 10, // Horizontaler Abstand links und rechts vom Strich
  },

  // --- ProductItem / SuggestionItem ---
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  itemRight: {
    flexDirection: 'row', // Gruppe (Menge+Strich) und Pfeil nebeneinander
    alignItems: 'center', // Vertikal zentrieren
  },
  iconLeft: {
    marginRight: 15,
  },
  itemText: { // Hier wird styles.text.color verwendet
    fontSize: 16,
    color: colors.text,
    flexShrink: 1,
  },
  itemTextGekauft: {
    textDecorationLine: 'line-through',
    color: colors.textGekauft,
  },
  amount: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
   // --- Suggestion Item spezifisch ---
   suggestionAddIcon: {},

  // --- Undo Banner ---
  snackbarContainer: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    right: 10,
    backgroundColor: colors.snackbarBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    zIndex: 999,
    borderRadius: 4,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  snackbarText: { // Hier wird styles.snackbarText.color verwendet
    color: colors.snackbarText,
    fontSize: 16,
    flexShrink: 1,
    marginRight: 10,
  },
  snackbarAction: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    paddingLeft: 10,
  },

  // --- Bottom Tab Bar ---
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.separator,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    zIndex: 1000,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  tabText: { // Hier wird styles.tabText.color verwendet
    color: colors.textSecondary,
    fontSize: 16,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});