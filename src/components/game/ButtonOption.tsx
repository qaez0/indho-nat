import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text } from '@ui-kitten/components';

interface IButtonOption {
  title: string;
  icon?: ImageSourcePropType;
  onClick: () => void;
  isActive: boolean;
  customStyle?: any;
}

const ButtonOption = ({
  title,
  icon,
  onClick,
  isActive,
  customStyle,
}: IButtonOption) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        styles.button,
        isActive ? styles.activeButton : styles.inactiveButton,
        customStyle,
      ]}
      activeOpacity={0.7}
    >
      {icon ? (
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      ) : null}
      <Text style={styles.title} category="c1">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonOption;

const styles = StyleSheet.create({
  button: {
    padding: 0,
    margin: 0,
    borderRadius: 8,
    height: 74,
    width: 74,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    flexDirection: 'column',
    gap: 5,
    cursor: 'pointer',
  },
  activeButton: {
    borderWidth: 1,
    borderColor: '#f3b867',
    backgroundColor: '#212121',
  },
  inactiveButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#212121',
  },
  icon: {
    width: 70,
    height: 30,
    aspectRatio: 16 / 9,
  },
  title: {
    color: '#fff',
    fontSize: 10,
    lineHeight: 10,
  },
});
