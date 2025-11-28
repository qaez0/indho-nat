import { useMemo } from 'react';
import { useSlots } from './useSlots';
import { useBlogs } from './useBlogs';
import { IBlog } from '../types/blogs';
import { ISlot } from '../types/slot';

function isInCategory(game: ISlot, target: string, requireHomepage: boolean) {
  try {
    const categories = JSON.parse(game.category);
    const hit = categories.includes(target);
    return requireHomepage ? !!game.show_on_homepage && hit : hit;
  } catch {
    return false;
  }
}

// Mock games data for games that might not be in the API response
const mockGames: Record<string, ISlot> = {
  '9Wicket': {
    img_lnk: '/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/sports_9wickets_hotgames/210',
    home_img_lnk: '/cdn-cgi/imagedelivery/SViyH5iSEWrJ3_F3ZK6HYg/sports_9wickets_hotgames/210',
    url: '/Login/GameLogin/nw/lobby',
    status: 'ENABLE',
    name: '9Wicket',
    game_id: '9w',
    reco: 'DEFAULT',
    category: '["SPORTS"]',
    redirect: 'false',
    show_on_homepage: true,
    game_type: '',
  },
};

// Fixed positions configuration for prioritized games
const fixedPositionsConfig = [
  { position: 1, gameId: '', gameName: 'Fortune Gems' }, // Position 1 - Fortune Gems
  { position: 4, gameId: '', gameName: 'Money Coming' }, // Position 2 - Money Coming
  { position: 7, gameId: '', gameName: 'Super Ace' }, // Position 3 - Super Ace
  { position: 2, gameId: '', gameName: 'Aviator' }, // Position 10 - Aviator
  { position: 5, gameId: '', gameName: '9Wicket' }, // Position 11 - 9Wicket (uses mock data if not found)
  { position: 8, gameId: '', gameName: 'The Chicken House' }, // Position 12 - The Chicken House

  // { position: 3, gameId: "", gameName: "Wild Bounty Showdown" },
  // { position: 6, gameId: "", gameName: "Fortune Rabbit" },
  // { position: 9, gameId: "", gameName: "Treasures of Aztec" },
  
];

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Shuffle games with fixed positions for prioritized games
const shuffleWithFixedPositions = (array: ISlot[]): ISlot[] => {
  if (!array || array.length === 0) return [];

  // Helper function to match games
  const matchesGame = (game: ISlot, config: { gameId: string; gameName: string }) => {
    if (config.gameId && String(game.game_id) === config.gameId) return true;
    if (config.gameName) {
      const gameNameLower = game.name.toLowerCase().trim();
      const configNameLower = config.gameName.toLowerCase().trim();
      // Use exact match to avoid conflicts (e.g., "Super Ace" should not match "Super Ace Deluxe")
      return gameNameLower === configNameLower;
    }
    return false;
  };

  // Map to store fixed games by position (1-based)
  const fixedGamesMap = new Map<number, ISlot>();
  const usedGames = new Set<ISlot>();

  // First, find and mark games for fixed positions
  fixedPositionsConfig.forEach((config) => {
    if (config.gameId || config.gameName) {
      const foundGame = array.find(
        (game) => !usedGames.has(game) && matchesGame(game, config),
      );
      if (foundGame) {
        usedGames.add(foundGame);
        fixedGamesMap.set(config.position, foundGame);
      } else {
        // If game not found, check if we have mock data for it
        if (config.gameName && mockGames[config.gameName]) {
          const mockGame = mockGames[config.gameName];
          fixedGamesMap.set(config.position, mockGame as ISlot);
        }
      }
    }
  });

  // Collect remaining games (not used in fixed positions)
  const remainingGames = array.filter((game) => !usedGames.has(game));

  // Shuffle remaining games
  const shuffledRemaining = shuffleArray(remainingGames);

  // Build final array with fixed positions
  const result: ISlot[] = [];
  let shuffledIndex = 0;
  const totalGames = array.length;

  for (let position = 1; position <= totalGames; position++) {
    if (fixedGamesMap.has(position)) {
      // Use fixed game at this position
      result.push(fixedGamesMap.get(position)!);
    } else if (shuffledIndex < shuffledRemaining.length) {
      // Use shuffled game
      result.push(shuffledRemaining[shuffledIndex]);
      shuffledIndex++;
    }
  }

  return result;
};

export const useHome = () => {
  const { data, isLoading, refetch, isRefetching } = useSlots({
    name: '',
    category: 'HOT GAMES,LIVE CASINO,CRASH GAMES',
    game_id: '',
    page: 1,
    pagesize: 500,
  });

  const { blogs, isBlogsLoading } = useBlogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const all = (data?.data?.data as ISlot[]) || [];

  const shuffle = (arr: ISlot[]) =>
    arr
      .map(v => ({ v, s: Math.random() }))
      .sort((a, b) => a.s - b.s)
      .map(({ v }) => v);

  const homeBlogsData = useMemo(() => {
    return (
      blogs
        .sort(
          (a: IBlog, b: IBlog) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        )
        .slice(0, 6) || []
    );
  }, [blogs]);

  const liveCasino = useMemo(() => {
    const filtered = all.filter(g => 
      isInCategory(g, 'LIVE CASINO', true) 
      // //hide ezugi games
      // &&
      // !g.game_id?.toUpperCase().includes("EZUGI")
      // //end of hide ezugi games
    );
    return shuffle(filtered);
  }, [all]);

  const crashGame = useMemo(() => {
    const filtered = all.filter(g => isInCategory(g, 'CRASH GAMES', true));
    return shuffle(filtered);
  }, [all]);

  const slotsGame = useMemo(() => {
    const filtered = all.filter(g => isInCategory(g, 'HOT GAMES', true));
    return shuffleWithFixedPositions(filtered);
  }, [all]);

  return {
    liveCasino,
    crashGame,
    slotsGame,
    blogs: homeBlogsData,
    isLoading: {
      gamesLoading: isLoading || isRefetching,
      blogsLoading: isBlogsLoading,
    },
    refetch,
    isRefetching,
  };
};
