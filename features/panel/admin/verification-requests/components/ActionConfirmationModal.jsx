"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormTextareaField } from "@/features/shared/components";

// Zod schemas
const rejectionSchema = z.object({
  rejection_reason: z.string().min(1, "Rejection reason is required"),
  admin_notes: z.string().optional(),
});
const approveSchema = z.object({
  admin_notes: z.string().optional(),
});

export function ActionConfirmationPopup({
  isOpen,
  action,
  userName,
  onApprove,
  onReject,
  onCancel,
  isLoading = false,
}) {
  const isReject = action === "reject";
  const isApprove = action === "approve";

  // Use correct schema and default values
  const form = useForm({
    resolver: zodResolver(isReject ? rejectionSchema : approveSchema),
    defaultValues: isReject
      ? { rejection_reason: "", admin_notes: "" }
      : { admin_notes: "" },
  });

  const onFormSubmit = (values) => {
    if (isReject) {
      onReject(values);
    } else if (isApprove) {
      onApprove(values);
    }
    form.reset();
  };

  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  // Only render dialog content if action is approve or reject
  const shouldShowForm = isApprove || isReject;

  return (
    <AlertDialog open={isOpen && shouldShowForm} onOpenChange={handleCancel}>
      {shouldShowForm && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isReject ? "Reject Verification?" : "Approve Verification?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isReject
                ? `You are about to reject ${userName}'s verification request.`
                : `You are about to approve ${userName}'s verification request.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Form {...form}>
            <div className="space-y-4">
              {isReject && (
                <FormTextareaField
                  name="rejection_reason"
                  label={
                    <span>
                      Rejection Reason
                      <span className="text-destructive ml-1">*</span>
                    </span>
                  }
                  control={form.control}
                  required
                  placeholder="Provide a clear reason for rejection"
                  rows={3}
                />
              )}

              {/* Admin notes for both */}
              <FormTextareaField
                name="admin_notes"
                label="Admin Notes (Optional)"
                control={form.control}
                placeholder="Internal notes for admin records"
                rows={2}
              />
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel
                  type="button"
                  disabled={isLoading}
                  onClick={handleCancel}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  type="button"
                  disabled={isLoading}
                  onClick={form.handleSubmit(onFormSubmit)}
                  className={
                    isReject ? "bg-destructive hover:bg-destructive/90" : ""
                  }
                >
                  {isLoading
                    ? "Processing..."
                    : isReject
                    ? "Reject"
                    : "Approve"}
                </AlertDialogAction>
              </div>
            </div>
          </Form>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
