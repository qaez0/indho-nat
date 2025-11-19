import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Icon } from '@ui-kitten/components';

interface IOptionBtnWebProps {
  label: string;
  icon: string;
  onClick: () => void;
  isDisabled: boolean;
  isActive: boolean;
  id: string;
}

const OptionBtnWeb = ({
  label,
  icon,
  onClick,
  isDisabled,
  isActive,
}: IOptionBtnWebProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isDisabled && styles.disabledButton,
        isActive && styles.activeButton,
      ]}
      disabled={isDisabled}
      onPress={onClick}
    >
      {/* <Icon name="credit-card-outline" style={styles.icon} /> */}
      <Text style={styles.buttonText}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default OptionBtnWeb;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, .1)",
    color: "#FFFFFF",
    height: 56,
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  activeButton: {
    backgroundColor: "rgba(243, 184, 103, .2)",
    borderColor: "#F3B867",
  },
  buttonText: {
    fontFamily: "var(--font-roboto)",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 8,
    color: "#FFFFFF",
  },
});
