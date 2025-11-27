"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CardSkeleton from "@/features/shared/components/CardSkeleton";
import {
  AvatarUpload,
  ErrorCard,
  LoadingScreen,
  ProfileForm,
  ProfileInfoCard,
  useGetMe,
  VerificationStatusBadge,
} from "@/features";
import { usePatchProfile } from "@/features/panel/profile/hooks/mutation/usePatchProfile";
import { useQueryClient } from "@tanstack/react-query";

export default function ReaderProfilePage() {
  const {
    data: meData,
    error: isMeError,
    isPending: isMePending,
    refetch,
  } = useGetMe();
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef(null);
  const patchProfileMutation = usePatchProfile();
  const queryClient = useQueryClient();
  const [showEditForm, setShowEditForm] = useState(false);

  const profileData = meData?.profile;

  const defaultValues = {
    user_name: profileData?.user_name || "",
    display_name: profileData?.display_name || "",
    user_email: profileData?.user_email || "",
    bio: profileData?.bio || "",
    affiliation_name: profileData?.affiliation_name || "",
    affiliation_ror_id: profileData?.affiliation_ror_id || "",
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
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setShowEditForm(false);
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  const onCancel = () => {
    // Optionally reset avatar preview or other state
    if (profileData?.avatar) {
      setAvatarPreview(profileData.avatar);
    }
    setShowEditForm(false);
  };

  if (isMePending) {
    return (
      <div className="space-y-6">
        <LoadingScreen />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and academic profile
          </p>
        </div>
        <CardSkeleton />
      </div>
    );
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
      <div className="flex items-center flex-col  gap-4">
        <ProfileInfoCard
          profileData={profileData}
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
        />
      </div>

      {/* Edit Profile Form */}
      {showEditForm && (
        <Card className="gap-3">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm
              defaultValues={defaultValues}
              saveSuccess={patchProfileMutation?.isPending}
              onSubmit={onSubmit}
              onCancel={onCancel}
              isPending={patchProfileMutation.isPending}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
