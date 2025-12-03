"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Loader2, Check, ArrowLeft } from "lucide-react";
import { useSetupPassword } from "@/features/auth/hooks";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useToggle } from "@/features/shared/hooks";

const setupPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      }),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

const SetupPasswordConfirmPage = () => {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const [passwordSetup, setPasswordSetup] = useState(false);
  const [showPassword, handleShowPassword] = useToggle();
  const [showConfirmPassword, handleShowConfirmPassword] = useToggle();

  const uid = params.uid;
  const token = params.token;

  const { mutate: setupPassword, isPending } = useSetupPassword();

  const form = useForm({
    resolver: zodResolver(setupPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const handleSubmit = (data) => {
    setupPassword(
      {
        uid,
        token,
        password: data.password,
      },
      {
        onSuccess: () => {
          setPasswordSetup(true);
          form.reset();
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center pt-2 mb-2">
            {resolvedTheme === "dark" ? (
              <Image
                width={200}
                height={100}
                src="/omway-white.png"
                alt="logo"
                className="w-[200px]"
              />
            ) : (
              <Image
                width={200}
                height={100}
                src="/omway-logo.png"
                alt="logo"
                className="w-[200px]"
              />
            )}
          </div>
        </div>

        {/* Setup Password Card */}
        <Card className="border-0 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">
              Create Your Password
            </CardTitle>
            <CardDescription className="text-center">
              {passwordSetup
                ? "Password setup successfully"
                : "Setup your password to access your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {passwordSetup ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Check className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      Password setup successfully
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Your password has been setup successfully. You will be
                  redirected to the login page in a few seconds.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/login")}
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              disabled={isPending}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                              onClick={handleShowPassword}
                            >
                              {showPassword ? (
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
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm password"
                              disabled={isPending}
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

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      "Setup Password"
                    )}
                  </Button>
                </form>
              </Form>
            )}

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Journal Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SetupPasswordConfirmPage;
