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
  FormSelectField,
  FormTextareaField,
  MultiSelect,
  useGetRoleList,
} from "@/features/shared";
import { BookOpen, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { roleRequestSchema } from "../../utils/FormSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const RoleRequestForm = () => {
  const [submittingRole, setSubmittingRole] = useState(null);
  //   const availableRoles = [
  //     { id: "AUTHOR", name: "Author" },
  //     { id: "REVIEWER", name: "Reviewer" },
  //     { id: "EDITOR", name: "Editor" },
  //   ];

  const { data: RoleLists } = useGetRoleList();
  console.log(RoleLists);

  const defaultRoles = ["READER", "AUTHOR", "REVIEWER", "EDITOR"];

  const existingRoleNames =
    RoleLists?.results?.map((role) => role.name?.trim().toUpperCase()) || [];

  const availableRoles = defaultRoles
    .filter((roleName) => !existingRoleNames.includes(roleName))
    .map((roleName) => ({
      value: roleName,
      label: roleName,
    }));

  console.log(availableRoles);

  const roleForm = useForm({
    resolver: zodResolver(roleRequestSchema),
    defaultValues: {
      requested_role: [],
      affiliation: "",
      affiliation_email: "",
      research_interests: "",
      academic_position: "",
      supporting_letter: "",
    },
  });

  const onRoleSubmit = async (data) => {
    // setSubmittingRole(data.requested_role);
    console.log(data);
    // try {
    //   // Simulate API call to POST /api/v1/users/roles/request/
    //   // const response = await fetch("/api/v1/users/roles/request/", {
    //   //   method: "POST",
    //   //   headers: {
    //   //     Authorization: "Bearer {access_token}",
    //   //     "Content-Type": "application/json"
    //   //   },
    //   //   body: JSON.stringify(data),
    //   // })

    //   console.log("[v0] Role request submitted:", data);

    //   setTimeout(() => {
    //     alert(
    //       `Role request for ${data.requested_role} submitted successfully!`
    //     );
    //     roleForm.reset();
    //     setSubmittingRole(null);
    //   }, 1000);
    // } catch (error) {
    //   console.error("Role request error:", error);
    //   setSubmittingRole(null);
    // }
  };

  return (
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
            className=" grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <FormField
              control={roleForm.control}
              name="requested_role"
              render={({ field }) => (
                <FormItem className={"flex flex-col"}>
                  <FormLabel>Select Role</FormLabel>

                  <MultiSelect
                    options={availableRoles}
                    selected={field.value}
                    onChange={field.onChange}
                    error={roleForm.formState.errors.requested_role}
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
              form_classname="md:col-span-2"
            />

            <FormTextareaField
              control={roleForm.control}
              name="supporting_letter"
              label="Supporting Letter"
              placeholder="Provide a supporting letter explaining why you should be approved for this role..."
              description="Help admins make an informed decision about your request"
              form_classname="md:col-span-2"
            />

            <div className="flex gap-3 mt-2">
              <Button
                type="submit"
                disabled={submittingRole !== null}
                className="w-fit"
                size="md"
              >
                {submittingRole && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {submittingRole ? "Submitting..." : "Submit Role Request"}
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
  );
};

export default RoleRequestForm;
