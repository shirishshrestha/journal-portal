"use client";

import { useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  useGetEmailPreferences,
  useUpdateEmailPreferences,
} from "@/features/panel/settings/hooks";
import { Loader2 } from "lucide-react";
import {
  DigestSection,
  ErrorCard,
  LoadingScreen,
  notificationGroups,
  NotificationGroupsList,
} from "@/features";

export default function EmailPreferencesTab() {
  const {
    data: fetchedPreferences,
    isPending: isEmailPreferencesPending,
    isError,
    refetch: EmailPreferencesRefetch,
  } = useGetEmailPreferences();

  const updateMutation = useUpdateEmailPreferences();

  const isInitialLoadRef = useRef(true);

  const form = useForm();

  const { setValue, reset, handleSubmit, formState } = form;
  const { isDirty } = formState;

  // Update form when preferences are fetched
  useEffect(() => {
    if (fetchedPreferences) {
      if (isInitialLoadRef.current) {
        reset(fetchedPreferences);
        isInitialLoadRef.current = false;
      }
    }
  }, [fetchedPreferences, reset]);

  const handleMasterToggle = (enabled) => {
    setValue("email_notifications_enabled", enabled, { shouldDirty: true });

    // Toggle all notification preferences
    notificationGroups.forEach((group) => {
      group.items.forEach((item) => {
        setValue(item.id, enabled, { shouldDirty: true });
      });
    });

    // Toggle digest preferences
    setValue("enable_daily_digest", enabled, { shouldDirty: true });
    setValue("enable_weekly_digest", enabled, { shouldDirty: true });
  };

  const onSubmit = useCallback(
    async (data) => {
      try {
        await updateMutation.mutateAsync(data);
        reset(data); // Reset form with new data to mark as pristine
      } catch (err) {
        console.error("Failed to save preferences:", err);
      }
    },
    [updateMutation, reset]
  );

  const handleDiscard = () => {
    reset();
  };

  if (isEmailPreferencesPending) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <ErrorCard
        title="Error Loading Email Preferences"
        onRetry={EmailPreferencesRefetch}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="md:flex md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-foreground ">
            Email Notification Preferences
          </h2>
          {/* Save Button */}
          <div className="hidden md:flex justify-end gap-3">
            {isDirty && (
              <Button
                type="button"
                onClick={handleDiscard}
                variant="outline"
                disabled={updateMutation.isPending}
              >
                Discard Changes
              </Button>
            )}
            <Button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>

        {/* Master Toggle */}
        <Card className="p-4">
          <FormField
            control={form.control}
            name="email_notifications_enabled"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={handleMasterToggle}
                        disabled={updateMutation.isPending}
                      />
                    </FormControl>
                    <Label className="text-base font-medium cursor-pointer">
                      Enable all email notifications
                    </Label>
                  </div>
                </div>
              </FormItem>
            )}
          />
        </Card>

        {/* Notification Groups */}
        <NotificationGroupsList form={form} />

        {/* Digest Section */}
        <DigestSection form={form} />

        {/* Save Button */}
        <div className="flex md:hidden justify-end gap-3">
          {isDirty && (
            <Button
              type="button"
              onClick={handleDiscard}
              variant="outline"
              disabled={updateMutation.isPending}
            >
              Discard Changes
            </Button>
          )}
          <Button
            type="submit"
            disabled={updateMutation.isPending || !isDirty}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
