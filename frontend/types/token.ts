export interface AccessToken {
  [accessToken: string]: Token;
}
export interface RefreshToken {
  [refreshToken: string]: Token;
}

export interface Token {
  token: string;
  expiresIn: string;
}
