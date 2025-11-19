import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import Feather from '@react-native-vector-icons/feather';

interface AccordionItem {
  title?: string;
  details: string;
}

interface AccordionProps {
  data?: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ data = [] }) => {
  const theme = useTheme();
  const [expandedItems, setExpandedItems] = useState<boolean[]>(
    new Array(data?.length || 0).fill(true)
  );

  const handleToggle = (index: number) => {
    setExpandedItems(prev => 
      prev.map((expanded, i) => i === index ? !expanded : expanded)
    );
  };

  // Early return if no data
  if (!data || data.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={[styles.noDataText, { color: theme['text-basic-color'] }]}>
          No information available at the moment.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={[styles.accordionItem, { backgroundColor: '#232323' }]}>
          <TouchableOpacity
            onPress={() => handleToggle(index)}
            style={styles.header}
          >
            <Text style={styles.title}>
              {item.title && `${index + 1}. `}{item.title}
            </Text>
            <Feather
              name={expandedItems[index] ? "chevron-down" : "chevron-right"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
          
          {expandedItems[index] && (
            <View style={styles.content}>
              <Text style={[styles.details, { color: 'rgba(255, 255, 255, 0.6)' }]}>
                {item.details.trim()}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  noDataContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
  },
  accordionItem: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
    color: 'white',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#232323',
    alignItems: 'flex-start',
  },
  details: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
    writingDirection: 'ltr',
  },
});

export default Accordion;
