'use client';

import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQueryClient } from '@tanstack/react-query';
import { usePatchProfile } from '@/features/panel/profile/hooks/mutation/usePatchProfile';
import {
  CardSkeleton,
  ErrorCard,
  LoadingScreen,
  ProfileForm,
  ProfileInfoCard,
  RoleBasedRoute,
  useCurrentRole,
  useGetMe,
  VerificationStatusBadge,
  useGetMyBadges,
  BadgeCard,
  AchievementStats,
} from '@/features';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: meData, error: isMeError, isPending: isMePending, refetch } = useGetMe();
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef(null);
  const patchProfileMutation = usePatchProfile();
  const queryClient = useQueryClient();
  const [showEditForm, setShowEditForm] = useState(false);

  const { currentRole } = useCurrentRole();

  console.log('Current Role in Profile Page:', currentRole);

  const profileData = meData?.profile;

  // Fetch user's badges
  const { data: myBadgesData, isPending: badgesPending } = useGetMyBadges();

  const defaultValues = {
    user_name: profileData?.user_name || '',
    display_name: profileData?.display_name || '',
    user_email: profileData?.user_email || '',
    bio: profileData?.bio || '',
    affiliation_name: profileData?.affiliation_name || '',
    affiliation_ror_id: profileData?.affiliation_ror_id || '',
    orcid_id: profileData?.orcid_id || '',
    expertise_areas: Array.isArray(profileData?.expertise_areas) ? profileData.expertise_areas : [],
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
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setShowEditForm(false);
    } catch (error) {
      console.error('Profile update error:', error);
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
      <RoleBasedRoute allowedRoles={['ADMIN', 'EDITOR', 'REVIEWER', 'READER', 'AUTHOR']}>
        <div className="space-y-6">
          <LoadingScreen />
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and academic profile
            </p>
          </div>
          <CardSkeleton />
        </div>
      </RoleBasedRoute>
    );
  }

  if (isMeError) {
    return (
      <RoleBasedRoute allowedRoles={['ADMIN', 'EDITOR', 'REVIEWER', 'READER', 'AUTHOR']}>
        <ErrorCard
          title="Error loading profile"
          description="Please try again or contact support if the problem persists."
          details={isMeError?.message || (typeof isMeError === 'string' ? isMeError : undefined)}
          onRetry={() => {
            refetch();
          }}
          showDetails={false}
        />
      </RoleBasedRoute>
    );
  }

  return (
    <RoleBasedRoute allowedRoles={['ADMIN', 'EDITOR', 'REVIEWER', 'READER', 'AUTHOR']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and academic profile
          </p>
        </div>

        {/* Profile Header Section */}
        <div className="mt-4">
          {currentRole !== 'ADMIN' && (
            <VerificationStatusBadge status={profileData?.verification_status} />
          )}
        </div>
        <div className="flex items-center flex-col  gap-4">
          <ProfileInfoCard
            profileData={profileData}
            profileEmailVerification={meData?.email_verified}
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

        {/* Achievements Section */}
        {!showEditForm && currentRole !== 'ADMIN' && currentRole !== 'EDITOR' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Achievements</CardTitle>
                  <CardDescription>Your badges and awards</CardDescription>
                </div>
                <Button asChild variant="outline">
                  <Link
                    href={`${currentRole === 'AUTHOR' ? '/author/achievements' : '/reviewer/achievements'}`}
                  >
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {badgesPending ? (
                <CardSkeleton />
              ) : (
                <>
                  <AchievementStats badges={myBadgesData?.results || []} awards={[]} />

                  {myBadgesData?.results && myBadgesData.results.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Featured Badges</h3>
                      {myBadgesData.results.filter((b) => b.is_featured).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {myBadgesData.results
                            .filter((b) => b.is_featured)
                            .slice(0, 3)
                            .map((userBadge) => (
                              <BadgeCard
                                key={userBadge.id}
                                badge={userBadge.badge}
                                earned={true}
                                earnedAt={userBadge.earned_at}
                                isFeatured={userBadge.is_featured}
                              />
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-muted/50 rounded-lg border border-dashed">
                          <p className="text-muted-foreground">
                            No featured badges yet. Visit your achievements page to feature your
                            best badges!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </RoleBasedRoute>
  );
}
