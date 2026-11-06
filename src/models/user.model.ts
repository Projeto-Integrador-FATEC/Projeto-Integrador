export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface LoginResult extends User {
  token: string;
}
