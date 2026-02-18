import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../enums';
import { RolesGuard } from '../guards/roles/roles.guard';
import { Roles } from './roles.decorator';

export const Auth = (...roles: Role[]) => {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
  );
};
