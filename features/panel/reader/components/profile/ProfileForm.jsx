import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";

const profileSchema = z.object({
  user_name: z.string().min(2, "Name must be at least 2 characters"),
  display_name: z.string().min(2, "Display name is required"),
  user_email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters"),
  affiliation_name: z.string().min(1, "Institution is required"),
  orcid_id: z.string().optional(),
  expertise_areas: z.string().min(2, "Please add expertise areas"),
});

export default function ProfileForm({
  defaultValues,
  isSaving,
  saveSuccess,
  onSubmit,
  onCancel,
}) {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">
            Personal Information
          </h3>
          <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dr. Sarah Chen" {...field} />
                  </FormControl>
                  <FormDescription>
                    How your name appears on your profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Academic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">
            Academic Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
            <FormField
              control={form.control}
              name="affiliation_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution/Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Stanford University" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your current academic or research institution
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orcid_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ORCID iD</FormLabel>
                  <FormControl>
                    <Input placeholder="0000-0002-1234-5678" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your ORCID identifier (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="expertise_areas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expertise Areas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Genomics, Machine Learning, Bioinformatics, Data Science"
                    className="min-h-20"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Separate multiple areas with commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Bio Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">About</h3>
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself, your research interests, and professional background..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {form.watch("bio").length}/500 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSaving || saveSuccess}
            className="w-fit"
          >
            {saveSuccess && <Check className="w-4 h-4 mr-2" />}
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {saveSuccess
              ? "Saved Successfully"
              : isSaving
              ? "Saving..."
              : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
