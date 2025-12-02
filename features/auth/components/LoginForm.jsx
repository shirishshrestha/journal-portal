"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema } from "../utils/authSchema";
import { useLoginUser } from "../hooks";
import Link from "next/link";
import { FormInputField, useToggle } from "@/features/shared";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function LoginForm() {
  const [showPassword, handleShowPassword] = useToggle();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: LoginMutation, isPending: LoginPending } = useLoginUser({
    reset: form.reset,
  });

  const onSubmit = (data) => {
    LoginMutation(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInputField
          name="email"
          label="Email"
          control={form.control}
          placeholder="Enter your Email"
          className="h-11 "
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    className=" h-11 "
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 "
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
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm  hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={LoginPending}
        >
          {LoginPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-normal text-foreground"
            >
              Sign up
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
