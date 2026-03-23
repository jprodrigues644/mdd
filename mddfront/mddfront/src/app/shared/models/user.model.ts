import { SubjectResponse } from './subject.model';

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  subscriptions: SubjectResponse[];
}

export interface UpdateUserRequest {
  username: string;
  email: string;
  password?: string;
}