import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Input, Text } from '@ui-kitten/components';
import type { Dispatch } from 'react';
import ButtonOption from './ButtonOption';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '../../hooks/useDebounce';
import { SlotFilterAction, SlotFilterState } from '../../hooks/useSlots';
import { optionProps } from '../../constants/slots';
import Feather from '@react-native-vector-icons/feather';
import { navigationRef } from '../../utils/navigation';

interface GameFilterProps {
  dispatch: Dispatch<SlotFilterAction>;
  state: SlotFilterState;
  options: optionProps[];
  nonScrollable?: boolean;
  isLoading?: boolean;
  initialFilterState: SlotFilterState;
}

const GameFilter = ({
  dispatch,
  state,
  options,
  nonScrollable = false,
  isLoading = false,
  initialFilterState,
}: GameFilterProps) => {
  const { game_id } = state;
  const [searchValue, setSearchValue] = useState(state.name);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { t } = useTranslation();

  useEffect(() => {
    const currentState = {
      game_id: state.game_id,
      name: state.name,
      page: state.page,
    };
    const unsubscribe = navigationRef.addListener('state', () => {
      if (
        currentState.game_id !== '' ||
        currentState.name !== '' ||
        currentState.page !== 1
      ) {
        dispatch({ type: 'RESET_FILTER', payload: initialFilterState });
        setSearchValue('');
      }
    });
    return unsubscribe;
  }, [dispatch, initialFilterState, state.game_id, state.name, state.page]);

  useEffect(() => {
    dispatch({ type: 'SET_NAME', payload: debouncedSearchValue });
  }, [debouncedSearchValue, dispatch]);

  const handleProviderClick = (provider: string) => {
    dispatch({ type: 'SET_GAME_ID', payload: provider });
  };

  const handleSearch = (text: string) => {
    setSearchValue(text);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    dispatch({ type: 'SET_NAME', payload: '' });
  };

  const isSearching = isLoading && searchValue !== '';
  const hasSearchValue = searchValue !== '';
  
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: '700' }} category="s1">
        {t('content-title.all-games').toUpperCase()}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          ...(nonScrollable && { width: '100%' }),
          ...styles.optionsContent,
        }}
      >
        {options.map((opt, index) => (
          <ButtonOption
            key={index}
            title={opt.label}
            icon={opt.image}
            onClick={() => handleProviderClick(opt.value)}
            isActive={game_id === opt.value}
            customStyle={{ ...(nonScrollable && { flex: 1 }) }}
          />
        ))}
      </ScrollView>
      <Input
        placeholder={t('content-title.search-for-games')}
        onChangeText={handleSearch}
        value={searchValue}
        textStyle={{ marginLeft: -10 }}
        accessoryLeft={<Feather name="search" size={18} color="white" />}
        accessoryRight={
          isSearching ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : hasSearchValue ? (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Feather name="x" size={18} color="white" />
            </TouchableOpacity>
          ) : undefined
        }
      />
    </View>
  );
};

export default GameFilter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
  },
  optionsContent: {
    paddingHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    display: 'flex',
  },
  clearButton: {
    padding: 4,
  },
});
