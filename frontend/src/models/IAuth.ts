import type {IProfile, IUser} from "./IUser";
import type {ITokenPair} from "./ITokenPair";

export interface ISignInRequest {
	email: string;
	password: string;
}

export interface ISignUpRequest {
    email: string;
	password: string;
    profile: IProfile;
}

export interface IAuthResponse {
	user: IUser;
	tokens: ITokenPair;
}

export interface ITokenResponse {
    access: string;
    refresh: string;
}

export interface Profile {
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

export interface ISignUpResponse {
  id: number;
  email: string;
  status: string;
  agreed_to_terms: boolean;
  is_active: boolean;
  is_critic: boolean;
  is_superuser: boolean;
  last_login?: any;
  created_at: string;
  updated_at: string;
  profile: Profile;
}