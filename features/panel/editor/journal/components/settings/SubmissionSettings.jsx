"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { useGetJournalById } from "@/features";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateSubmissionSettings } from "../../api/journalsApi";

export function SubmissionSettings({ journalId }) {
  // Fetch journal data to get current settings
  const { data: journal, isPending, error } = useGetJournalById(journalId);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    // Submission Guidelines
    submission_guidelines: "",
    author_guidelines: "",
    
    // Review Process
    review_type: "DOUBLE_BLIND",
    min_reviewers: 2,
    review_deadline_days: 21,
    
    // File Requirements
    max_file_size_mb: 25,
    allowed_file_types: "pdf,docx,tex",
    require_cover_letter: true,
    require_conflict_of_interest: true,
    
    // Publication
    publication_frequency: "MONTHLY",
    article_processing_charge: "",
    apc_currency: "USD",
    
    // Additional Settings
    allow_preprints: true,
    require_data_availability: false,
    require_funding_info: true,
  });

  // Update form when journal data loads
  useEffect(() => {
    if (journal?.settings) {
      setFormData(prev => ({ ...prev, ...journal.settings }));
    }
  }, [journal]);

  const updateSettingsMutation = useMutation({
    mutationFn: updateSubmissionSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal", journalId] });
      toast.success("Submission settings saved successfully");
    },
    onError: (error) => {
      console.error("Error saving submission settings:", error);
      toast.error("Failed to save submission settings");
    },
  });

  const handleSave = async () => {
    updateSettingsMutation.mutate({
      journalId,
      settings: formData,
    });
  };

  if (isPending) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-destructive">
            <p>Failed to load submission settings</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Guidelines</CardTitle>
          <CardDescription>
            Instructions and requirements for manuscript submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="submission_guidelines">General Submission Guidelines</Label>
            <Textarea
              id="submission_guidelines"
              value={formData.submission_guidelines}
              onChange={(e) =>
                setFormData({ ...formData, submission_guidelines: e.target.value })
              }
              rows={5}
              placeholder="Enter general guidelines for manuscript submission..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author_guidelines">Author Guidelines</Label>
            <Textarea
              id="author_guidelines"
              value={formData.author_guidelines}
              onChange={(e) =>
                setFormData({ ...formData, author_guidelines: e.target.value })
              }
              rows={5}
              placeholder="Enter specific guidelines for authors..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Review Process */}
      <Card>
        <CardHeader>
          <CardTitle>Review Process</CardTitle>
          <CardDescription>Configure the peer review workflow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="review_type">Review Type</Label>
              <Select
                value={formData.review_type}
                onValueChange={(value) => setFormData({ ...formData, review_type: value })}
              >
                <SelectTrigger id="review_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE_BLIND">Single Blind</SelectItem>
                  <SelectItem value="DOUBLE_BLIND">Double Blind</SelectItem>
                  <SelectItem value="OPEN">Open Review</SelectItem>
                  <SelectItem value="POST_PUBLICATION">Post-Publication Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_reviewers">Minimum Reviewers</Label>
              <Input
                id="min_reviewers"
                type="number"
                min="1"
                max="10"
                value={formData.min_reviewers}
                onChange={(e) =>
                  setFormData({ ...formData, min_reviewers: parseInt(e.target.value) })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="review_deadline_days">Review Deadline (Days)</Label>
              <Input
                id="review_deadline_days"
                type="number"
                min="1"
                max="180"
                value={formData.review_deadline_days}
                onChange={(e) =>
                  setFormData({ ...formData, review_deadline_days: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>File Requirements</CardTitle>
          <CardDescription>Set constraints and requirements for uploaded files</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_file_size_mb">Maximum File Size (MB)</Label>
              <Input
                id="max_file_size_mb"
                type="number"
                min="1"
                max="100"
                value={formData.max_file_size_mb}
                onChange={(e) =>
                  setFormData({ ...formData, max_file_size_mb: parseInt(e.target.value) })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allowed_file_types">Allowed File Types</Label>
              <Input
                id="allowed_file_types"
                value={formData.allowed_file_types}
                onChange={(e) =>
                  setFormData({ ...formData, allowed_file_types: e.target.value })
                }
                placeholder="pdf,docx,tex"
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require_cover_letter">Require Cover Letter</Label>
                <p className="text-sm text-muted-foreground">
                  Authors must submit a cover letter with their manuscript
                </p>
              </div>
              <Switch
                id="require_cover_letter"
                checked={formData.require_cover_letter}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, require_cover_letter: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require_conflict_of_interest">
                  Require Conflict of Interest Statement
                </Label>
                <p className="text-sm text-muted-foreground">
                  Authors must declare any conflicts of interest
                </p>
              </div>
              <Switch
                id="require_conflict_of_interest"
                checked={formData.require_conflict_of_interest}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, require_conflict_of_interest: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publication Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Publication Settings</CardTitle>
          <CardDescription>Configure publication and pricing details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publication_frequency">Publication Frequency</Label>
              <Select
                value={formData.publication_frequency}
                onValueChange={(value) =>
                  setFormData({ ...formData, publication_frequency: value })
                }
              >
                <SelectTrigger id="publication_frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="BIANNUAL">Bi-annual</SelectItem>
                  <SelectItem value="ANNUAL">Annual</SelectItem>
                  <SelectItem value="CONTINUOUS">Continuous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apc_currency">Currency</Label>
              <Select
                value={formData.apc_currency}
                onValueChange={(value) => setFormData({ ...formData, apc_currency: value })}
              >
                <SelectTrigger id="apc_currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="article_processing_charge">
                Article Processing Charge (APC)
              </Label>
              <Input
                id="article_processing_charge"
                type="number"
                min="0"
                step="0.01"
                value={formData.article_processing_charge}
                onChange={(e) =>
                  setFormData({ ...formData, article_processing_charge: e.target.value })
                }
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Leave empty if no charge</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Requirements</CardTitle>
          <CardDescription>Optional submission requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow_preprints">Allow Preprints</Label>
              <p className="text-sm text-muted-foreground">
                Accept manuscripts that have been posted as preprints
              </p>
            </div>
            <Switch
              id="allow_preprints"
              checked={formData.allow_preprints}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, allow_preprints: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require_data_availability">
                Require Data Availability Statement
              </Label>
              <p className="text-sm text-muted-foreground">
                Authors must provide information about data accessibility
              </p>
            </div>
            <Switch
              id="require_data_availability"
              checked={formData.require_data_availability}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, require_data_availability: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require_funding_info">Require Funding Information</Label>
              <p className="text-sm text-muted-foreground">
                Authors must declare funding sources
              </p>
            </div>
            <Switch
              id="require_funding_info"
              checked={formData.require_funding_info}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, require_funding_info: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateSettingsMutation.isPending}>
          {updateSettingsMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Submission Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
