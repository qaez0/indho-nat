import { StyleSheet, View } from 'react-native';
// import { Text } from '@ui-kitten/components';
import { Text } from 'react-native'
import { ToastConfigParams } from 'react-native-toast-message';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const Success = ({ text1, text2 }: ToastConfigParams<any>) => {
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
          name="circle-check"
          iconStyle="solid"
          size={18}
          color="#008a2e"
        />
        <View style={styles.textContainer}>
          {text1 && (
            <Text 
              style={{ color: '#008a2e' }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {text1}
            </Text>
          )}
          {text2 && (
            <Text 
              style={{ color: '#008a2e' }}
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

export default Success;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  container: {
    minHeight: 40,
    width: '100%',
    borderWidth: 2,
    borderColor: '#bffdd9',
    backgroundColor: '#bffdd9',
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
    gap: 0,
    flex: 1,
  },
});
