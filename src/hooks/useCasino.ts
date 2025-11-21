import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCasinoGames } from '../services/casino.service';
import type {
  ICategorizedGames,
  ICasinoProvider,
  LiveCasino,
  GameCategory,
} from '../types/casino';
import { ISlot } from '../types/slot';

export const useCasino = () => {
  const { t } = useTranslation();
  const [selectedProvider, setSelectedProvider] = useState<LiveCasino>('all');
  const [categorizedGames, setCategorizedGames] = useState<ICategorizedGames>({
    BACCARAT: { title: 'BACCARAT', games: [] },
    BLACKJACK: { title: 'BLACKJACK', games: [] },
    ROULETTE: { title: 'ROULETTE', games: [] },
    TEENPATTI: { title: 'TEEN PATTI', games: [] },
    DICE: { title: 'DICE', games: [] },
    POKER: { title: 'POKER', games: [] },
    OTHERS: { title: 'OTHERS', games: [] },
  });

  const { isLoading, isRefetching, error, data, isPending } = useQuery({
    queryKey: ['casino', selectedProvider],
    queryFn: async () => {
      const response = await getCasinoGames(selectedProvider);
      return response;
    },
  });

  useEffect(() => {
    if (!data) return;

    const newCategorizedGames: ICategorizedGames = {
      BACCARAT: { title: 'BACCARAT', games: [] },
      BLACKJACK: { title: 'BLACKJACK', games: [] },
      ROULETTE: { title: 'ROULETTE', games: [] },
      TEENPATTI: { title: 'TEEN PATTI', games: [] },
      DICE: { title: 'DICE', games: [] },
      POKER: { title: 'POKER', games: [] },
      OTHERS: { title: 'OTHERS', games: [] },
    };

    // The correct data structure: data.data.data
    const games = data.data.data;

    if (!games || games.length === 0) {
      setCategorizedGames(newCategorizedGames);
      return;
    }

    games.forEach((game: ISlot) => {
      // Filter out ezugi games
      // if (game.game_id?.toUpperCase().includes("EZUGI")) {
      //   return;
      // }//end of hide ezugi games
      try {
        const categories = JSON.parse(game.category);

        categories.forEach((category: string) => {
          if (category in newCategorizedGames) {
            newCategorizedGames[category as GameCategory].games.push({
              game_id: game.game_id,
              name: game.name,
              img_lnk: game.img_lnk,
              url: game.url,
              status: game.status,
              reco: game.reco,
              redirect: game.redirect,
              dateAdded: new Date().toISOString(),
              isRecommended: game.reco === 'HOT',
              provider: selectedProvider as LiveCasino,
              game_type: game.game_type,
              show_on_homepage: game.show_on_homepage,
              category: game.category,
            });
          }
        });
      } catch (error) {
        console.error('Error parsing category for game:', game.name, error);
      }
    });

    // Sort games within each category to put lobby first
    Object.keys(newCategorizedGames).forEach(categoryKey => {
      newCategorizedGames[categoryKey as GameCategory].games.sort((a, b) => {
        // Put lobby games at the top
        const aIsLobby = a.name.toLowerCase().includes('lobby');
        const bIsLobby = b.name.toLowerCase().includes('lobby');
        
        if (aIsLobby && !bIsLobby) return -1;
        if (!aIsLobby && bIsLobby) return 1;
        
        // If both are lobby or neither are lobby, maintain original order
        return 0;
      });
    });

    setCategorizedGames(newCategorizedGames);
  }, [data, selectedProvider]);

  const providers: ICasinoProvider[] = [
    { 
      id: 'all',
      title: t('common-terms.all').toUpperCase() 
    },
    {
      id: 'EVO',
      title: 'EVOLUTION',
      image: require('../assets/common/game-provider-logo/evo.png'),
    },
    {
      id: 'SXY',
      title: 'SEXY',
      image: require('../assets/common/game-provider-logo/sexy.png'),
    },
    {
      title: 'EZUGI',
      id: 'EZUGI',
      image: require('../assets/common/game-provider-logo/ezugi.png'),
    },
    // {
    //   id: 'BL',
    //   title: 'ICONIC 21',
    //   image: require('../assets/common/game-provider-logo/bl.png'),
    // },
  ];

  const isEmpty = Object.values(categorizedGames).every(
    ({ games }) => games.length === 0,
  );

  return {
    selectedProvider,
    setSelectedProvider,
    categorizedGames,
    providers,
    isLoading: isLoading || isRefetching || isPending,
    error,
    isEmpty,
  };
};
