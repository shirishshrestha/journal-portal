import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfileInfoCard({
  profileData,
  setShowEditForm,
  showEditForm,
}) {
  if (!profileData) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className={"pb-1"}>Profile Information</CardTitle>
            <CardDescription>
              {" "}
              Last updated:{" "}
              {profileData.updated_at
                ? new Date(profileData.updated_at).toLocaleDateString()
                : "-"}
            </CardDescription>
          </div>
          <Button
            className=""
            variant="secondary"
            onClick={() => setShowEditForm(true)}
            disabled={showEditForm}
            size={"sm"}
          >
            Edit Profile
          </Button>
        </div>
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
            <div className="flex items-center gap-2">
              <p className="text-sm">{profileData.affiliation_name || "-"}</p>
              {profileData.affiliation_ror_id && (
                <a
                  href={`https://ror.org/${profileData.affiliation_ror_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs bg-secondary hover:bg-secondary/80 text-primary-foreground px-2 py-0.5 rounded font-mono transition-colors"
                  title="View on ROR Registry"
                >
                  ROR: {profileData.affiliation_ror_id}
                </a>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">ORCID</p>
            <p className="text-sm">{profileData.orcid_id || "-"}</p>
          </div>

          <div className="space-y-1 col-span-1 md:col-span-2">
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
          <div className="space-y-1 col-span-1 md:col-span-2">
            <p className="text-sm font-medium text-muted-foreground">Bio</p>
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: profileData.bio || "<p>No Bio</p>",
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
