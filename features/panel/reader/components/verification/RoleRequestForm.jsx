"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FormInputField,
  FormRichTextEditor,
  MultiSelect,
  useGetRoleList,
} from "@/features/shared";
import { BookOpen, Loader2 } from "lucide-react";
import React from "react";
import { roleRequestSchema } from "../../utils/FormSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetMyVerificationRequests,
  useSubmitVerificationRequest,
} from "../../hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import VerificationRequestList from "./VerificationRequestList";
import { useSelector } from "react-redux";
import {
  LoadingScreen,
  ErrorCard,
  CardSkeleton,
  FormTextareaField,
} from "@/features/shared/components";

const RoleRequestForm = () => {
  const queryClient = useQueryClient();

  const RoleLists = useSelector((state) => state.auth?.userData?.roles);

  const {
    data: verificationRequests,
    isPending: isPendingRequests,
    isError: isVerificationError,
    error: verificationError,
    refetch: refetchVerificationRequests,
  } = useGetMyVerificationRequests();

  const { mutate: submitRequest, isPending: isSubmitting } =
    useSubmitVerificationRequest();

  const defaultRoles = ["READER", "AUTHOR", "REVIEWER", "EDITOR"];


  const existingRoleNames =
    RoleLists?.map((role) => role?.trim().toUpperCase()) || [];

  const availableRoles = defaultRoles
    .filter((roleName) => !existingRoleNames.includes(roleName))
    .map((roleName) => ({
      value: roleName,
      label: roleName,
    }));

  const roleForm = useForm({
    resolver: zodResolver(roleRequestSchema),
    defaultValues: {
      requested_roles: [],
      affiliation: "",
      affiliation_email: "",
      research_interests: "",
      academic_position: "",
      supporting_letter: "",
    },
  });

  const onRoleSubmit = async (data) => {
    submitRequest(data, {
      onSuccess: () => {
        toast.success("Role request submitted successfully!");
        queryClient.invalidateQueries(["my-verification-requests"]);
        roleForm.reset();
      },
      onError: (error) => {
        console.error("Role request error:", error);
        toast.error(
          error?.response?.data?.message || "Failed to submit role request"
        );
      },
    });
  };

  // Error state for verification requests
  if (isVerificationError) {
    return (
      <ErrorCard
        title="Error loading verification requests"
        description="Unable to fetch your verification requests. Please try again."
        details={
          verificationError?.message ||
          (typeof verificationError === "string"
            ? verificationError
            : undefined)
        }
        onRetry={refetchVerificationRequests}
      />
    );
  }

  return (
    <div className="space-y-6">
      {isPendingRequests && <LoadingScreen />}
      {isPendingRequests ? (
        <CardSkeleton />
      ) : (
        verificationRequests.length > 0 && (
          <VerificationRequestList requests={verificationRequests} />
        )
      )}
      {/* Role Request Form */}
      {defaultRoles.every((role) => RoleLists?.includes(role)) ||
      (verificationRequests &&
        verificationRequests[0] &&
        verificationRequests[0].status === "PENDING") ||
      (verificationRequests &&
        verificationRequests[0] &&
        verificationRequests[0].status === "INFO_REQUESTED") ? null : (
        <Card className="border-border dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Request Additional Roles
            </CardTitle>
            <CardDescription>
              Fill out the form below to request access to specific roles. Admin
              approval required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...roleForm}>
              <form
                onSubmit={roleForm.handleSubmit(onRoleSubmit)}
                className=" grid grid-cols-1 lg:grid-cols-2 gap-4"
              >
                <FormField
                  control={roleForm.control}
                  name="requested_roles"
                  render={({ field }) => (
                    <FormItem className={"flex flex-col"}>
                      <FormLabel>Select Role</FormLabel>

                      <MultiSelect
                        options={availableRoles}
                        selected={field.value}
                        onChange={field.onChange}
                        error={roleForm.formState.errors.requested_roles}
                        placeholder="Choose a role to request"
                      />

                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormInputField
                  control={roleForm.control}
                  name="affiliation"
                  label="Institution/Organization"
                  placeholder="e.g., Harvard University, MIT"
                  description="Your current academic or research institution"
                />

                <FormInputField
                  control={roleForm.control}
                  name="affiliation_email"
                  label="Institutional Email"
                  placeholder="your.name@institution.edu"
                  description="Your verified institutional email address"
                />

                <FormInputField
                  control={roleForm.control}
                  name="academic_position"
                  label="Academic Position"
                  placeholder="e.g., PhD, Professor, Postdoctoral Researcher"
                  description="Your current academic position or title"
                />

                <FormTextareaField
                  control={roleForm.control}
                  name="research_interests"
                  label="Research Interests"
                  placeholder="Describe your research interests and areas of expertise..."
                  description="Help us understand your research focus"
                  form_classname="lg:col-span-2"
                />

                <FormRichTextEditor
                  control={roleForm.control}
                  name="supporting_letter"
                  label="Supporting Letter"
                  placeholder="Provide a supporting letter explaining why you should be approved for this role..."
                  description="Help admins make an informed decision about your request (minimum 100 characters)"
                  form_classname="lg:col-span-2"
                />

                <div className="flex gap-3 mt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-fit"
                    size="md"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {isSubmitting ? "Submitting..." : "Submit Role Request"}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      roleForm.reset();
                    }}
                    className="w-fit"
                    size="md"
                    variant="muted"
                  >
                    Clear Form
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoleRequestForm;
