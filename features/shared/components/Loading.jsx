"use client";
import loadingAnimation from "@/public/lottie/loading.json";
import Lottie from "lottie-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-background h-screen w-screen">
      <div className="w-72 h-w-72">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
    </div>
  );
}
