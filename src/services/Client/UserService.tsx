import config from "@/config";
import { createClient } from "./client";

const client = createClient(config.API_USER_URL);

const UserService = {
  async signin(code: string) {
    return client.post("/signin", { code });
  },
  async logout() {
    return client.get("/logout");
  },
  async getUser() {
    return client.get("/me");
  },
};

export { UserService };
