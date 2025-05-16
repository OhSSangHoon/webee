export interface SignUpRequest {
  username: string;
  password: string;
  name: string;
}

export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignInResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}
