import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ProfileInfoCard({ profileData }) {
  if (!profileData) return null;

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Last updated:{" "}
          {profileData.updated_at
            ? new Date(profileData.updated_at).toLocaleDateString()
            : "-"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Full Name
            </p>
            <p className="text-sm">
              {profileData.display_name || profileData.user_name || "-"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-sm">{profileData.user_email || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Affiliation
            </p>
            <p className="text-sm">{profileData.affiliation_name || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">ORCID</p>
            <p className="text-sm">{profileData.orcid_id || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Bio</p>
            <p className="text-sm">{profileData.bio || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Expertise Areas
            </p>
            <p className="text-sm">
              {Array.isArray(profileData.expertise_areas) &&
              profileData.expertise_areas.length > 0
                ? profileData.expertise_areas.join(", ")
                : "-"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
