import React, { useState } from "react";
import { orcidSchema } from "../../utils/FormSchema";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { FormInputField } from "@/features/shared";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const OrcidConnection = () => {
  const [orcidConnected, setOrcidConnected] = useState(false);
  const [orcidData, setOrcidData] = useState(null);

  const orcidForm = useForm({
    resolver: zodResolver(orcidSchema),
    defaultValues: {
      orcid_id: "",
    },
  });

  const onOrcidSubmit = async (data) => {
    try {
      // Simulate API call to GET /api/v1/users/orcid/connect/
      // const response = await fetch("/api/v1/users/orcid/connect/", {
      //   headers: { Authorization: "Bearer {access_token}" },
      // })
      // const { authorization_url } = await response.json()
      // window.open(authorization_url, "orcid-popup", "width=500,height=600")

      const mockAuthUrl = "https://orcid.org/oauth/authorize";
      window.open(mockAuthUrl, "orcid-popup", "width=500,height=600");

      // Simulate callback
      setTimeout(() => {
        setOrcidConnected(true);
        setOrcidData({
          orcid_id: data.orcid_id,
          name: "Dr. Sarah Chen",
          email: "researcher@university.edu",
          status: "CONNECTED",
        });
      }, 2000);
    } catch (error) {
      console.error("ORCID connection error:", error);
    }
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
        {orcidConnected && orcidData ? (
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
                  {orcidData.orcid_id}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge className="bg-emerald-600 dark:bg-emerald-700">
                  {orcidData.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-foreground">{orcidData.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-foreground">{orcidData.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <Form {...orcidForm}>
            <form
              onSubmit={orcidForm.handleSubmit(onOrcidSubmit)}
              className="space-y-4"
            >
              <FormInputField
                control={orcidForm.control}
                name="orcid_id"
                placeholder={"XXXX-XXXX-XXXX-XXXXX"}
                label={"Enter Your ORCID iD"}
                description={
                  "Format: XXXX-XXXX-XXXX-XXXXX (e.g., 0000-0002-1234-5678)"
                }
              />

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-semibold text-blue-900 dark:text-blue-100">
                      Secure Connection
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      After submitting your ORCID iD, you&apos;ll be redirected
                      to ORCID.org to authorize the connection.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-fit" size="md">
                {orcidForm.formState.isSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {orcidForm.formState.isSubmitting
                  ? "Connecting..."
                  : "Connect ORCID"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default OrcidConnection;
