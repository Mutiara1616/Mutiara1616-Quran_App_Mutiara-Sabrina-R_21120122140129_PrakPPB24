// GlobalStyles.js
import { StyleSheet } from 'react-native';

export const FONTS = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
};

export const GlobalStyles = StyleSheet.create({
  text: {
    fontFamily: FONTS.regular,
  },
  boldText: {
    fontFamily: FONTS.bold,
  },
  // Tambahkan variasi lain sesuai kebutuhan
});

// Fungsi helper untuk menggabungkan style
export const applyFontStyle = (baseStyle, additionalStyle = {}) => {
  return [GlobalStyles.text, baseStyle, additionalStyle];
};