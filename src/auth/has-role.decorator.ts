import { SetMetadata } from '@nestjs/common';
import { USER_ROLE } from './dtos/signup.dto';

export const HasRoles = (...roles: USER_ROLE[]) => SetMetadata('roles', roles);