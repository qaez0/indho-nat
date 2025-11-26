import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import type { IBlog } from '../../../types/blogs';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { BlogNav } from '../../../types/nav';
import { useReducer } from 'react';
import LottieView from 'lottie-react-native';
import lottieJson from '../../../assets/loader.json';
import Logo from '../../../assets/logo.svg';

type ArticleCardState = {
  imageLoading: boolean;
  imageError: boolean;
};

type ArticleCardAction =
  | { type: 'SET_IMAGE_LOADING'; payload: boolean }
  | { type: 'SET_IMAGE_ERROR'; payload: boolean };

const initialState: ArticleCardState = {
  imageLoading: true,
  imageError: false,
};

const articleCardReducer = (
  state: ArticleCardState,
  action: ArticleCardAction,
): ArticleCardState => {
  switch (action.type) {
    case 'SET_IMAGE_LOADING':
      return { ...state, imageLoading: action.payload };
    case 'SET_IMAGE_ERROR':
      return { ...state, imageError: action.payload };
    default:
      return state;
  }
};

const ArticleCard = ({
  title,
  image,
  styles,
  id,
  category,
}: IBlog & { styles?: ViewStyle }) => {
  const navigation = useNavigation<BlogNav>();
  const [state, dispatch] = useReducer(articleCardReducer, initialState);

  return (
    <TouchableOpacity
      style={[style.container, styles]}
      onPress={() => {
        navigation.navigate('specific-blog', {
          articleId: id.toString(),
        });
      }}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: image }}
        style={[style.image, { display: state.imageError ? 'none' : 'flex' }]}
        resizeMode="cover"
        onLoad={() => dispatch({ type: 'SET_IMAGE_LOADING', payload: false })}
        onError={() => {
          console.error('Image load error');
          dispatch({ type: 'SET_IMAGE_LOADING', payload: false });
          dispatch({ type: 'SET_IMAGE_ERROR', payload: true });
        }}
      />

      {state.imageLoading && (
        <View style={style.loadingOverlay}>
          <LottieView source={lottieJson} autoPlay loop style={style.lottie} />
        </View>
      )}

      {state.imageError && (
        <View style={style.errorOverlay}>
          <Logo />
        </View>
      )}

      <View style={style.content}>
        <Text style={style.title} numberOfLines={2} category="s1">
          {title}
        </Text>
      </View>
      <LinearGradient
        locations={[0, 0.3, 1]}
        colors={['transparent', '#00000020', '#000000']}
        style={[StyleSheet.absoluteFillObject]}
      />
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 0,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    zIndex: 1,
  },
  title: {
    fontFamily: 'var(--font-roboto)',
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 2,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  lottie: {
    width: 80,
    aspectRatio: 1,
  },
});

export default ArticleCard;
