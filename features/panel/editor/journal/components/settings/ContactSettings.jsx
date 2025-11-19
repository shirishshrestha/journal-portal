"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Phone, Mail, User } from "lucide-react";
import { useUpdateJournal } from "@/features";

const contactSchema = z.object({
  main_contact_name: z.string().optional(),
  main_contact_email: z.string().email("Invalid email").or(z.literal("")).optional(),
  main_contact_phone: z.string().optional(),
  technical_contact_name: z.string().optional(),
  technical_contact_email: z.string().email("Invalid email").or(z.literal("")).optional(),
  technical_contact_phone: z.string().optional(),
});

export function ContactSettings({ journal }) {
  const updateJournalMutation = useUpdateJournal();

  console.log("ContactSettings - journal data:", journal);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      main_contact_name: "",
      main_contact_email: "",
      main_contact_phone: "",
      technical_contact_name: "",
      technical_contact_email: "",
      technical_contact_phone: "",
    },
  });

  // Update form when journal data changes
  useEffect(() => {
    if (journal) {
      console.log("Resetting form with journal data:", {
        main_contact_name: journal.main_contact_name || "",
        main_contact_email: journal.main_contact_email || "",
        main_contact_phone: journal.main_contact_phone || "",
        technical_contact_name: journal.technical_contact_name || "",
        technical_contact_email: journal.technical_contact_email || "",
        technical_contact_phone: journal.technical_contact_phone || "",
      });
      reset({
        main_contact_name: journal.main_contact_name || "",
        main_contact_email: journal.main_contact_email || "",
        main_contact_phone: journal.main_contact_phone || "",
        technical_contact_name: journal.technical_contact_name || "",
        technical_contact_email: journal.technical_contact_email || "",
        technical_contact_phone: journal.technical_contact_phone || "",
      });
    }
  }, [journal, reset]);

  const onSubmit = (data) => {
    console.log("Contact form data:", data);
    console.log("Journal ID:", journal.id);
    
    updateJournalMutation.mutate(
      { 
        id: journal.id, 
        ...data  // Spread the data at the top level
      },
      {
        onSuccess: () => {
          toast.success("Contact settings updated successfully");
        },
        onError: (error) => {
          console.error("Contact update error:", error);
          toast.error(error.message || "Failed to update contact settings");
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          Manage main and technical contact details for the journal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Main Contact Section */}
            <div className="space-y-4">
              <div className="pb-2 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Main Contact
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Primary contact for general inquiries
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="main_contact_name">Name</Label>
                <Input
                  id="main_contact_name"
                  placeholder="Dr. John Doe"
                  {...register("main_contact_name")}
                />
                {errors.main_contact_name && (
                  <p className="text-sm text-destructive">{errors.main_contact_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="main_contact_email">Email</Label>
                <Input
                  id="main_contact_email"
                  type="email"
                  placeholder="contact@journal.com"
                  {...register("main_contact_email")}
                />
                {errors.main_contact_email && (
                  <p className="text-sm text-destructive">{errors.main_contact_email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="main_contact_phone">Phone</Label>
                <Input
                  id="main_contact_phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...register("main_contact_phone")}
                />
                {errors.main_contact_phone && (
                  <p className="text-sm text-destructive">{errors.main_contact_phone.message}</p>
                )}
              </div>
            </div>

            {/* Technical Contact Section */}
            <div className="space-y-4">
              <div className="pb-2 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Technical Contact
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Contact for technical support and issues
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technical_contact_name">Name</Label>
                <Input
                  id="technical_contact_name"
                  placeholder="Jane Smith"
                  {...register("technical_contact_name")}
                />
                {errors.technical_contact_name && (
                  <p className="text-sm text-destructive">{errors.technical_contact_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="technical_contact_email">Email</Label>
                <Input
                  id="technical_contact_email"
                  type="email"
                  placeholder="tech@journal.com"
                  {...register("technical_contact_email")}
                />
                {errors.technical_contact_email && (
                  <p className="text-sm text-destructive">{errors.technical_contact_email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="technical_contact_phone">Phone</Label>
                <Input
                  id="technical_contact_phone"
                  type="tel"
                  placeholder="+1 (555) 987-6543"
                  {...register("technical_contact_phone")}
                />
                {errors.technical_contact_phone && (
                  <p className="text-sm text-destructive">{errors.technical_contact_phone.message}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={!isDirty || updateJournalMutation.isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || updateJournalMutation.isPending}
            >
              {updateJournalMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Contact Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
