export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  status: string;
  name: string;
  username: string;
  avatar: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  status: number;
  message: string;
  data: JwtPayload;
}
