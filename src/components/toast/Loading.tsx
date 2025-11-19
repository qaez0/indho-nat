import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { ToastConfigParams } from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native';

const Loading = ({ text1, text2 }: ToastConfigParams<any>) => {
  const hasUndefined = text1 === undefined || text2 === undefined;

  return (
    <View style={styles.mainContainer}>
      <View
        style={{ ...styles.container, paddingVertical: hasUndefined ? 15 : 5 }}
      >
        <ActivityIndicator size="small" color="black" />
        <View style={styles.textContainer}>
          {text1 && (
            <Text 
              category="p1" 
              style={{ color: 'black' }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {text1}
            </Text>
          )}
          {text2 && (
            <Text 
              category="c2" 
              style={{ color: 'black' }}
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

export default Loading;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  container: {
    minHeight: 56,
    width: '100%',
    borderWidth: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderColor: '#ededed',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
  },
});
