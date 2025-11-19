import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useTranslation } from "react-i18next";

const Note = () => {
  const { t } = useTranslation();
  const noteItems = t("kyc.note.items", { returnObjects: true }) as Array<{
    title: string;
    description: string[];
  }>;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        {t("kyc.note.header.title")}{" "}
        <Text style={styles.italicText}>{t("kyc.note.header.description")}</Text>
      </Text>
      {noteItems.map((item, index) => (
        <NoteItem
          key={index}
          title={item.title}
          description={item.description}
        />
      ))}
      <Text style={[styles.footerText, styles.italicText]}>
        {t("kyc.note.footer")}
      </Text>
    </View>
  );
};

export default Note;

interface IProps {
  title: string;
  description: string[];
}

const NoteItem = ({ title, description }: IProps) => {
  return (
    <View style={styles.noteItem}>
      <Text style={[styles.noteTitle, styles.italicText]}>
        {title}
      </Text>
      <View style={styles.noteDescriptions}>
        {description.map((item, index) => (
          <Text key={index} style={[styles.noteDescription, styles.italicText]}>
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingBottom: 32,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  italicText: {
    fontStyle: 'italic',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  noteItem: {
    gap: 4,
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  noteDescriptions: {
    paddingLeft: 10,
    gap: 8,
  },
  noteDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FFFFFF',
  },
});
