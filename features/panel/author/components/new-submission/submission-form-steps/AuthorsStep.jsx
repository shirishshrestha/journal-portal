// AuthorsStep.jsx
import { useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { useWatch } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InstitutionSearchSelect } from '@/features';
import CoAuthorInstitutionDetails from './CoAuthorInstitutionDetails';

export default function AuthorsStep({
  form,
  handleAddCoauthor,
  handleRemoveCoauthor,
  coauthorRoles = [],
}) {
  const coAuthors = useWatch({
    control: form.control,
    name: 'co_authors',
    defaultValue: [],
  });

  // Helper to handle institution selection and ROR assignment
  const handleInstitutionChange = useCallback(
    (index, val, rorId) => {
      form.setValue(`co_authors.${index}.institution`, val || '', {
        shouldDirty: true,
      });
      if (rorId) {
        form.setValue(`co_authors.${index}.affiliation_ror_id`, rorId, {
          shouldDirty: true,
        });
      } else {
        form.setValue(`co_authors.${index}.affiliation_ror_id`, '', {
          shouldDirty: true,
        });
      }
    },
    [form]
  );

  // Default roles if none provided from backend
  const defaultRoles = useMemo(() => ['Co-Author', 'Researcher', 'Contributor'], []);
  const availableRoles = useMemo(() => {
    const roles = coauthorRoles.length > 0 ? coauthorRoles : defaultRoles;
    // Filter out empty strings to prevent Select.Item validation errors
    return roles.filter((role) => role && role.trim() !== '');
  }, [coauthorRoles, defaultRoles]);

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-muted/50 border border-border">
        <h3 className="font-semibold text-foreground">Corresponding Author</h3>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="corresponding_author.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="corresponding_author.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="corresponding_author.institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-foreground">Co-Authors</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCoauthor}
            className="gap-2 bg-transparent"
          >
            <Plus className="h-4 w-4" /> Add Co-Author
          </Button>
        </div>
        {coAuthors?.map((_, index) => (
          <Card key={index} className="p-4 gap-2 bg-muted/30 border border-border">
            <div className="flex items-start justify-between ">
              <h4 className="font-medium text-foreground">Co-Author {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCoauthor(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`co_authors.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`co_authors.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name={`co_authors.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <InstitutionSearchSelect
                          value={field.value}
                          onChange={field.onChange}
                          onRorIdChange={(rorId) => {
                            form.setValue(`co_authors.${index}.affiliation_ror_id`, rorId, {
                              shouldDirty: true,
                            });
                          }}
                          placeholder="e.g., Stanford University"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* ROR Institution display (always render, handles null/empty internally) */}
                <CoAuthorInstitutionDetails rorId={coAuthors[index]?.affiliation_ror_id} />
              </div>
              <FormField
                control={form.control}
                name={`co_authors.${index}.orcid`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ORCID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="0000-0000-0000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`co_authors.${index}.contribution_role`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contribution Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || availableRoles[0]}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
