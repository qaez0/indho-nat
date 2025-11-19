import { Button, Layout, Text } from '@ui-kitten/components';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

interface AddBtnProps {
  onAdd: () => void;
  text: string;
}

const AddBtn = ({ onAdd, text }: AddBtnProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onAdd}>
      <View style={styles.subContainer}>
        <Feather name="plus" size={24} color="white" />
        <Text category="s1" style={{ color: 'white' }}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddBtn;

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    backgroundColor: 'transparent',
    minHeight: 56,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderStyle: 'dashed',
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
});
