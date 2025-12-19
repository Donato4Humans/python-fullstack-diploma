import {IProfile, IUser} from "./IUser";
import {ITokenPair} from "./ITokenPair";

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