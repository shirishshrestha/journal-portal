"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2, Building2, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { searchRORInstitutions } from "../api/rorApi";
import { useDebounce } from "use-debounce";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import CountryFlag from "react-country-flag";

export function InstitutionSearchSelect({
  value,
  onChange,
  placeholder,
  onRorIdChange,
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [institutions, setInstitutions] = useState([]);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualValue, setManualValue] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  // Fetch institutions using useQuery
  const {
    data: queryData,
    isFetching: isLoading,
    isError,
  } = useQuery({
    queryKey: ["institutions", debouncedSearch],
    queryFn: async () => await searchRORInstitutions(debouncedSearch),
    enabled: Boolean(debouncedSearch && debouncedSearch.trim().length >= 2),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setInstitutions(queryData?.results || []);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [queryData]);

  const handleSelect = (institution) => {
    onChange(institution.name);

    // Extract ROR ID from the full URL (e.g., "https://ror.org/02rg1r889" -> "02rg1r889")
    if (institution.id && onRorIdChange) {
      const rorId = institution.id.replace("https://ror.org/", "");
      onRorIdChange(rorId);
    }

    setManualEntry(false);
    setOpen(false);
  };

  const handleManualEntry = () => {
    setManualEntry(true);
    setManualValue(value || "");
  };

  const handleManualSave = () => {
    if (manualValue.trim()) {
      onChange(manualValue.trim());
      // Clear ROR ID when manual entry is used
      if (onRorIdChange) {
        onRorIdChange("");
      }
      setManualEntry(false);
      setOpen(false);
    }
  };

  const handleManualCancel = () => {
    setManualEntry(false);
    setManualValue("");
  };

  const displayValue = value || placeholder || "Select institution...";

  if (manualEntry) {
    return (
      <div className="flex gap-2">
        <Input
          value={manualValue}
          onChange={(e) => setManualValue(e.target.value)}
          placeholder="Enter institution name manually"
          className="flex-1"
          autoFocus
        />
        <Button
          type="button"
          onClick={handleManualSave}
          size="sm"
          disabled={!manualValue.trim()}
        >
          Save
        </Button>
        <Button
          type="button"
          onClick={handleManualCancel}
          variant="outline"
          size="sm"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal hover:bg-muted/30!"
        >
          <span className={cn(!value && "text-muted-foreground")}>
            {displayValue}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search institutions..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Searching institutions...
                  </span>
                </div>
              ) : searchQuery.trim().length < 2 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Type at least 2 characters to search
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 gap-3">
                  <span className="text-sm text-muted-foreground">
                    No institutions found
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleManualEntry();
                      setOpen(false);
                    }}
                    className="gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Enter manually
                  </Button>
                </div>
              )}
            </CommandEmpty>
            {institutions.length > 0 && (
              <>
                <CommandGroup>
                  {institutions.map((institution) => (
                    <CommandItem
                      key={institution.id}
                      value={institution.name}
                      onSelect={() => handleSelect(institution)}
                      className="cursor-pointer py-3"
                    >
                      <Check
                        className={cn(
                          "mr-3 h-4 w-4 shrink-0",
                          value === institution.name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <CountryFlag
                          countryCode={institution.country_code || ""}
                          svg
                          style={{
                            width: "2em",
                            height: "2em",
                            borderRadius: "0.25em",
                          }}
                          title={institution.country}
                        />
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">
                              {institution.name}
                            </span>
                            {institution.acronyms?.length > 0 && (
                              <span className="text-xs text-muted-foreground">
                                ({institution.acronyms.join(", ")})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{institution.location}</span>
                            {institution.established && (
                              <>
                                <span>•</span>
                                <span>Est. {institution.established}</span>
                              </>
                            )}
                          </div>
                          <div className="flex gap-1 flex-wrap mt-1">
                            {institution.id && (
                              <Badge
                                variant="outline"
                                className="text-xs px-2 py-0 font-mono"
                              >
                                ROR:{" "}
                                {institution.id.replace("https://ror.org/", "")}
                              </Badge>
                            )}
                            {institution.types?.length > 0 &&
                              institution.types.map((type) => (
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
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      handleManualEntry();
                      setOpen(false);
                    }}
                    className="cursor-pointer justify-center text-muted-foreground"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Enter institution manually
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
