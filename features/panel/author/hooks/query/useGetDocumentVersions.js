import { instance } from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";

const fetchDocumentVersions = async (documentId) => {
  const response = await instance.get(
    `submissions/documents/${documentId}/versions/`
  );
  return response.data;
};

export const useGetDocumentVersions = (documentId, open = true) => {
  return useQuery({
    queryKey: ["document-versions", documentId, open],
    queryFn: () => fetchDocumentVersions(documentId),
    enabled: open && !!documentId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
