import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";

export default function AvatarUpload({
  avatarPreview,
  fileInputRef,
  handleAvatarChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="shrink-0">
        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted dark:bg-slate-900/50 border-2 border-border dark:border-slate-700">
          <Image
            src={avatarPreview || "/placeholder.svg"}
            alt="Profile avatar"
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <p className="font-medium text-foreground">Profile Picture</p>
          <p className="text-sm text-muted-foreground">
            JPG, PNG or GIF. Max 2MB.
          </p>
        </div>
        <div className="inline-flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer bg-transparent"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Change Photo
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>
      </div>
    </div>
  );
}
