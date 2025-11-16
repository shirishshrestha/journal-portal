import { instance } from "@/lib/instance";

export const getDashboardAnalytics = async () => {
  try {
    const response = await instance.get("/analytics/dashboard/");
    return response.data;
  } catch (error) {
    throw error;
  }
};
