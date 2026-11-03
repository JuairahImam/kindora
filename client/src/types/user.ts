export interface IUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: boolean;
  createdAt?: string;
}

export interface AuthSession {
  user: IUser;
  session?: {
    id: string;
    expiresAt: string;
  };
  token?: string;
}
