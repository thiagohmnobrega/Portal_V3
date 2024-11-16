import { TimelineEvent, TimelineEventType } from '../types/rnc';

export function createTimelineEvent(
  type: TimelineEventType,
  description: string,
  createdBy: string,
  metadata?: Record<string, any>
): TimelineEvent {
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    description,
    createdAt: new Date(),
    createdBy,
    metadata
  };
}

export function getEventIcon(type: TimelineEventType): string {
  switch (type) {
    case 'creation':
      return 'plus-circle';
    case 'status_change':
      return 'refresh-cw';
    case 'edit':
      return 'edit';
    case 'contact_update':
      return 'user';
    case 'assignment':
      return 'users';
    default:
      return 'circle';
  }
}