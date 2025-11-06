import { instance } from "@/lib/instance";

export const getProfileData = async (id) => {
  try {
    const response = await instance.get(`profiles/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
