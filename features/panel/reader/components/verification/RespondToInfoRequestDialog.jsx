"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FormInputField,
  FormTextareaField,
  MultiSelect,
} from "@/features/shared/components";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { useRespondRequest } from "../../hooks";

// Schema for responding to info request
const respondToInfoRequestSchema = z.object({
  requested_roles: z
    .array(z.string())
    .min(1, "At least one role must be selected"),
  affiliation: z.string().min(1, "Institution is required"),
  affiliation_email: z
    .string()
    .min(1, "Institutional email is required")
    .email("Invalid email address"),
  research_interests: z.string().min(1, "Research interests are required"),
  academic_position: z.string().min(1, "Academic position is required"),
  supporting_letter: z.string().min(1, "Supporting letter is required"),
  //   user_response: z
  //     .string()
  //     .min(1, "Response to the admin's request is required"),
});

const RespondToInfoRequestDialog = ({ request, open, onClose }) => {
  const queryClient = useQueryClient();
  const { mutate: respondRequest, isPending: isSubmitting } =
    useRespondRequest();

  const respondForm = useForm({
    resolver: zodResolver(respondToInfoRequestSchema),
    defaultValues: {
      requested_roles: request?.requested_roles || [],
      affiliation: request?.affiliation || "",
      affiliation_email: request?.affiliation_email || "",
      research_interests: request?.research_interests || "",
      academic_position: request?.academic_position || "",
      supporting_letter: request?.supporting_letter || "",
      user_response: request?.user_response || "",
    },
  });

  const onSubmit = (data) => {
    respondRequest(
      { id: request.id, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["my-verification-requests"]);
          respondForm.reset();
          onClose();
        },
      }
    );
  };

  // Format requested roles for MultiSelect
  const requestedRolesOptions =
    request?.requested_roles?.map((role) => ({
      value: role,
      label: role,
    })) || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[85%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>Respond to Additional Information Request</DialogTitle>
          <DialogDescription>
            The admin has requested additional information. Please review and
            update your submission.
          </DialogDescription>
        </DialogHeader>
        {request?.additional_info_requested && (
          <div className="mt-2 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-300 mb-1">
              Admin&apos;s Request:
            </p>
            <p className="text-sm text-blue-900 capitalize dark:text-blue-100">
              {request.additional_info_requested}
            </p>
          </div>
        )}
        <Form {...respondForm}>
          <form
            onSubmit={respondForm.handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4"
          >
            <FormField
              control={respondForm.control}
              name="requested_roles"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Requested Roles</FormLabel>
                  <MultiSelect
                    options={requestedRolesOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    error={respondForm.formState.errors.requested_roles}
                    placeholder="Choose roles"
                    disabled
                  />
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormInputField
              control={respondForm.control}
              name="affiliation"
              label="Institution/Organization"
              placeholder="e.g., Harvard University, MIT"
              description="Your current academic or research institution"
            />

            <FormInputField
              control={respondForm.control}
              name="affiliation_email"
              label="Institutional Email"
              placeholder="your.name@institution.edu"
              description="Your verified institutional email address"
            />

            <FormInputField
              control={respondForm.control}
              name="academic_position"
              label="Academic Position"
              placeholder="e.g., PhD, Professor, Postdoctoral Researcher"
              description="Your current academic position or title"
            />

            <FormTextareaField
              control={respondForm.control}
              name="research_interests"
              label="Research Interests"
              placeholder="Describe your research interests and areas of expertise..."
              description="Help us understand your research focus"
              form_classname="lg:col-span-2"
            />

            <FormTextareaField
              control={respondForm.control}
              name="supporting_letter"
              label="Supporting Letter"
              placeholder="Provide a supporting letter explaining why you should be approved for this role..."
              description="Help admins make an informed decision about your request"
              form_classname="lg:col-span-2"
            />

            {/* <FormTextareaField
              control={respondForm.control}
              name="user_response"
              label="Your Response to Admin's Request"
              placeholder="Provide the requested information..."
              description="Address the admin's specific concerns or requests"
              form_classname="lg:col-span-2"
            /> */}

            <div className="flex gap-3 mt-2 lg:col-span-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-fit"
                size="md"
              >
                {isSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isSubmitting ? "Submitting..." : "Submit Response"}
              </Button>

              <Button
                type="button"
                onClick={onClose}
                className="w-fit"
                size="md"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RespondToInfoRequestDialog;
