"use client";

import { Controller } from "react-hook-form";
import { RichTextEditor } from "./RichTextEditor";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

/**
 * FormRichTextEditor - Rich text editor component for React Hook Form
 * @param {Object} props
 * @param {Object} props.control - React Hook Form control object
 * @param {string} props.name - Field name
 * @param {string} props.label - Field label
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.description] - Helper text below the field
 * @param {string} [props.form_classname] - Additional className for FormItem
 * @param {number} [props.debounceMs=300] - Debounce delay in milliseconds
 * @param {boolean} [props.autoFocus=false] - Whether to auto-focus on mount
 */
export default function FormRichTextEditor({
  control,
  name,
  label,
  placeholder = "Enter text...",
  description,
  form_classname = "",
  debounceMs = 300,
  autoFocus = false,
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={form_classname}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RichTextEditor
              placeholder={placeholder}
              onChange={(html) => field.onChange(html)}
              initialValue={field.value || ""}
              debounceMs={debounceMs}
              autoFocus={autoFocus}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
}
