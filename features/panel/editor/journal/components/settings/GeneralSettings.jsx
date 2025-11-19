"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useUpdateJournal } from "@/features";

export function GeneralSettings({ journal }) {
  const [formData, setFormData] = useState({
    title: journal?.title || "",
    short_name: journal?.short_name || "",
    publisher: journal?.publisher || "",
    description: journal?.description || "",
    issn_print: journal?.issn_print || "",
    issn_online: journal?.issn_online || "",
    website_url: journal?.website_url || "",
    contact_email: journal?.contact_email || "",
    is_active: journal?.is_active ?? true,
    is_accepting_submissions: journal?.is_accepting_submissions ?? true,
  });

  // Update form when journal data changes
  useEffect(() => {
    if (journal) {
      setFormData({
        title: journal.title || "",
        short_name: journal.short_name || "",
        publisher: journal.publisher || "",
        description: journal.description || "",
        issn_print: journal.issn_print || "",
        issn_online: journal.issn_online || "",
        website_url: journal.website_url || "",
        contact_email: journal.contact_email || "",
        is_active: journal.is_active ?? true,
        is_accepting_submissions: journal.is_accepting_submissions ?? true,
      });
    }
  }, [journal]);

  const updateJournalMutation = useUpdateJournal({
    onSuccess: () => {
      toast.success("General settings saved successfully");
    },
    onError: (error) => {
      toast.error(`Failed to save settings: ${error.message}`);
    },
  });

  const handleSave = async () => {
    if (!journal?.id) {
      toast.error("Journal ID not found");
      return;
    }

    console.log("Saving journal data:", { id: journal.id, ...formData });
    updateJournalMutation.mutate({
      id: journal.id,
      ...formData,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update journal's basic details and identification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Journal Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="International Journal of..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short_name">Short Name</Label>
              <Input
                id="short_name"
                value={formData.short_name}
                onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                placeholder="IJCS"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publisher">Publisher</Label>
            <Input
              id="publisher"
              value={formData.publisher}
              onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              placeholder="Academic Press"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="A peer-reviewed journal covering..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ISSN Numbers</CardTitle>
          <CardDescription>
            International Standard Serial Numbers for print and online
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issn_print">ISSN Print</Label>
              <Input
                id="issn_print"
                value={formData.issn_print}
                onChange={(e) => setFormData({ ...formData, issn_print: e.target.value })}
                placeholder="1234-5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issn_online">ISSN Online</Label>
              <Input
                id="issn_online"
                value={formData.issn_online}
                onChange={(e) => setFormData({ ...formData, issn_online: e.target.value })}
                placeholder="8765-4321"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Journal's website and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              placeholder="https://journal.example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              placeholder="editor@journal.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Settings</CardTitle>
          <CardDescription>
            Control journal visibility and submission acceptance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Active Status</Label>
              <p className="text-sm text-muted-foreground">
                Make this journal visible and accessible
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_accepting_submissions">Accept Submissions</Label>
              <p className="text-sm text-muted-foreground">
                Allow new manuscript submissions
              </p>
            </div>
            <Switch
              id="is_accepting_submissions"
              checked={formData.is_accepting_submissions}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_accepting_submissions: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateJournalMutation.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updateJournalMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
