import { instance } from "@/lib/instance";

export const getRoleList = async () => {
  try {
    const response = await instance.get("roles/");
    return response.data;
  } catch (error) {
    throw error;
  }
};
