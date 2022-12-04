interface FighterProp {
  birth_year: string;
  created: string;
  edited: string;
  eye_color: string;
  gender: string;
  hair_color: string;
  height: string;
  homeworld: string;
  mass: string;
  name: string;
  skin_color: string;
  url: string;
}

export interface Fighter {
  description: string;
  properties: FighterProp;
}

export interface ApiResult {
  message: string;
  result: Fighter;
}

export interface FighterWithAvatar {
  fighter: Fighter;
  avatarUrl: string;
}