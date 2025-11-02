import { instance } from "@/lib/instance";

export const registerUser = async (registerData) => {
  try {
    const response = await instance.post("auth/register/", registerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
