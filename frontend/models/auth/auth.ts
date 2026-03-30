export type AuthRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  expiresIn: number
  role: string
}

export type RegisterRequestDto = {
  username: string;
  password: string;
};