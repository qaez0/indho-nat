import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Icon } from '@ui-kitten/components';
import React from "react";

export interface IPartnerBtnProps {
  icon: React.ReactNode;
  label: string | React.ReactNode;
  onClick: () => void;
  isActive: boolean;
  isDisabled?: boolean;
}
const PartnerBtn = ({
  icon,
  label,
  onClick,
  isActive,
  isDisabled,
}: IPartnerBtnProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isDisabled && { opacity: 0.5, pointerEvents: "none" },
      ]}
      onPress={isDisabled ? undefined : onClick}
    >
      <View
        style={[
          styles.boxContainer,
          isActive && styles.activeBoxContainer,
        ]}
      >
        {icon}
      </View>
      {typeof label === "string" ? (
        <Text style={[styles.label, !isActive && { fontWeight: "400" }]}>
          {label}
        </Text>
      ) : (
        label
      )}
    </TouchableOpacity>
  );
};

export default PartnerBtn;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
    padding: 5,
  },
  boxContainer: {
    backgroundColor: "#272727",
    borderRadius: 8,
    height: 50,
    width: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  activeBoxContainer: {
    backgroundColor: "#F3B867",
  },
  label: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
