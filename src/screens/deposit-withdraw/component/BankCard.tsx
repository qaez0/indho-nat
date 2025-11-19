import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Icon } from '@ui-kitten/components';
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import { useTranslation } from "react-i18next";

interface IBankCard {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

const BankCard = ({ bankName, accountName, accountNumber }: IBankCard) => {
  // const { t } = useTranslation();
  const fields = [
    { label: "Bank Name", value: bankName },
    { label: "Account Name", value: accountName },
    { label: "Account Number", value: accountNumber },
  ];

  return (
    <View style={styles.container}>
      {fields.map((field, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.text}>{field.label}</Text>
          <Text style={styles.text}>{field.value}</Text>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              // navigator.clipboard.writeText(field.value);
            }}
          >
            {/* <Icon name="copy-outline" style={styles.icon} /> */}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default BankCard;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "#2E4F62",
    borderRadius: 8,
    gap: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
    width: 100,
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 15,
    width: 15,
    borderRadius: 7.5,
    backgroundColor: "#F3B867",
  },
  icon: {
    fontSize: 10,
    color: "#FFFFFF",
  },
});
