export type EventCategory =
  | "Cleanup"
  | "Plantation"
  | "Donation"
  | "Education"
  | "Healthcare"
  | "Food Distribution"
  | "Other";

export interface IJoinedUser {
  userId: string;
  name: string;
  email: string;
  joinedAt: string;
}

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  eventType: EventCategory | string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorId: string;
  creatorEmail: string;
  joinedUsers: IJoinedUser[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
