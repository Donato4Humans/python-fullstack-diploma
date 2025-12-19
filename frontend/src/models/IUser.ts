export interface IProfile {
  id: number;
  name: string;
  surname: string;
  age: number;
  house: number;
  street: string;
  city: string;
  region: string;
  country: string;
  gender: string;
  created_at: string;
  updated_at: string;
}

export interface IUser {
  id: number;
  email: string;
  is_active: boolean;
  is_critic: boolean;
  is_superuser: boolean;
  status: 'blocked' | 'Blocked' | 'active' | 'Active';
  last_login: string | null;
  created_at: string;
  updated_at: string;
  profile: IProfile;
}

export interface IBlockUnblockRequest {
  action: 'block' | 'unblock';
}

export interface IBlockUnblockResponse {
  message: string;
  status: string;
}

export interface IMakeCriticResponse {
  message: string;
  user: IUser;
}