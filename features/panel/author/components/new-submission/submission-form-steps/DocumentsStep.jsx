// DocumentsStep.jsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";

export default function DocumentsStep({
  uploadedFiles,
  handleFileUpload,
  handleRemoveFile,
}) {
  return (
    <div className="space-y-6">
      {["manuscript", "cover_letter", "supplementary"].map((category) => (
        <Card key={category} className="p-4 bg-muted/50 border border-border">
          <h3 className="font-semibold text-foreground mb-4 capitalize">
            {category === "cover_letter" ? "Cover Letter" : category}
            {category === "manuscript" && " (Required)"}
          </h3>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground">
              Drag files here or click to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {category === "manuscript"
                ? "PDF, DOCX (Max 10MB)"
                : "Any file type (Max 25MB)"}
            </p>
            <input
              type="file"
              multiple={category !== "cover_letter"}
              onChange={(e) => handleFileUpload(category, e.target.files)}
              className="hidden"
              id={`upload-${category}`}
            />
          </div>
          {uploadedFiles[category]?.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles[category].map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded bg-muted text-sm"
                >
                  <span>{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(category, i)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
