import config from "@/config";
import { createClient } from "./client";

const client = createClient(config.BASE_URL);

const TaskService = {
  async createTask(
    title: string,
    description: string,
    priority: number,
    deadline: string,
    user_id: string
  ) {
    return client.post("/tasks", {
      title,
      description,
      priority,
      deadline,
      user_id,
    });
  },
  async getTasks() {
    return client.get("/tasks");
  },
  async deleteTask(id: string) {
    return client.delete(`/tasks/${id}`);
  },
  async updateTask(
    id: string,
    title: string,
    description: string,
    status: string,
    priority: number,
    deadline: string
  ) {
    console.log("deadline", deadline);
    return client.put(`/tasks/${id}`, {
      title,
      description,
      status,
      priority,
      deadline,
    });
  },
};

export { TaskService };
