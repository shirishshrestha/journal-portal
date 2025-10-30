import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const FormInputField = ({
  control,
  name,
  placeholder,
  label,
  className = "",
  ...props
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              placeholder={placeholder}
              className={className}
              {...field}
              {...props}
            />
          </FormControl>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
};
