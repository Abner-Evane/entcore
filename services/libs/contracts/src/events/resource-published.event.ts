import { BaseEvent } from '../base-event.interface';

/** Subject: resource.published.v1 */
export interface ResourcePublishedEvent extends BaseEvent {
  version: 'v1';
  payload: {
    resourceId: string;
    authorId: string;
    title: string;
    resourceType: string;
    targetAudience: string[];
  };
}

export const RESOURCE_PUBLISHED_SUBJECT = 'resource.published.v1';
