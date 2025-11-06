import React, { useState, useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetOrcidUrl } from "../../hooks";
import { useGetOrcidStatus } from "../../hooks/query/useGetOrcidStatus";
import { useDisconnectOrcid } from "../../hooks/mutation/useDisconnectOrcid";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const OrcidConnection = () => {
  const [isOrcidLinkPending, setIsOrcidLinkPending] = useState(false);
  const queryClient = useQueryClient();

  const { refetch: refetchOrcidLink } = useGetOrcidUrl({
    enabled: false,
  });

  const { data: orcidStatus, isLoading: isLoadingStatus } = useGetOrcidStatus({
    enabled: true,
  });

  const { mutate: disconnectOrcidMutation, isPending: isDisconnecting } =
    useDisconnectOrcid();

  // Listen for ORCID authentication success
  useEffect(() => {
    const handleMessage = (event) => {
      // Filter out React DevTools messages
      if (event.data?.source?.includes("react-devtools")) {
        return;
      }

      // Verify the origin for security
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === "ORCID_SUCCESS") {
        console.log("ORCID authentication successful, fetching status...");

        setIsOrcidLinkPending(false);
        toast.success("ORCID connected successfully!");
        // Fetch the actual ORCID status from API
        queryClient.invalidateQueries(["orcid-status"]);
        localStorage.removeItem("orcid_auth_result");
      } else if (event.data.type === "ORCID_ERROR") {
        setIsOrcidLinkPending(false);
        toast.error("Failed to connect ORCID");
        localStorage.removeItem("orcid_auth_result");
      }
    };

    // Check localStorage periodically for ORCID auth result
    const checkLocalStorage = () => {
      const result = localStorage.getItem("orcid_auth_result");
      if (result) {
        try {
          const parsedResult = JSON.parse(result);
          if (parsedResult.type === "ORCID_SUCCESS") {
            console.log("ORCID authentication successful, fetching status...");
            setIsOrcidLinkPending(false);
            toast.success("ORCID connected successfully!");
            // Fetch the actual ORCID status from API
            queryClient.invalidateQueries(["orcid-status"]);

            localStorage.removeItem("orcid_auth_result");
          } else if (parsedResult.type === "ORCID_ERROR") {
            setIsOrcidLinkPending(false);
            toast.error("Failed to connect ORCID");
            localStorage.removeItem("orcid_auth_result");
          }
        } catch (e) {
          console.error("Error parsing localStorage result:", e);
        }
      }
    };

    // Check localStorage every 500ms
    const storageInterval = setInterval(checkLocalStorage, 500);

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(storageInterval);
    };
  }, [queryClient]);

  const handleConnectOrcid = async () => {
    setIsOrcidLinkPending(true);
    try {
      const response = await refetchOrcidLink();

      if (response.isSuccess && response?.data) {
        // Open in a new tab instead of popup
        window.open(response.data.authorize_url, "_blank");

        // Don't set pending to false immediately, let localStorage polling handle it
      }
    } catch (error) {
      toast.error("Failed to get ORCID authorization URL.");
      setIsOrcidLinkPending(false);
    }
  };

  const handleDisconnectOrcid = () => {
    disconnectOrcidMutation(undefined, {
      onSuccess: () => {
        toast.success("ORCID disconnected successfully!");
        queryClient.invalidateQueries([
          "orcid-status",
          "verification-requests",
        ]);
      },
      onError: (error) => {
        console.error("Failed to disconnect ORCID:", error);
        toast.error("Failed to disconnect ORCID");
      },
    });
  };

  return (
    <Card className="border-border dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Connect ORCID iD
        </CardTitle>
        <CardDescription>
          Link your ORCID profile for verified identity and automatic
          information retrieval
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingStatus ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Loading ORCID status...
            </span>
          </div>
        ) : orcidStatus?.connected ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                    ORCID Connected Successfully
                  </p>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">
                    Your ORCID profile is now linked to your account
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  ORCID iD
                </p>
                <p className="text-lg font-mono text-foreground">
                  {orcidStatus.orcid_id}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge className="bg-emerald-600 dark:bg-emerald-700">
                  {orcidStatus.status}
                </Badge>
              </div>
              {orcidStatus.token_scope && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Token Scope
                  </p>
                  <p className="text-foreground">{orcidStatus.token_scope}</p>
                </div>
              )}
              {orcidStatus.last_sync_at && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Synced
                  </p>
                  <p className="text-foreground">
                    {new Date(orcidStatus.last_sync_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <Button
                onClick={handleDisconnectOrcid}
                variant="destructive"
                size="md"
                disabled={isDisconnecting}
              >
                {isDisconnecting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isDisconnecting ? "Disconnecting..." : "Disconnect ORCID"}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => handleConnectOrcid()}
            className="w-fit"
            size="md"
            disabled={isOrcidLinkPending}
          >
            {isOrcidLinkPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {isOrcidLinkPending ? "Redirecting..." : "Connect ORCID"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OrcidConnection;
