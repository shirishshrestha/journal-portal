import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React from "react";

const getStatusBadge = (status) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge className="bg-yellow-500 dark:bg-yellow-600">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge className="bg-emerald-600 dark:bg-emerald-700">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const VerificationRequestList = ({ requests, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-8">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">
          Loading verification requests...
        </span>
      </div>
    );
  }

  function formatRoleRequest(requested_roles) {
    if (!requested_roles || requested_roles.length === 0) return "";

    // Convert all roles to capitalized form
    const formatted = requested_roles.map(
      (role) => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    );

    // Format depending on count
    if (formatted.length === 1) {
      return `${formatted[0]} Role Request`;
    } else if (formatted.length === 2) {
      return `${formatted[0]} & ${formatted[1]} Role Request`;
    } else {
      const last = formatted.pop();
      return `${formatted.join(", ")} & ${last} Role Request`;
    }
  }

  if (!requests || requests.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Verification Requests</h3>
      {requests.map((request) => (
        <Card key={request.id} className="gap-3">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">
                  {formatRoleRequest(request.requested_roles)}
                </CardTitle>
                <CardDescription>
                  Submitted on{" "}
                  {new Date(request.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              {getStatusBadge(request.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Institution
                </p>
                <p className="text-sm">{request.affiliation}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Institutional Email
                </p>
                <p className="text-sm">{request.affiliation_email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Academic Position
                </p>
                <p className="text-sm capitalize">
                  {request.academic_position}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  ORCID Verified
                </p>
                <p className="text-sm">
                  {request.orcid_verified ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Yes {request.orcid_id && `(${request.orcid_id})`}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VerificationRequestList;
