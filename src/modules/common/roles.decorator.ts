import { SetMetadata } from '@nestjs/common';
import { EAppRoles } from './types';
import { ROLES_KEY } from './constants';

export const Roles = (...roles: EAppRoles[]) => SetMetadata(ROLES_KEY, roles);
