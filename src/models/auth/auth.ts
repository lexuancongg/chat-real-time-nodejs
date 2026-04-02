export type RegisterRequestDto = {
  username: string;
  password: string;
  displayName: string; 
  phone:string;
};

export type RegisterResponseDto = {
  id: number;
  username: string;
};



export type LoginRequestDto = {
  username: string;
  password: string;
};



