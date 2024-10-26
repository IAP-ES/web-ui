export interface UserResponse {
  givenName: string;
  email: string;
  familyName: string;
  username: string;
  id: string;
  updatedAt: string;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  status: "todo" | "doing" | "done";
  priority: number;
  deadline: Date | null;
  createdAt: string;
}
