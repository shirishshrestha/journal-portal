"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { Plus, Edit, Trash2, ChevronRight, Loader2 } from "lucide-react";
import { 
  useGetTaxonomyTree, 
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateResearchType,
  useUpdateResearchType,
  useDeleteResearchType,
  useCreateArea,
  useUpdateArea,
  useDeleteArea,
  useGetJournalStaff
} from "@/features";

export function TaxonomySettings({ journalId }) {
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddResearchTypeOpen, setIsAddResearchTypeOpen] = useState(false);
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isEditResearchTypeOpen, setIsEditResearchTypeOpen] = useState(false);
  const [isEditAreaOpen, setIsEditAreaOpen] = useState(false);
  
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedResearchType, setSelectedResearchType] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  
  const [researchTypesDialogOpen, setResearchTypesDialogOpen] = useState(false);
  const [viewingCategory, setViewingCategory] = useState(null);
  
  const [editingSection, setEditingSection] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingResearchType, setEditingResearchType] = useState(null);
  const [editingArea, setEditingArea] = useState(null);

  // Fetch taxonomy tree from backend
  const { data: sections = [], isPending, error } = useGetTaxonomyTree(journalId);
  
  // Section mutations
  const createSectionMutation = useCreateSection();
  const updateSectionMutation = useUpdateSection();
  const deleteSectionMutation = useDeleteSection();
  
  // Category mutations
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  
  // Research Type mutations
  const createResearchTypeMutation = useCreateResearchType();
  const updateResearchTypeMutation = useUpdateResearchType();
  const deleteResearchTypeMutation = useDeleteResearchType();
  
  // Area mutations
  const createAreaMutation = useCreateArea();
  const updateAreaMutation = useUpdateArea();
  const deleteAreaMutation = useDeleteArea();

  // Sample data structure
  const mockSections = [
    {
      id: "1",
      name: "Computer Science",
      code: "CS",
      description: "Computing and Information Technology",
      categories: [
        {
          id: "1",
          name: "Artificial Intelligence",
          code: "AI",
          description: "AI and Machine Learning",
          research_types: [
            {
              id: "1",
              name: "Original Research",
              code: "ORIGINAL",
              description: "Novel research contributions",
              areas: [
                {
                  id: "1",
                  name: "Machine Learning",
                  code: "ML",
                  keywords: ["neural networks", "deep learning", "supervised learning"],
                },
                {
                  id: "2",
                  name: "Natural Language Processing",
                  code: "NLP",
                  keywords: ["text mining", "language models", "sentiment analysis"],
                },
              ],
            },
            {
              id: "2",
              name: "Review Article",
              code: "REVIEW",
              description: "Comprehensive review of existing research",
              areas: [],
            },
          ],
        },
      ],
    },
  ];

  const handleAddSection = (data) => {
    createSectionMutation.mutate({
      journal: journalId,
      ...data,
    }, {
      onSuccess: () => {
        setIsAddSectionOpen(false);
      },
    });
  };

  const handleAddCategory = (data) => {
    if (!selectedSection) {
      toast.error("No section selected");
      return;
    }
    
    createCategoryMutation.mutate({
      section: selectedSection.id,
      ...data,
    }, {
      onSuccess: () => {
        setIsAddCategoryOpen(false);
        setSelectedSection(null);
      },
    });
  };

  const handleAddResearchType = (data) => {
    if (!selectedCategory) {
      toast.error("No category selected");
      return;
    }
    
    createResearchTypeMutation.mutate({
      category: selectedCategory.id,
      ...data,
    }, {
      onSuccess: () => {
        setIsAddResearchTypeOpen(false);
        setSelectedCategory(null);
      },
    });
  };

  const handleAddArea = (data) => {
    if (!selectedResearchType) {
      toast.error("No research type selected");
      return;
    }
    
    createAreaMutation.mutate({
      research_type: selectedResearchType.id,
      ...data,
    }, {
      onSuccess: () => {
        setIsAddAreaOpen(false);
        setSelectedResearchType(null);
      },
    });
  };

  // Edit handlers
  const handleEditSection = (data) => {
    updateSectionMutation.mutate({
      id: editingSection.id,
      ...data,
    }, {
      onSuccess: () => {
        setIsEditSectionOpen(false);
        setEditingSection(null);
      },
    });
  };

  const handleEditCategory = (data) => {
    updateCategoryMutation.mutate({
      id: editingCategory.id,
      ...data,
    }, {
      onSuccess: () => {
        setIsEditCategoryOpen(false);
        setEditingCategory(null);
      },
    });
  };

  const handleEditResearchType = (data) => {
    updateResearchTypeMutation.mutate({
      id: editingResearchType.id,
      ...data,
    }, {
      onSuccess: () => {
        setIsEditResearchTypeOpen(false);
        setEditingResearchType(null);
      },
    });
  };

  const handleEditArea = (data) => {
    updateAreaMutation.mutate({
      id: editingArea.id,
      ...data,
    }, {
      onSuccess: () => {
        setIsEditAreaOpen(false);
        setEditingArea(null);
      },
    });
  };

  // Delete handlers
  const handleDeleteSection = (section) => {
    if (confirm(`Are you sure you want to delete section "${section.name}"? This will delete all categories, research types, and areas within it.`)) {
      deleteSectionMutation.mutate(section.id);
    }
  };

  const handleDeleteCategory = (category) => {
    if (confirm(`Are you sure you want to delete category "${category.name}"? This will delete all research types and areas within it.`)) {
      deleteCategoryMutation.mutate(category.id);
    }
  };

  const handleDeleteResearchType = (researchType) => {
    if (confirm(`Are you sure you want to delete research type "${researchType.name}"? This will delete all areas within it.`)) {
      deleteResearchTypeMutation.mutate(researchType.id);
    }
  };

  const handleDeleteArea = (area) => {
    if (confirm(`Are you sure you want to delete area "${area.name}"?`)) {
      deleteAreaMutation.mutate(area.id);
    }
  };

  if (isPending) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-destructive">
            <p>Failed to load taxonomy structure</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Taxonomy Structure</CardTitle>
            <CardDescription>
              Define hierarchical classification: Section → Category → Research Type → Area
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddSectionOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-2">
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id} className="border rounded-lg px-4">
                <div className="flex items-center justify-between gap-3">
                  <AccordionTrigger className="hover:no-underline flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{section.code}</Badge>
                      <div className="text-left">
                        <p className="font-medium">{section.name}</p>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <div className="flex gap-2">
                    <div
                      className="p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => {
                        setEditingSection(section);
                        setIsEditSectionOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </div>
                    <div
                      className="p-2 hover:bg-muted rounded cursor-pointer text-destructive"
                      onClick={() => handleDeleteSection(section)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <AccordionContent className="pt-4 pb-2">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Categories</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedSection(section);
                          setIsAddCategoryOpen(true);
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Category
                      </Button>
                    </div>

                    {section.categories && section.categories.length > 0 ? (
                      <div className="space-y-2">
                        {section.categories.map((category) => (
                          <div
                            key={category.id}
                            className="border rounded-lg p-3 ml-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 flex-1">
                                <Badge variant="secondary" className="text-xs">
                                  {category.code}
                                </Badge>
                                <div>
                                  <p className="font-medium text-sm">{category.name}</p>
                                  {category.description && (
                                    <p className="text-xs text-muted-foreground">{category.description}</p>
                                  )}
                                </div>
                                <Badge variant="outline" className="ml-auto">
                                  {category.research_types?.length || 0} types
                                </Badge>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setViewingCategory(category);
                                    setResearchTypesDialogOpen(true);
                                  }}
                                  className="h-7 text-xs"
                                >
                                  View Types
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingCategory(category);
                                    setIsEditCategoryOpen(true);
                                  }}
                                  className="h-7 px-2"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteCategory(category)}
                                  className="h-7 px-2 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground ml-4">
                        No categories defined
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {sections.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No sections defined yet</p>
              <p className="text-sm mt-1">Click "Add Section" to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Section Dialog */}
      <TaxonomyFormDialog
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        title="Add Section"
        onSubmit={handleAddSection}
        fields={["name", "code", "description", "section_editor", "is_active"]}
        journalId={journalId}
        taxonomyType="section"
      />

      {/* Add Category Dialog */}
      <TaxonomyFormDialog
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        title="Add Category"
        onSubmit={handleAddCategory}
        fields={["name", "code", "description", "is_active"]}
        taxonomyType="category"
      />

      {/* Add Research Type Dialog */}
      <TaxonomyFormDialog
        isOpen={isAddResearchTypeOpen}
        onClose={() => setIsAddResearchTypeOpen(false)}
        title="Add Research Type"
        onSubmit={handleAddResearchType}
        fields={["name", "code", "description", "requirements", "is_active"]}
        taxonomyType="researchType"
      />

      {/* Add Area Dialog */}
      <TaxonomyFormDialog
        isOpen={isAddAreaOpen}
        onClose={() => setIsAddAreaOpen(false)}
        title="Add Area"
        onSubmit={handleAddArea}
        fields={["name", "code", "description", "keywords", "is_active"]}
        taxonomyType="area"
      />

      {/* Edit Section Dialog */}
      {editingSection && (
        <TaxonomyFormDialog
          isOpen={isEditSectionOpen}
          onClose={() => {
            setIsEditSectionOpen(false);
            setEditingSection(null);
          }}
          title="Edit Section"
          onSubmit={handleEditSection}
          fields={["name", "code", "description", "section_editor", "is_active"]}
          initialData={editingSection}
          journalId={journalId}
          taxonomyType="section"
        />
      )}

      {/* Edit Category Dialog */}
      {editingCategory && (
        <TaxonomyFormDialog
          isOpen={isEditCategoryOpen}
          onClose={() => {
            setIsEditCategoryOpen(false);
            setEditingCategory(null);
          }}
          title="Edit Category"
          onSubmit={handleEditCategory}
          fields={["name", "code", "description", "is_active"]}
          initialData={editingCategory}
          taxonomyType="category"
        />
      )}

      {/* Edit Research Type Dialog */}
      {editingResearchType && (
        <TaxonomyFormDialog
          isOpen={isEditResearchTypeOpen}
          onClose={() => {
            setIsEditResearchTypeOpen(false);
            setEditingResearchType(null);
          }}
          title="Edit Research Type"
          onSubmit={handleEditResearchType}
          fields={["name", "code", "description", "requirements", "is_active"]}
          initialData={editingResearchType}
          taxonomyType="researchType"
        />
      )}

      {/* Edit Area Dialog */}
      {editingArea && (
        <TaxonomyFormDialog
          isOpen={isEditAreaOpen}
          onClose={() => {
            setIsEditAreaOpen(false);
            setEditingArea(null);
          }}
          title="Edit Area"
          onSubmit={handleEditArea}
          fields={["name", "code", "description", "keywords", "is_active"]}
          initialData={editingArea}
          taxonomyType="area"
        />
      )}

      {/* Research Types Dialog */}
      <Dialog open={researchTypesDialogOpen} onOpenChange={setResearchTypesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Research Types in {viewingCategory?.name}
            </DialogTitle>
            <DialogDescription>
              Manage research types and their areas
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {viewingCategory?.research_types && viewingCategory.research_types.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Research Types</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory(viewingCategory);
                      setIsAddResearchTypeOpen(true);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Research Type
                  </Button>
                </div>
                <Accordion type="multiple" className="space-y-3">
                {viewingCategory.research_types.map((researchType) => (
                  <AccordionItem
                    key={researchType.id}
                    value={researchType.id}
                    className="border rounded-lg px-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <AccordionTrigger className="hover:no-underline flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{researchType.code}</Badge>
                          <div className="text-left">
                            <p className="font-medium">{researchType.name}</p>
                            {researchType.description && (
                              <p className="text-sm text-muted-foreground">{researchType.description}</p>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingResearchType(researchType);
                            setIsEditResearchTypeOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteResearchType(researchType)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <AccordionContent className="pt-4 pb-2">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-muted-foreground">
                            Areas
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedResearchType(researchType);
                              setIsAddAreaOpen(true);
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Area
                          </Button>
                        </div>

                        {researchType.areas && researchType.areas.length > 0 ? (
                          <div className="space-y-2">
                            {researchType.areas.map((area) => (
                              <div
                                key={area.id}
                                className="flex items-start justify-between border rounded p-2 text-sm"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {area.code}
                                    </Badge>
                                    <span className="font-medium">{area.name}</span>
                                  </div>
                                  {area.keywords && area.keywords.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {area.keywords.map((keyword, idx) => (
                                        <span
                                          key={idx}
                                          className="bg-muted px-1.5 py-0.5 rounded text-xs"
                                        >
                                          {keyword}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-1 ml-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setEditingArea(area);
                                      setIsEditAreaOpen(true);
                                    }}
                                    className="h-7 px-2"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteArea(area)}
                                    className="h-7 px-2 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No areas defined
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No research types in this category</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory(viewingCategory);
                    setIsAddResearchTypeOpen(true);
                    setResearchTypesDialogOpen(false);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add First Research Type
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TaxonomyFormDialog({ isOpen, onClose, title, onSubmit, fields, initialData, journalId, taxonomyType }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    keywords: "",
    is_active: true,
    section_editor: "",
    // Requirements as separate fields instead of JSON
    word_count: "",
    required_sections: "",
  });
  
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch staff members for section editor dropdown (only for sections)
  const { data: staffData } = useGetJournalStaff(journalId);
  const staffMembers = staffData || [];
  
  console.log("TaxonomyFormDialog - Current formData:", formData);
  console.log("TaxonomyFormDialog - Staff members:", staffMembers);

  // Fetch data when editing
  useEffect(() => {
    const fetchData = async () => {
      if (initialData?.id && isOpen) {
        setIsLoadingData(true);
        try {
          let response;
          
          // Import the API functions dynamically
          const { 
            getSectionById, 
            getCategoryById, 
            getResearchTypeById, 
            getAreaById 
          } = await import("../../api/journalsApi");
          
          // Fetch based on taxonomy type
          if (taxonomyType === 'section') {
            response = await getSectionById(initialData.id);
          } else if (taxonomyType === 'category') {
            response = await getCategoryById(initialData.id);
          } else if (taxonomyType === 'researchType') {
            response = await getResearchTypeById(initialData.id);
          } else if (taxonomyType === 'area') {
            response = await getAreaById(initialData.id);
          }
          
          console.log("Fetched taxonomy data:", response);
          
          if (response) {
            // Handle section_editor - could be ID string or object with id property
            let sectionEditorValue = "";
            if (response.section_editor) {
              if (typeof response.section_editor === 'string') {
                sectionEditorValue = response.section_editor;
              } else if (response.section_editor.id) {
                sectionEditorValue = response.section_editor.id;
              }
            }
            
            // Extract requirements fields
            const requirements = response.requirements || {};
            
            setFormData({
              name: response.name || "",
              code: response.code || "",
              description: response.description || "",
              keywords: Array.isArray(response.keywords) ? response.keywords.join(", ") : "",
              is_active: response.is_active !== undefined ? response.is_active : true,
              section_editor: sectionEditorValue,
              word_count: requirements.word_count || "",
              required_sections: Array.isArray(requirements.required_sections) 
                ? requirements.required_sections.join(", ") 
                : "",
            });
          }
        } catch (error) {
          console.error("Error fetching taxonomy data:", error);
          toast.error("Failed to load data");
        } finally {
          setIsLoadingData(false);
        }
      } else if (!initialData && isOpen) {
        // Reset form for add mode
        setFormData({
          name: "",
          code: "",
          description: "",
          keywords: "",
          is_active: true,
          section_editor: "",
          word_count: "",
          required_sections: "",
        });
      }
    };
    
    fetchData();
  }, [initialData?.id, isOpen, taxonomyType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData };
    
    // Process keywords
    if (fields.includes("keywords")) {
      data.keywords = formData.keywords.split(",").map((k) => k.trim()).filter(Boolean);
    }
    
    // Process requirements - build JSON from form fields
    if (fields.includes("requirements")) {
      const requirements = {};
      
      if (formData.word_count) {
        requirements.word_count = parseInt(formData.word_count);
      }
      
      if (formData.required_sections && formData.required_sections.trim()) {
        requirements.required_sections = formData.required_sections
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      
      data.requirements = Object.keys(requirements).length > 0 ? requirements : {};
      
      // Remove the individual fields from data
      delete data.word_count;
      delete data.required_sections;
    }
    
    // Ensure is_active is boolean
    if (fields.includes("is_active")) {
      data.is_active = Boolean(formData.is_active);
    }
    
    // Only include section_editor if it has a value
    if (fields.includes("section_editor") && !formData.section_editor) {
      delete data.section_editor;
    }
    
    onSubmit(data);
    if (!initialData) {
      setFormData({ 
        name: "", 
        code: "", 
        description: "", 
        keywords: "",
        is_active: true,
        section_editor: "",
        word_count: "",
        required_sections: "",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the taxonomy entry details" : "Fill in the details below to create a new taxonomy entry"}
          </DialogDescription>
        </DialogHeader>
        {isLoadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          {fields.includes("name") && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}
          {fields.includes("code") && (
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                placeholder="e.g., CS, AI, ML"
                required
              />
            </div>
          )}
          {fields.includes("description") && (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          )}
          {fields.includes("keywords") && (
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
            </div>
          )}
          {fields.includes("requirements") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="word_count">Word Count</Label>
                <Input
                  id="word_count"
                  type="number"
                  value={formData.word_count}
                  onChange={(e) => setFormData({ ...formData, word_count: e.target.value })}
                  placeholder="e.g., 5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="required_sections">Required Sections</Label>
                <Input
                  id="required_sections"
                  type="text"
                  value={formData.required_sections}
                  onChange={(e) => setFormData({ ...formData, required_sections: e.target.value })}
                  placeholder="e.g., abstract, introduction, methodology, conclusion"
                />
                <p className="text-xs text-muted-foreground">
                  Enter section names separated by commas
                </p>
              </div>
            </div>
          )}
          {fields.includes("section_editor") && (
            <div className="space-y-2">
              <Label htmlFor="section_editor">Section Editor (Optional)</Label>
              <Select
                value={formData.section_editor || undefined}
                onValueChange={(value) => setFormData({ ...formData, section_editor: value === "none" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a section editor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {staffMembers.map((staff, index) => (
                    <SelectItem key={`${index}${staff.id}`} value={staff.profile?.id || staff.id}>
                      {staff.profile?.display_name || staff.profile?.user_name || "Unknown User"}
                      {staff.profile?.affiliation_name && ` (${staff.profile.affiliation_name})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Assign a staff member as the section editor
              </p>
            </div>
          )}
          {fields.includes("order") && (
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first. Use 0 for default ordering.
              </p>
            </div>
          )}
          {fields.includes("is_active") && (
            <div className="flex items-center justify-between space-y-2">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Active Status</Label>
                <p className="text-xs text-muted-foreground">
                  Inactive entries are hidden from users
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
