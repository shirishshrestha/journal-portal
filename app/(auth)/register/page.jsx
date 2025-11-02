"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { RegisterForm } from "@/features";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RegisterPage = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen bg-linear-to-br flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <Link href="/" className="flex flex-col items-center pt-2 mb-2">
            {resolvedTheme == "dark" ? (
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
          </Link>
        </div>

        {/* Signup Card */}
        <Card className="border-0 gap-3 shadow-xl  backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-1">
            <CardTitle className="text-2xl  text-center ">
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <RegisterForm />
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-xs">
          © {new Date().getFullYear()} Journal Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
