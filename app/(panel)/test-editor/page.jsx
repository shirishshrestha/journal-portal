"use client";

import { useState } from "react";
import { RichTextEditor } from "@/features/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RichTextEditorDemo() {
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");

  const handleChange = (html) => {
    setContent(html);
  };

  const handlePreview = () => {
    setPreview(content);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Rich Text Editor Demo</h1>
        <p className="text-muted-foreground">
          A fully-featured rich text editor built with Lexical, compatible with
          dark and light themes.
        </p>
      </div>

      <Card className={"px-4"}>
        <CardHeader>
          <CardTitle>Editor</CardTitle>
          <CardDescription>
            Try out the editor features: formatting, headings, lists, links, and
            more!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 border-border border px-4 ">
          <RichTextEditor
            placeholder="Start typing your content here..."
            onChange={handleChange}
            autoFocus={false}
          />
          <Button onClick={handlePreview}>Show Preview</Button>
        </CardContent>
      </Card>

      {preview && (
        <Card>
          <CardHeader>
            <CardTitle>HTML Preview</CardTitle>
            <CardDescription>Generated HTML output</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">Rendered Output:</h3>
                <div
                  className="p-4 border rounded-lg prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: preview }}
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">HTML Code:</h3>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
                  <code>{preview}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
