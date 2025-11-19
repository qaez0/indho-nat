import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { Text } from '@ui-kitten/components';
import Feather from '@react-native-vector-icons/feather';

export interface IDialogHelperProps {
  title: string;
  image: number; // require() returns number in React Native
  open: boolean;
  onClose: () => void;
}

const DialogHelper = ({ title, image, open, onClose }: IDialogHelperProps) => {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.content}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>
              {title}
            </Text>
            <View style={styles.imageContainer}>
              <Image 
                source={image} 
                style={styles.image} 
                resizeMode="contain" 
              />
            </View>
            <Text style={styles.note}>
              Note: Screenshots should look like this.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  dialog: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },
  content: {
    gap: 8,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    padding: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFFFFF',
    paddingRight: 32,
  },
  imageContainer: {
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    minHeight: 165,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    maxWidth: '100%',
    maxHeight: 150,
  },
  note: {
    textAlign: 'center',
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '400',
    color: '#FFFFFF',
  },
});

export default DialogHelper;
