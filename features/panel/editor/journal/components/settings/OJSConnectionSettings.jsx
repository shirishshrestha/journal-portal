"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  Link2,
  Unlink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useGetOJSStatus } from "../../hooks/query/useGetOJSStatus";
import { useConfigureOJSConnection } from "../../hooks/mutation/useConfigureOJSConnection";
import { useDisconnectOJS } from "../../hooks/mutation/useDisconnectOJS";
import { LoadingScreen, ErrorCard } from "@/features/shared";
import ConfirmationPopup from "@/features/shared/components/ConfirmationPopup";
import Image from "next/image";
import { useTheme } from "next-themes";

const ojsConnectionSchema = z.object({
  ojs_api_url: z
    .string()
    .url("Must be a valid URL")
    .min(1, "API URL is required")
    .refine((val) => val.endsWith("/api"), {
      message: "API URL must end with /api/v1",
    }),
  ojs_api_key: z.string().min(1, "API Key is required"),
  ojs_journal_id: z.coerce.number().min(1, "Journal ID must be at least 1"),
  ojs_enabled: z.boolean().default(true),
});

export function OJSConnectionSettings({ journalId }) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    data: ojsStatus,
    isPending: isLoadingStatus,
    error: statusError,
    refetch: refetchStatus,
  } = useGetOJSStatus(journalId);

  const configureOJSMutation = useConfigureOJSConnection();
  const disconnectOJSMutation = useDisconnectOJS();

  const { resolvedTheme } = useTheme();

  const form = useForm({
    resolver: zodResolver(ojsConnectionSchema),
    defaultValues: {
      ojs_api_url: "",
      ojs_api_key: "",
      ojs_journal_id: 0,
      ojs_enabled: true,
    },
  });

  // Update form when OJS status is fetched
  useEffect(() => {
    if (ojsStatus && ojsStatus.connected) {
      form.reset({
        ojs_api_url: ojsStatus.ojs_api_url || "",
        ojs_api_key: ojsStatus.ojs_api_key || "",
        ojs_journal_id: ojsStatus.ojs_journal_id || 0,
        ojs_enabled: ojsStatus.ojs_enabled ?? true,
      });
    }
  }, [ojsStatus, form]);

  const handleSubmit = (data) => {
    configureOJSMutation.mutate({
      journalId,
      data,
    });
  };

  const handleDisconnect = () => {
    setIsDisconnecting(true);
    disconnectOJSMutation.mutate(journalId, {
      onSettled: () => {
        setIsDisconnecting(false);
        setIsConfirmOpen(false);
      },
    });
  };

  if (isLoadingStatus) {
    return <LoadingScreen />;
  }

  if (statusError) {
    return (
      <ErrorCard
        title="Failed to load OJS status"
        description={
          statusError?.message || "Unable to fetch OJS connection status"
        }
        onRetry={refetchStatus}
      />
    );
  }

  const isConnected = ojsStatus?.ojs_configured;

  return (
    <div className="space-y-6">
      {/* Connection Status Card */}
      {isConnected && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {resolvedTheme === "light" ? (
                  <Image
                    src="/ojs.png"
                    alt="OJS Logo"
                    width={55}
                    height={55}
                    className="inline-block  h-fit"
                  />
                ) : (
                  <Image
                    src="/ojs-white.png"
                    alt="OJS Logo"
                    width={55}
                    height={55}
                    className="inline-block  h-fit"
                  />
                )}
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <CardTitle>OJS Connected</CardTitle>
              </div>
              <Badge variant="success" className="bg-green-600">
                Active
              </Badge>
            </div>
            <CardDescription>
              Your journal is successfully connected to Open Journal Systems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  API URL
                </p>
                <p className="text-sm font-mono break-all">
                  {ojsStatus.ojs_api_url}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  OJS Journal ID
                </p>
                <p className="text-sm">{ojsStatus.ojs_journal_id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <p className="text-sm">
                  {ojsStatus.ojs_enabled ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsConfirmOpen(true)}
                disabled={isDisconnecting || disconnectOJSMutation.isPending}
              >
                <Unlink className="h-4 w-4 mr-2" />
                Disconnect OJS
              </Button>
              <ConfirmationPopup
                open={isConfirmOpen}
                onOpenChange={(open) => {
                  setIsConfirmOpen(open);
                  disconnectOJSMutation.reset();
                }}
                title="Disconnect OJS"
                description="Are you sure you want to disconnect from OJS? This action cannot be undone."
                confirmText="Disconnect"
                cancelText="Cancel"
                variant="danger"
                icon={<Unlink className="h-6 w-6 text-red-600" />}
                onConfirm={handleDisconnect}
                isPending={isDisconnecting || disconnectOJSMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Form */}
      {!isConnected && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  <CardTitle>Connect to OJS</CardTitle>
                </div>
                <CardDescription>
                  Configure connection to Open Journal Systems for seamless
                  integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="ojs_api_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        OJS API URL <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://your-ojs-instance.com/api/v1"
                          type="url"
                        />
                      </FormControl>
                      <FormDescription>
                        The base URL of your OJS API endpoint
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ojs_api_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        API Key <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your OJS API key"
                          type="text"
                        />
                      </FormControl>
                      <FormDescription>
                        Your OJS API authentication key
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ojs_journal_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        OJS Journal ID{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="1"
                          type="number"
                          min="1"
                        />
                      </FormControl>
                      <FormDescription>
                        The journal ID in your OJS system
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ojs_enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <div className="space-y-0.5">
                        <FormLabel>Enable OJS Integration</FormLabel>
                        <FormDescription>
                          Activate synchronization with OJS
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  configureOJSMutation.isPending || !form.formState.isDirty
                }
              >
                {configureOJSMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Connect to OJS
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
