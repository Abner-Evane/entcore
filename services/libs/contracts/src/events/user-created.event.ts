import { BaseEvent } from '../base-event.interface';

/** Subject: user.created.v1 */
export interface UserCreatedEvent extends BaseEvent {
  version: 'v1';
  payload: {
    userId: string;
    email: string;
    roles: string[];
    profileType: 'student' | 'teacher' | 'parent' | 'admin';
  };
}

export const USER_CREATED_SUBJECT = 'user.created.v1';
