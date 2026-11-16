export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  seedAdmin: boolean;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface LoginResult extends User {
  token: string;
}
