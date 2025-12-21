import {RoleEnum} from "../enums/RoleEnum";

export function getUserRole(user: any): RoleEnum {
  if (user?.is_superuser) return RoleEnum.SUPERADMIN;
  if (user?.is_critic) return RoleEnum.CRITIC;
  if (user.venues?.length > 0) return RoleEnum.VENUE_ADMIN;
  return RoleEnum.USER;
}