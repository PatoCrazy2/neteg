export interface Event {
  id: string;
  name: string;
  description?: string;
  date: string;
  location: string;
  userId: string;
  organizerName: string;
  createdAt: string;
}

export interface CreateEventRequest {
  name: string;
  description?: string;
  date: string;
  location: string;
}
