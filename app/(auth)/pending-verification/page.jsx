"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Loader2, RefreshCw, LogOut, CheckCircle } from "lucide-react";
import {
  useResendVerificationEmail,
  useCheckVerificationStatus,
} from "@/features/auth/hooks";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { updateVerificationStatus } from "@/features/auth/redux/authSlice";

const PendingVerificationPage = () => {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const [lastSentTime, setLastSentTime] = useState(null);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const { mutate: resendEmail, isPending: isResending } =
    useResendVerificationEmail(countdown === 0);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  // Poll verification status every 10 seconds without reloading page
  // Disable polling when logging out or user data is null
  const { data: verificationData } = useCheckVerificationStatus(
    !userData?.is_verified && !isLoggingOut && !!userData
  );

  useEffect(() => {
    if (
      verificationData?.email_verified === true &&
      userData?.is_verified === false
    ) {
      dispatch(updateVerificationStatus({ isVerified: true }));
    }
  }, [verificationData, userData, dispatch]);

  useEffect(() => {
    if (userData?.is_verified) {
      const roles = userData?.roles || [];
      if (roles.includes("ADMIN")) {
        router.replace("/admin/dashboard");
      } else if (roles.length === 1 && roles.includes("READER")) {
        router.replace("/reader/dashboard");
      } else if (roles.length > 2) {
        router.replace("/choose-role");
      } else {
        const singleRoles = ["AUTHOR", "REVIEWER", "EDITOR"];
        const matchedRole = roles.find((r) => singleRoles.includes(r));
        if (matchedRole) {
          router.replace(`/${matchedRole.toLowerCase()}/dashboard`);
        } else {
          router.replace("/reader/dashboard");
        }
      }
    }
  }, [userData, router]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "email-verified") {
        dispatch(updateVerificationStatus({ isVerified: true }));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        const newCountdown = countdown - 1;
        setCountdown(newCountdown);
        if (newCountdown === 0) {
          setCanResend(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = () => {
    if (!canResend || !userData?.email) return;

    resendEmail(undefined, {
      onSuccess: () => {
        setLastSentTime(new Date());
        setCanResend(false);
        setCountdown(60); // 60 second cooldown
      },
    });
  };

  const handleLogout = () => {
    logout();
  };

  if (!userData || userData?.is_verified) {
    return null; // Don't show anything while redirecting
  }

  return (
    <div className="min-h-screen bg-linear-to-br flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
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

        {/* Verification Pending Card */}
        <Card className="border-0 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <Mail className="h-8 w-8 text-amber-600 dark:text-amber-500" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-center">
              Please verify your email address to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground">
                  We&apos;ve sent a verification email to:
                </p>
                <p className="text-sm font-semibold text-foreground mt-1">
                  {userData?.email}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center">
                  Click the link in the email to verify your account. The page
                  will automatically refresh when verified.
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <p className="text-xs text-blue-900 dark:text-blue-100">
                  Auto-checking verification status every 10 seconds...
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="default"
                className="w-full"
                onClick={handleResendEmail}
                disabled={!canResend || isResending}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : !canResend ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend in {countdown}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </>
                )}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Didn&apos;t receive the email? Check your spam folder or click
                the resend button above.
              </p>
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

export default PendingVerificationPage;
