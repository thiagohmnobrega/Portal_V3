export type RNCStatus = 'new' | 'analyzing' | 'resolved';
export type RNCType = 'client' | 'supplier';

export type TimelineEventType = 
  | 'creation'
  | 'status_change'
  | 'edit'
  | 'contact_update'
  | 'assignment';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  description: string;
  createdAt: Date;
  createdBy: string;
  metadata?: Record<string, any>;
}

export interface RNC {
  id: string;
  type: RNCType;
  status: RNCStatus;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  collectionDate?: Date;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  contactName?: string;
  contactPhone?: string;
  orderNumber?: string;
  tags: string[];
  timeline: TimelineEvent[];
}