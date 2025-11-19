import { ImageSourcePropType } from 'react-native';
import { ISlot } from './slot';

export type LiveCasino = 'all' | 'EVO' | 'SXY' | 'BL' | 'EZUGI';

export type GameCategory =
  | 'BACCARAT'
  | 'BLACKJACK'
  | 'ROULETTE'
  | 'TEENPATTI'
  | 'DICE'
  | 'POKER'
  | 'OTHERS';

export interface IGameCategory {
  title: string;
  games: ISlot[];
}

export interface ICasinoProvider {
  id: LiveCasino;
  title: string;
  image?: ImageSourcePropType;
}

export interface ICasinoResponse {
  data: ISlot[];
}

export interface ICategorizedGames {
  BACCARAT: IGameCategory;
  BLACKJACK: IGameCategory;
  ROULETTE: IGameCategory;
  TEENPATTI: IGameCategory;
  DICE: IGameCategory;
  POKER: IGameCategory;
  OTHERS: IGameCategory;
}
