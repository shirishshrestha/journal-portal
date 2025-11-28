import { instance } from "@/lib/instance";

export const searchDOAJJournals = async (query) => {
  if (!query) return { results: [] };

  try {
    const response = await instance.get(
      `/integrations/doaj/journals/search/?query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching DOAJ journals:", error);
    return { results: [] };
  }
};
