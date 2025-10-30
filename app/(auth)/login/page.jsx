"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/features";
import { Toaster } from "@/components/ui/sonner";

const LoginPage = () => {
  const { resolvedTheme } = useTheme();
  return (
    <div className="min-h-screen bg-linear-to-br flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <Link href="/" className="flex flex-col items-center pt-2 mb-2">
            {resolvedTheme === "dark" ? (
              <Image
                width={200}
                height={100}
                src="/omway-white-logo.png"
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
          </Link>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl  backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-1">
            <CardTitle className="text-2xl text-center ">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center ">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LoginForm />
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-xs ">
          © {new Date().getFullYear()} Journal Portal. All rights reserved.
        </div>

        <Toaster />
      </div>
    </div>
  );
};

export default LoginPage;
