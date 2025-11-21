export interface MatchupLink {
  platformId?: number;
  platform?: string;
  url: string;
  text?: string | null;
}

export interface MatchupCell {
  rowRaceId: number;
  colRaceId: number;
  links?: MatchupLink[];
}

export interface MatchupCellResponse {
  cellId: number;
  rowRaceId: number;
  colRaceId: number;
  rowRaceName: string;
  colRaceName: string;
  links: MatchupLink[];
}

export interface MatchupRowResponse {
  rowRaceId: number;
  rowRaceName: string;
  cols: {
    cellId: number;
    colRaceId: number;
    colRaceName: string;
    links: MatchupLink[];
  }[];
}

export interface CreateMatchupTableDto {
  name: string;
  cells: MatchupCell[];
}

export interface MatchupTableSummary {
  id: number;
  name: string;
  createdAt: string;
}

export interface MatchupTableFull {
  id: number;
  name: string;
  createdAt: string;
  cells: MatchupRowResponse[];
}
