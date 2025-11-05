import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

export const MultiSelect = ({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select options",
  error,
}) => {
  const [open, setOpen] = React.useState(false);

  const toggleOption = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const displayNodes =
    selected.length > 0 ? (
      options
        .filter((opt) => selected.includes(opt.value))
        .map((opt) => (
          <span
            key={opt.value}
            className="inline-flex items-center px-4 py-1 rounded-full text-xs font-medium bg-border text-foreground "
          >
            {opt.label}
          </span>
        ))
    ) : (
      <span className="text-[14px]">{placeholder}</span>
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div
          className={`${
            error &&
            "ring-destructive/20 dark:ring-destructive/40 border-destructive"
          } flex gap-2 items-center flex-wrap border rounded-lg py-1 h-9 px-3 capitalize aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive`}
        >
          {displayNodes}
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className=" p-0">
        <Command className={"w-full"}>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => toggleOption(option.value)}
                className="flex items-center justify-between capitalize"
              >
                {option.label}
                <Checkbox checked={selected.includes(option.value)} />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
