"use client";

import { createContext, useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const FilterToolbarContext = createContext();

const useFilterToolbarContext = () => {
  const context = useContext(FilterToolbarContext);
  if (!context) {
    throw new Error(
      "FilterToolbar compound components must be used within FilterToolbar"
    );
  }
  return context;
};

/**
 * FilterToolbar - A reusable compound component for filtering data
 *
 * @example
 * <FilterToolbar>
 *   <FilterToolbar.Search
 *     value={searchTerm}
 *     onChange={setSearchTerm}
 *     placeholder="Search..."
 *   />
 *   <FilterToolbar.Select
 *     label="Status"
 *     value={statusFilter}
 *     onChange={setStatusFilter}
 *     options={[
 *       { value: "all", label: "All Status" },
 *       { value: "active", label: "Active" }
 *     ]}
 *   />
 * </FilterToolbar>
 */
export function FilterToolbar({ children, className = "" }) {
  return (
    <FilterToolbarContext.Provider value={{}}>
      <Card className={className}>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            {children}
          </div>
        </CardContent>
      </Card>
    </FilterToolbarContext.Provider>
  );
}

/**
 * FilterToolbar.Search - Search input component
 */
FilterToolbar.Search = function FilterToolbarSearch({
  value,
  onChange,
  placeholder = "Search...",
  label = "Search",
  className = "",
}) {
  useFilterToolbarContext(); // Validate context

  return (
    <div className={`flex-1 ${className}`}>
      <label className="text-sm font-medium text-muted-foreground block mb-2">
        {label}
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

/**
 * FilterToolbar.Select - Select dropdown component
 */
FilterToolbar.Select = function FilterToolbarSelect({
  value,
  onChange,
  options = [],
  label,
  placeholder = "Select...",
  className = "",
}) {
  useFilterToolbarContext(); // Validate context

  return (
    <div className={`w-full lg:w-40 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-muted-foreground block mb-2">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

/**
 * FilterToolbar.DateInput - Date input component
 */
FilterToolbar.DateInput = function FilterToolbarDateInput({
  value,
  onChange,
  label = "Date",
  className = "",
}) {
  useFilterToolbarContext(); // Validate context

  return (
    <div className={`w-full lg:w-48 ${className}`}>
      <label className="text-sm font-medium text-muted-foreground block mb-2">
        {label}
      </label>
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

/**
 * FilterToolbar.Input - Generic text input component
 */
FilterToolbar.Input = function FilterToolbarInput({
  value,
  onChange,
  label,
  placeholder = "",
  type = "text",
  className = "",
}) {
  useFilterToolbarContext(); // Validate context

  return (
    <div className={`w-full lg:w-48 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-muted-foreground block mb-2">
          {label}
        </label>
      )}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
