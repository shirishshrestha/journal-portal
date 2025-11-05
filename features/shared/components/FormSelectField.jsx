import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FormSelectField = ({
  control,
  name,
  label,
  placeholder,
  description,
  options = [], 
  className = "",
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`items-start flex flex-col ${className}`}>
          {label && <FormLabel>{label}</FormLabel>}

          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder || "Select an option"} />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.id || option.value}
                  value={option.id || option.value}
                >
                  {option.name || option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {description && (
            <FormDescription className="text-sm text-muted-foreground mt-1">
              {description}
            </FormDescription>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
