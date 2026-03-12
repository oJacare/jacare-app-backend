import { Reflector } from '@nestjs/core';

export interface MissionPermission {
  role: 'ADMIN' | 'DESIGNER' | 'VIEWER';
}

export const Roles = Reflector.createDecorator<MissionPermission>();
