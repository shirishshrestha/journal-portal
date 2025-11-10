"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import InfoItem from "../../verification-requests/components/InfoItem";

export function UserDetailsModal({ user, isOpen, onClose, onEdit }) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[85%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Profile Section */}
          <Card>
            <CardContent className="">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.profile.avatar || ""} />
                  <AvatarFallback className="bg-primary/20 text-base">
                    {(
                      user.profile.display_name ||
                      `${user.first_name} ${user.last_name}`
                    )
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {user.profile.display_name ||
                      `${user.first_name} ${user.last_name}`}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex gap-2 pt-2">
                    <Badge variant={user.is_active ? "default" : "outline"}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge
                      className={
                        user.profile.verification_status === "VERIFIED"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                          : ""
                      }
                      variant="secondary"
                    >
                      {user.profile.verification_status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic & Profile Information */}
          <Card>
            <CardContent className="space-y-3 grid grid-cols-1 md:grid-cols-2">
              <InfoItem
                label={"ORCID ID"}
                value={user.profile.orcid_id}
                paraClass="pl-0!"
              />
              <InfoItem
                label={"Affiliation ROR ID"}
                value={user.profile.affiliation_ror_id}
                paraClass="pl-0! font-mono"
              />
              <InfoItem
                label={"Affiliation Name"}
                value={user.profile.affiliation_name}
                paraClass="pl-0!"
              />
              <InfoItem
                label={"OpenAlex ID"}
                value={user.profile.openalex_id}
                paraClass="pl-0! font-mono"
              />
              <InfoItem
                label={"Expertise Areas"}
                value={
                  user.profile.expertise_areas?.length
                    ? user.profile.expertise_areas.join(", ")
                    : undefined
                }
                paraClass="pl-0!"
              />
              <InfoItem
                label={"Bio"}
                value={user.profile.bio}
                paraClass="pl-0!"
              />
            </CardContent>
          </Card>

          {/* Profile Meta & Status */}
          <Card>
            <CardContent className="space-y-3 grid grid-cols-1 md:grid-cols-2">
              <InfoItem
                label="Verification Status"
                value={user.profile.verification_status}
                paraClass="pl-0! font-mono"
              />
              <InfoItem
                label="Profile Created"
                value={
                  user.profile.created_at
                    ? format(new Date(user.profile.created_at), "PPP p")
                    : "-"
                }
                paraClass="pl-0!"
              />
              <InfoItem
                label="Profile Updated"
                value={
                  user.profile.updated_at
                    ? format(new Date(user.profile.updated_at), "PPP p")
                    : "-"
                }
                paraClass="pl-0!"
              />
            </CardContent>
          </Card>

          {/* User Account Information */}
          <Card>
            <CardContent className="space-y-3 grid grid-cols-1 md:grid-cols-2">
              <InfoItem
                label="User ID"
                value={user.id}
                paraClass="pl-0! font-mono"
              />
              <InfoItem label="Email" value={user.email} paraClass="pl-0!" />
              <InfoItem
                label="First Name"
                value={user.first_name}
                paraClass="pl-0!"
              />
              <InfoItem
                label="Last Name"
                value={user.last_name}
                paraClass="pl-0!"
              />
              <InfoItem
                label="Active"
                value={user.is_active ? "Yes" : "No"}
                paraClass="pl-0!"
              />
            </CardContent>
          </Card>

          {/* Activity Information */}
          <Card>
            <CardContent className=" grid grid-cols-1 md:grid-cols-2">
              <InfoItem
                label="Joined"
                value={format(new Date(user.date_joined), "PPP p")}
                paraClass="pl-0!"
              />
              <InfoItem
                label="Last Login"
                value={
                  user.last_login
                    ? format(new Date(user.last_login), "PPP p")
                    : "Never"
                }
                paraClass="pl-0!"
              />
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onEdit(user)}>Edit User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
