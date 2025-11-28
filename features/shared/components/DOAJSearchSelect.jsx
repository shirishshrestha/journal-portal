"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2, BookOpen, Edit3 } from "lucide-react";
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
import { searchDOAJJournals } from "../api/doajApi";
import { useDebounce } from "use-debounce";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import CountryFlag from "react-country-flag";

export function DOAJSearchSelect({
  onSelect,
  placeholder = "Search DOAJ journals...",
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [journals, setJournals] = useState([]);
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  // Fetch journals using useQuery
  const { data: queryData, isFetching: isLoading } = useQuery({
    queryKey: ["doaj-journals", debouncedSearch],
    queryFn: async () => await searchDOAJJournals(debouncedSearch),
    enabled: Boolean(debouncedSearch && debouncedSearch.trim().length >= 2),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setJournals(queryData?.results || []);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [queryData]);

  const handleSelect = (journal) => {
    onSelect(journal);
    setOpen(false);
    setSearchQuery(""); // Optional: clear search after selection
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal hover:bg-muted/30!"
        >
          <span className="text-muted-foreground">{placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search by title or ISSN..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Searching DOAJ...
                  </span>
                </div>
              ) : searchQuery.trim().length < 2 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Type at least 2 characters to search
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 gap-3">
                  <span className="text-sm text-muted-foreground">
                    No journals found
                  </span>
                </div>
              )}
            </CommandEmpty>
            {journals.length > 0 && (
              <CommandGroup heading="DOAJ Results">
                {journals.map((journal) => (
                  <CommandItem
                    key={journal.id}
                    value={journal.title}
                    onSelect={() => handleSelect(journal)}
                    className="cursor-pointer py-3"
                  >
                    <BookOpen className="mr-3 h-4 w-4 shrink-0 opacity-50" />
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {journal.country && (
                        <CountryFlag
                          countryCode={journal.country}
                          svg
                          style={{
                            width: "1.5em",
                            height: "1.5em",
                            borderRadius: "0.25em",
                          }}
                          title={journal.country}
                        />
                      )}
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">
                            {journal.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{journal.publisher?.name}</span>
                        </div>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {journal.issn_print && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0 font-mono"
                            >
                              Print: {journal.issn_print}
                            </Badge>
                          )}
                          {journal.issn_online && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0 font-mono"
                            >
                              Online: {journal.issn_online}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
