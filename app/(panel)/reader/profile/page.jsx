"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AvatarUpload,
  ErrorCard,
  LoadingScreen,
  ProfileForm,
  ProfileInfoCard,
  useGetProfileData,
  VerificationStatusBadge,
} from "@/features";

export default function ReaderProfilePage() {
  const {
    data: ProfileData,
    error: isProfileDataError,
    isPending: isProfileDataPending,
    refetch,
  } = useGetProfileData();
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const profileData = ProfileData?.results?.[0];

  const defaultValues = {
    user_name: profileData?.user_name || "",
    display_name: profileData?.display_name || "",
    user_email: profileData?.user_email || "",
    bio: profileData?.bio || "",
    affiliation_name: profileData?.affiliation_name || "",
    orcid_id: profileData?.orcid_id || "",
    expertise_areas: Array.isArray(profileData?.expertise_areas)
      ? profileData.expertise_areas.join(", ")
      : "",
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
    setIsSaving(true);
    try {
      // Simulate API call to update profile
      // const response = await fetch(`/api/v1/users/${userId}/profile/`, {
      //   method: "PUT",
      //   headers: {
      //     Authorization: "Bearer {access_token}",
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(data),
      // })

      console.log("[v0] Profile update submitted:", data);

      setTimeout(() => {
        setSaveSuccess(true);
        setIsSaving(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      }, 1000);
    } catch (error) {
      console.error("Profile update error:", error);
      setIsSaving(false);
    }
  };

  const onCancel = () => {
    // Optionally reset avatar preview or other state
    if (profileData?.avatar) {
      setAvatarPreview(profileData.avatar);
    }
  };

  if (isProfileDataPending) {
    return <LoadingScreen />;
  }

  if (isProfileDataError) {
    return (
      <ErrorCard
        title="Error loading profile"
        description="Please try again or contact support if the problem persists."
        details={
          isProfileDataError?.message ||
          (typeof isProfileDataError === "string"
            ? isProfileDataError
            : undefined)
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
            isSaving={isSaving}
            saveSuccess={saveSuccess}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
