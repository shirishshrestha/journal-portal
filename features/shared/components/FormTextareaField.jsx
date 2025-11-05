import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export const FormTextareaField = ({
  control,
  name,
  placeholder,
  label,
  className = "",
  description,
  form_classname = "",
  ...props
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${form_classname}`}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className={`${className} min-h-[100px]`}
              {...field}
              {...props}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
};
