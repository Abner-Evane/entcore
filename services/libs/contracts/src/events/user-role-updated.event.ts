import { BaseEvent } from '../base-event.interface';

/** Subject: user.role.updated.v1 */
export interface UserRoleUpdatedEvent extends BaseEvent {
  version: 'v1';
  payload: {
    userId: string;
    previousRoles: string[];
    newRoles: string[];
  };
}

export const USER_ROLE_UPDATED_SUBJECT = 'user.role.updated.v1';
