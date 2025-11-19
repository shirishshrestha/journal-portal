"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Layers, Users, FileText } from "lucide-react";
import { TaxonomySettings } from "./settings/TaxonomySettings";
import { GeneralSettings } from "./settings/GeneralSettings";
import { StaffSettings } from "./settings/StaffSettings";
import { SubmissionSettings } from "./settings/SubmissionSettings";

export function JournalSettingsDrawer({ journal, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("general");

  if (!journal) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="w-full max-w-4xl">
        <DrawerHeader className="border-b">
          <DrawerTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Journal Settings - {journal?.title}
          </DrawerTitle>
          <DrawerDescription>
            Configure journal settings, taxonomy, staff, and submission rules
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mx-4 mt-4 w-auto">
              <TabsTrigger value="general" className="gap-2">
                <FileText className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="taxonomy" className="gap-2">
                <Layers className="h-4 w-4" />
                Taxonomy
              </TabsTrigger>
              <TabsTrigger value="staff" className="gap-2">
                <Users className="h-4 w-4" />
                Staff
              </TabsTrigger>
              <TabsTrigger value="submissions" className="gap-2">
                <Settings className="h-4 w-4" />
                Submissions
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <TabsContent value="general" className="mt-4">
                <GeneralSettings journal={journal} />
              </TabsContent>

              <TabsContent value="taxonomy" className="mt-4">
                <TaxonomySettings journalId={journal?.id} />
              </TabsContent>

              <TabsContent value="staff" className="mt-4">
                <StaffSettings journalId={journal?.id} />
              </TabsContent>

              <TabsContent value="submissions" className="mt-4">
                <SubmissionSettings journal={journal} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
