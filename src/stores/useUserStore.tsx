import { create } from "zustand";
import { UserResponse } from "@/lib/types";

//alterar o logout depois

interface UserState {
  token: string;
  givenName: string;
  email: string;
  familyName: string;
  username: string;
  id: string;
  updatedAt: string;
}

type UserActions = {
  login: (token: string) => void;
  setUserInformation: (data: UserResponse) => void;
};

export const useUserStore = create<UserState & UserActions>((set) => ({
  token: "",
  givenName: "",
  email: "",
  familyName: "",
  username: "",
  id: "",
  updatedAt: "",

  login: (token) => {
    set({ token });
  },
  setUserInformation: (data: UserResponse) => {
    set({
      givenName: data.given_name,
      email: data.email,
      familyName: data.family_name,
      username: data.username,
      id: data.id,
      updatedAt: data.updated_at,
    });
  },
}));
