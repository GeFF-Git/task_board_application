export interface LoginRequestDto {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequestDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthUser {
  userId: string;
  fullName: string;
  email: string;
}
