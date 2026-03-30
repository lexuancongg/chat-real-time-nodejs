export type RegisterRequestDto = {
  username: string;
  password: string;
};

export type LoginResponseDto = {
  expiresIn: number;
  role: string;
};