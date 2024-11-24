// Notif.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { applyFontStyle, FONTS } from './GlobalStyles';

const Notif = ({ visible, onClose }) => {
  const navigation = useNavigation();

  const handleLogin = () => {
    onClose();
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    onClose();
    navigation.navigate('Register');
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/lonceng.png')} // Pastikan path ini benar
              style={styles.image}
            />
          </View>
          <Text style={applyFontStyle(styles.title, { fontFamily: FONTS.bold })}>Login Required</Text>
          <Text style={applyFontStyle(styles.message, { fontFamily: FONTS.regular })}>
            You need to login or register to use the bookmark feature
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={applyFontStyle(styles.buttonText, { fontFamily: FONTS.regular })}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={applyFontStyle(styles.buttonText, { fontFamily: FONTS.regular })}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={applyFontStyle(styles.cancelButtonText, { fontFamily: FONTS.medium })}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: '76%',
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#672CBC',
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: '#672CBC',
    marginTop: 20,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    textAlign: 'center',
  },
  cancelButton: {
    width: '90%',
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#956bd0',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Notif;