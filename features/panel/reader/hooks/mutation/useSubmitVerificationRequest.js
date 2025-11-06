import { useMutation } from "@tanstack/react-query";
import { submitVerificationRequest } from "../../api/VerificationApiSlice";

export const useSubmitVerificationRequest = () => {
  return useMutation({
    mutationFn: (data) => submitVerificationRequest(data),
    retry: 1, // Only retry once for form submissions
  });
};
