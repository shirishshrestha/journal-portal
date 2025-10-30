import { instance } from "@/lib/instance";

export const loginUser = async (loginData) => {
  try {
    const response = await instance.post("auth/login/", loginData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
