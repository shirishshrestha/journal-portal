"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AvatarUpload,
  ErrorCard,
  LoadingScreen,
  ProfileForm,
  ProfileInfoCard,
  VerificationStatusBadge,
} from "@/features";
import { useGetMe } from "@/features/shared/hooks/useGetMe";
import { usePatchProfile } from "@/features/panel/reader/hooks/usePatchProfile";

export default function ReaderProfilePage() {
  const {
    data: meData,
    error: isMeError,
    isPending: isMePending,
    refetch,
  } = useGetMe();
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const patchProfileMutation = usePatchProfile();

  const profileData = meData?.profile;

  const defaultValues = {
    user_name: profileData?.user_name || "",
    display_name: profileData?.display_name || "",
    user_email: profileData?.user_email || "",
    bio: profileData?.bio || "",
    affiliation_name: profileData?.affiliation_name || "",
    orcid_id: profileData?.orcid_id || "",
    expertise_areas: Array.isArray(profileData?.expertise_areas)
      ? profileData.expertise_areas
      : [],
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!profileData?.id) return;
    try {
      await patchProfileMutation.mutateAsync({ id: profileData.id, data });
      setSaveSuccess(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  const onCancel = () => {
    // Optionally reset avatar preview or other state
    if (profileData?.avatar) {
      setAvatarPreview(profileData.avatar);
    }
  };

  if (isMePending) {
    return <LoadingScreen />;
  }

  if (isMeError) {
    return (
      <ErrorCard
        title="Error loading profile"
        description="Please try again or contact support if the problem persists."
        details={
          isMeError?.message ||
          (typeof isMeError === "string" ? isMeError : undefined)
        }
        onRetry={() => {
          refetch();
        }}
        showDetails={false}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and academic profile
        </p>
      </div>

      {/* Profile Header Section */}
      <div className="mt-4">
        <VerificationStatusBadge status={profileData?.verification_status} />
      </div>
      <ProfileInfoCard profileData={profileData} />

      {/* Edit Profile Form */}
      <Card className="gap-3">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            defaultValues={defaultValues}
            saveSuccess={saveSuccess}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isPending={patchProfileMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
