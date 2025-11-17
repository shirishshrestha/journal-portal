import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import RespondToInfoRequestDialog from "./RespondToInfoRequestDialog";
import { useWithdrawVerificationRequest } from "../../hooks/mutation/useWithdrawVerificationRequest";
import { Button } from "@/components/ui/button";

const getStatusBadge = (status, onRespond) => {
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
    case "INFO_REQUESTED":
      return (
        <span className="flex items-center gap-2">
          <Button
            type="button"
            size={"sm"}
            className={"text-xs px-4 py-0! leading-[0.2]"}
            onClick={onRespond}
          >
            Respond
          </Button>
          <Badge className="bg-blue-600 dark:bg-blue-700">
            <Clock className="w-3 h-3 mr-1" />
            Info Requested
          </Badge>
        </span>
      );
    case "REJECTED":
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    case "WITHDRAWN":
      return (
        <Badge className="bg-gray-400 dark:bg-gray-700 text-white dark:text-gray-200">
          <XCircle className="w-3 h-3 mr-1" />
          Withdrawn
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const VerificationRequestList = ({ requests }) => {
  const [respondRequest, setRespondRequest] = React.useState(null);
  const withdrawMutation = useWithdrawVerificationRequest();

  function formatRoleRequest(requested_roles) {
    if (!requested_roles || requested_roles?.length === 0) return "";

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

  // Helper to render a single request card
  const renderRequestCard = (request) => (
    <Card key={request.id} className="gap-3">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">
              {formatRoleRequest(request.requested_roles)}
            </CardTitle>
            <CardDescription>
              Submitted on {new Date(request.created_at).toLocaleDateString()}
            </CardDescription>
          </div>
          {getStatusBadge(
            request.status,
            request.status === "INFO_REQUESTED"
              ? () => setRespondRequest(request)
              : undefined
          )}
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
            <p className="text-sm capitalize">{request.academic_position}</p>
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
        {/* Extra info fields, only if present */}

        {request.rejection_reason && (
          <div className="mt-2 p-2 rounded-lg bg-destructive/10">
            <p className="text-xs font-medium capitalize text-destructive mb-1">
              Rejection Reason
            </p>
            <p className="text-sm capitalize text-muted-foreground">
              {request.rejection_reason}
            </p>
          </div>
        )}
        {request.additional_info_requested && (
          <div className="mt-2 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <p className="text-xs font-medium capitalize text-blue-700 dark:text-blue-300 mb-1">
              Additional Info Requested
            </p>
            <p className="text-sm capitalize text-muted-foreground">
              {request.additional_info_requested}
            </p>
          </div>
        )}
        {request.status === "INFO_REQUESTED" && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-100">
              <span className="font-semibold">Note:</span> If the additional
              requested info is not part of the form (eg. connect ORCID),
              complete it first, then click ‘Respond’ and submit the form
              without any changes to notify the admin.
            </p>
          </div>
        )}
        {(request.status === "PENDING" ||
          request.status === "INFO_REQUESTED") && (
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="text-xs px-4 py-0! leading-[0.2]"
            onClick={() => withdrawMutation.mutate(request.id)}
            disabled={
              withdrawMutation.isPending &&
              withdrawMutation.variables === request.id
            }
          >
            {withdrawMutation.isPending &&
            withdrawMutation.variables === request.id
              ? "Withdrawing..."
              : "Withdraw Request"}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const [first, ...rest] = requests;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Verification Requests</h3>
      {renderRequestCard(first)}
      {rest.length > 0 && (
        <Accordion type="single" collapsible className="mt-2 ">
          <AccordionItem value="older-requests">
            <AccordionTrigger className="text-sm font-medium bg-card px-6 mb-2 border-border border">
              Show Older Requests
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              {rest.map(renderRequestCard)}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      {respondRequest && (
        <RespondToInfoRequestDialog
          request={respondRequest}
          open={!!respondRequest}
          onClose={() => setRespondRequest(null)}
        />
      )}
    </div>
  );
};

export default VerificationRequestList;
