"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "@/features/panel/settings/utils/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToggle } from "@/features/shared/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check } from "lucide-react";
import { useChangePassword } from "@/features/auth/hooks";

export default function ChangePassword() {
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [showCurrentPassword, handleShowCurrentPassword] = useToggle();
  const [showNewPassword, handleShowNewPassword] = useToggle();
  const [showConfirmPassword, handleShowConfirmPassword] = useToggle();

  const { mutate: changePassword, isPending } = useChangePassword();

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handlePasswordSubmit = async (data) => {
    const payload = {
      current_password: data.currentPassword,
      new_password: data.newPassword,
      confirm_password: data.confirmPassword,
    };

    changePassword(payload, {
      onSuccess: () => {
        setPasswordSaved(true);
        passwordForm.reset();
        setTimeout(() => setPasswordSaved(false), 3000);
      },
    });
  };

  return (
    <Card className="p-5 sm:p-6 ">
      <h3 className="text-lg font-semibold text-foreground">Change Password</h3>
      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
          className="space-y-4"
        >
          <FormField
            control={passwordForm.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  Current Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showCurrentPassword ? "text" : "password"}
                      className="bg-card text-foreground"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={handleShowCurrentPassword}
                    >
                      {showCurrentPassword ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
            {" "}
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNewPassword ? "text" : "password"}
                        className="bg-card text-foreground"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={handleShowNewPassword}
                      >
                        {showNewPassword ? (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        className="bg-card text-foreground"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={handleShowConfirmPassword}
                      >
                        {showConfirmPassword ? (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="submit"
              disabled={isPending || passwordSaved}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isPending ? "Updating..." : "Update Password"}
            </Button>
            {passwordSaved && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <Check className="h-4 w-4" />
                Updated
              </div>
            )}
          </div>
        </form>
      </Form>
    </Card>
  );
}
