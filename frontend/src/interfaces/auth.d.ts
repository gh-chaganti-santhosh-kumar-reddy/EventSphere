export interface User {
  id: string;
  name: string;
  email: string;
  // Add more fields if your backend includes them
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}