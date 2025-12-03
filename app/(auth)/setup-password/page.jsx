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
import { Mail, Loader2, Check, ArrowLeft } from "lucide-react";
import { useRequestPasswordSetup } from "@/features/auth/hooks";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";

const setupPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const SetupPasswordPage = () => {
  const { resolvedTheme } = useTheme();
  const [emailSent, setEmailSent] = useState(false);
  const { mutate: requestPasswordSetup, isPending } = useRequestPasswordSetup();

  const form = useForm({
    resolver: zodResolver(setupPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (data) => {
    requestPasswordSetup(data.email, {
      onSuccess: () => {
        setEmailSent(true);
        form.reset();
      },
    });
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
              Setup Your Password
            </CardTitle>
            <CardDescription className="text-center">
              {emailSent
                ? "Check your email for setup instructions"
                : "Enter your email address to receive a password setup link"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {emailSent ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Check className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      Password setup email sent successfully
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Please check your email inbox and follow the instructions to
                  setup your password. If you don&apos;t see the email, check
                  your spam folder.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setEmailSent(false)}
                >
                  Send another email
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10"
                              disabled={isPending}
                            />
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
                        Sending...
                      </>
                    ) : (
                      "Send Setup Link"
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

export default SetupPasswordPage;
