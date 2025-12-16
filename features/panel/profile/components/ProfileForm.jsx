"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormRichTextEditor } from "@/features";
import { Loader2, Check, X, Plus } from "lucide-react";
import { profileSchema } from "../../reader/utils/FormSchema";
import { Badge } from "@/components/ui/badge";
import { InstitutionSearchSelect } from "@/features";
import { useGetRORInstitution } from "@/features/shared/hooks/useGetRORInstitution";
import ReactCountryFlag from "react-country-flag";
import { getPlainTextLength } from "@/features/shared/utils";

export default function ProfileForm({
  defaultValues,
  saveSuccess,
  onSubmit,
  onCancel,
  isPending,
}) {
  const [expertiseAreas, setExpertiseAreas] = useState([]);
  const [newExpertise, setNewExpertise] = useState("");
  const [currentRorId, setCurrentRorId] = useState(
    defaultValues?.affiliation_ror_id || ""
  );

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  // Fetch ROR institution data based on current ROR ID
  const { data: rorInstitution, isPending: isRorLoading } =
    useGetRORInstitution(currentRorId, {
      enabled: Boolean(currentRorId),
    });

  // Pre-populate institution name from ROR data if available
  useEffect(() => {
    if (rorInstitution && !form.getValues("affiliation_name")) {
      form.setValue("affiliation_name", rorInstitution.name, {
        shouldDirty: false,
      });
    }
  }, [rorInstitution, form]);

  // Initialize expertise areas from default values
  useEffect(() => {
    if (defaultValues?.expertise_areas) {
      const areas =
        typeof defaultValues.expertise_areas === "string"
          ? defaultValues.expertise_areas
              .split(",")
              .map((area) => area.trim())
              .filter(Boolean)
          : Array.isArray(defaultValues.expertise_areas)
          ? defaultValues.expertise_areas
          : [];
      setExpertiseAreas(areas);
    }
  }, [defaultValues?.expertise_areas]);

  const handleAddExpertise = () => {
    const trimmedExpertise = newExpertise.trim();
    if (trimmedExpertise && !expertiseAreas.includes(trimmedExpertise)) {
      const updatedAreas = [...expertiseAreas, trimmedExpertise];
      setExpertiseAreas(updatedAreas);
      form.setValue("expertise_areas", updatedAreas, { shouldDirty: true });
      setNewExpertise("");
    }
  };

  const handleRemoveExpertise = (indexToRemove) => {
    const updatedAreas = expertiseAreas.filter(
      (_, index) => index !== indexToRemove
    );
    setExpertiseAreas(updatedAreas);
    form.setValue("expertise_areas", updatedAreas, { shouldDirty: true });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddExpertise();
    }
  };

  const handleFormSubmit = (data) => {
    // Ensure expertise_areas is sent as an array and include affiliation fields
    const formattedData = {
      ...data,
      expertise_areas: expertiseAreas,
      affiliation_ror_id: form.getValues("affiliation_ror_id") || "",
      affiliation_name: form.getValues("affiliation_name") || "",
    };
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">
            Personal Information
          </h3>
          <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dr. Sarah Chen" {...field} />
                  </FormControl>
                  <FormDescription>
                    How your name appears on your profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Academic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">
            Academic Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div>
              <FormField
                control={form.control}
                name="affiliation_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution/Organization</FormLabel>
                    <FormControl>
                      <InstitutionSearchSelect
                        value={field.value}
                        onChange={field.onChange}
                        onRorIdChange={(rorId) => {
                          form.setValue("affiliation_ror_id", rorId, {
                            shouldDirty: true,
                          });
                          setCurrentRorId(rorId);
                        }}
                        placeholder="e.g., Stanford University"
                      />
                    </FormControl>
                    <FormDescription>
                      Search and select your current academic or research
                      institution
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isRorLoading && currentRorId && (
                <p className="flex items-center gap-2 text-sm mt-2">
                  <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />{" "}
                  Loading institution...
                </p>
              )}
              {!isRorLoading && rorInstitution && (
                <div className="cursor-pointer py-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <ReactCountryFlag
                      countryCode={rorInstitution.country_code || ""}
                      svg
                      style={{
                        width: "2em",
                        height: "2em",
                        borderRadius: "0.25em",
                      }}
                      title={rorInstitution.country}
                    />
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">
                          {rorInstitution.name}
                        </span>
                        {rorInstitution.acronyms?.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ({rorInstitution.acronyms.join(", ")})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{rorInstitution.location}</span>
                        {rorInstitution.established && (
                          <>
                            <span>•</span>
                            <span>Est. {rorInstitution.established}</span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {rorInstitution.id && (
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0 font-mono"
                          >
                            ROR:{" "}
                            {rorInstitution.id.replace("https://ror.org/", "")}
                          </Badge>
                        )}
                        {rorInstitution.types?.length > 0 &&
                          rorInstitution.types.map((type) => (
                            <Badge
                              key={type}
                              variant="secondary"
                              className="text-xs px-2 py-0"
                            >
                              {type}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Expertise Areas - Dynamic Multi-Item Input */}
            <FormItem>
              <FormLabel>Expertise Areas</FormLabel>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Genomics, Machine Learning"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddExpertise}
                    variant="outline"
                    size="icon"
                    disabled={!newExpertise.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <FormDescription>
                Add your areas of expertise one at a time
              </FormDescription>
              {/* Display expertise areas as badges */}
              {expertiseAreas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {expertiseAreas.map((area, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 text-sm flex items-center gap-1"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => handleRemoveExpertise(index)}
                        className="ml-1 cursor-pointer hover:text-secondary-foreground transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </FormItem>
          </div>
        </div>
        {/* Bio Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">About</h3>
          <FormRichTextEditor
            control={form.control}
            name="bio"
            label="Bio"
            placeholder="Tell us about yourself, your research interests, and professional background..."
            description={`${getPlainTextLength(
              form.watch("bio")
            )}/500 characters`}
          />
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isPending || saveSuccess || !form.formState.isDirty}
            className="w-fit"
          >
            {saveSuccess && <Check className="w-4 h-4 mr-2" />}
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {saveSuccess
              ? "Saved Successfully"
              : isPending
              ? "Saving..."
              : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
