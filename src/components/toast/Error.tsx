import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { ToastConfigParams } from 'react-native-toast-message';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const Error = ({ text1, text2 }: ToastConfigParams<any>) => {
  const hasUndefined = text1 === undefined || text2 === undefined;
  return (
    <View style={styles.mainContainer}>
      <View
        style={{
          ...styles.container,
          paddingVertical: hasUndefined ? 15 : 5,
        }}
      >
        <FontAwesome6
          name="circle-exclamation"
          iconStyle="solid"
          size={24}
          color="#e71019"
        />
        <View style={styles.textContainer}>
          {text1 && (
            <Text 
              category="c1" 
              style={{ color: '#e71019' }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {text1}
            </Text>
          )}
          {text2 && (
            <Text 
              category="c2" 
              style={{ color: '#e71019' }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {text2}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default Error;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  container: {
    minHeight: 56,
    width: '100%',
    borderWidth: 2,
    borderColor: '#ffe0e1',
    backgroundColor: '#ffeff0',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
  },
});
