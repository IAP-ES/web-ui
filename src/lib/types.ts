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
  priority: "low" | "mid" | "high";
  deadline: Date | null;
  createdAt: string;
}
