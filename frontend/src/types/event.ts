export interface Event {
  id: string;
  name: string;
  description?: string;
  date: string;
  location: string;
  userId: string;
  organizerName: string;
  isPublic: boolean;
  requiresApproval: boolean;
  capacity?: number;
  coverImageUrl?: string;
  formSchema?: string;
  createdAt: string;
}

export interface CreateEventRequest {
  name: string;
  description?: string;
  date: string;
  location: string;
  isPublic: boolean;
  requiresApproval: boolean;
  capacity?: number;
  formSchema?: string;
}
