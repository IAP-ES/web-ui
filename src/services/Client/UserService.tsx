import config from "@/config";
import { createClient } from "./client";

const client = createClient(config.API_USER_URL);

const UserService = {
  async signin(code: string) {
    return client.post("/signin", { code });
  },
  async getUser() {
    return client.get("/me");
  },
};

export { UserService };
