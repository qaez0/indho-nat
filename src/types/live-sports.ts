export interface LiveMatch {
  tournament_id: string;
  event_type_id: string;
  event_id: string;
  team_a: Team;
  team_b: Team;
  season_name: string;
  status: string;
  time: string;
  m?: M;
  have_live_icon: boolean;
  more_details: SportEventStatus;
}

export interface M {
  market_id: string;
  market_name: string;
  product: Product[];
}

export interface Product {
  product_id: string;
  product_name: string;
  status: string;
  o: number;
  lo: number;
  bq: string;
  lq: string;
}

export interface Team {
  name: string;
  abbr: string;
  more_details: Competitor;
}

export interface SportEventStatus {
  away_dismissals: string;
  away_score: string;
  delivery: string;
  home_dismissals: string;
  home_score: string;
  innings: string;
  match_status: string;
  match_status_code: string;
  over: string;
  status: string;
  status_code: string;
  update_time: string;
}

export interface Competitor {
  abbreviation: string;
  gender: string;
  id: string;
  name: string;
  qualifier: string;
  short_name: string;
}
