import { API_URL } from "@/lib/constants";
import axios from "axios";

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}auth/login/`, loginData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
