"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export function ActivityLogFilters({
  actionFilter,
  resourceFilter,
  actorFilter,
  searchQuery,
  onActionChange,
  onResourceChange,
  onActorChange,
  onSearchChange,
}) {
  const actionTypes = [
    { value: "all", label: "All Actions" },
    { value: "LOGIN", label: "Login" },
    { value: "LOGOUT", label: "Logout" },
    { value: "CREATE", label: "Create" },
    { value: "READ", label: "Read" },
    { value: "UPDATE", label: "Update" },
    { value: "DELETE", label: "Delete" },
    { value: "SUBMIT", label: "Submit" },
    { value: "REVIEW", label: "Review" },
    { value: "APPROVE", label: "Approve" },
    { value: "REJECT", label: "Reject" },
    { value: "PUBLISH", label: "Publish" },
    { value: "WITHDRAW", label: "Withdraw" },
  ];

  const resourceTypes = [
    { value: "all", label: "All Resources" },
    { value: "USER", label: "User" },
    { value: "PROFILE", label: "Profile" },
    { value: "SUBMISSION", label: "Submission" },
    { value: "DOCUMENT", label: "Document" },
    { value: "REVIEW", label: "Review" },
    { value: "JOURNAL", label: "Journal" },
    { value: "PLAGIARISM_REPORT", label: "Plagiarism Report" },
    { value: "FORMAT_CHECK", label: "Format Check" },
  ];

  const actorTypes = [
    { value: "all", label: "All Actors" },
    { value: "USER", label: "User" },
    { value: "SYSTEM", label: "System" },
    { value: "API", label: "API" },
    { value: "INTEGRATION", label: "Integration" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-card border rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="action-filter">Action Type</Label>
        <Select value={actionFilter} onValueChange={onActionChange}>
          <SelectTrigger id="action-filter">
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            {actionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resource-filter">Resource Type</Label>
        <Select value={resourceFilter} onValueChange={onResourceChange}>
          <SelectTrigger id="resource-filter">
            <SelectValue placeholder="Select resource" />
          </SelectTrigger>
          <SelectContent>
            {resourceTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="actor-filter">Actor Type</Label>
        <Select value={actorFilter} onValueChange={onActorChange}>
          <SelectTrigger id="actor-filter">
            <SelectValue placeholder="Select actor" />
          </SelectTrigger>
          <SelectContent>
            {actorTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
    </div>
  );
}
