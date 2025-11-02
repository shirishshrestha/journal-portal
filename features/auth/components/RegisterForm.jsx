"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { FormInputField, useToggle } from "@/features/shared";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { registerFormSchema } from "../utils/authSchema";
import { useRegisterUser } from "../hooks";

const RegisterForm = () => {
  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirm: "",
      agree_to_terms: false,
    },
  });

  const [showPassword, handleShowPassword] = useToggle();
  const [showConfirmPassword, handleShowConfirmPassword] = useToggle();

  const { mutate: RegisterUser } = useRegisterUser();

  function onSubmit(values) {
    RegisterUser(values);
    // Handle form submission here
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 w-full">
            <FormInputField
              name="first_name"
              label="First Name"
              control={form.control}
              placeholder="John"
              className="h-11 "
            />

            <FormInputField
              name="last_name"
              label="Last Name"
              control={form.control}
              placeholder="Doe"
              className="h-11"
            />
          </div>

          <FormInputField
            name="email"
            label="Email Address"
            control={form.control}
            placeholder="your@email.com"
            className="h-11"
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
                      placeholder="Create strong password"
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
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password_confirm">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="password_confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className=" h-11 "
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 "
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

          <div className="space-y-3">
            <FormField
              control={form.control}
              name="agree_to_terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-1 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className=""
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal inline-block leading-6">
                      I agree to the &nbsp;
                      <a
                        href="#"
                        className="hover:text-skeleton underline underline-offset-4"
                      >
                        Terms of Service
                      </a>
                      &nbsp; and &nbsp;
                      <a
                        href="#"
                        className="hover:text-skeleton underline underline-offset-4"
                      >
                        Privacy Policy
                      </a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 font-medium tracking-wide mt-1 mb-4 rounded-sm"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Creating Account..."
              : "Create Account"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className=" hover:text-skeleton underline underline-offset-4 font-medium"
        >
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto font-normal text-foreground"
          >
            Sign in here
          </Button>
        </Link>
      </div>
    </>
  );
};

export default RegisterForm;
