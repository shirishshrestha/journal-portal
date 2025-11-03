"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ProfileLinksCard({ links }) {
  const [isOpen, setIsOpen] = useState(false);
  const [googleScholar, setGoogleScholar] = useState(links.googleScholar);
  const [researchGate, setResearchGate] = useState(links.researchGate);

  const handleSave = () => {
    // In production, save to Redux/API
    setIsOpen(false);
  };

  return (
    <Card className="h-full">
      <CardContent className="space-y-4">
        <CardTitle className="text-lg">Profile Links</CardTitle>
        {/* Google Scholar */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Google Scholar</label>
          <div className="flex items-center gap-2">
            <Input
              value={googleScholar}
              readOnly
              className="text-xs"
              placeholder="Not set"
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile Links</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Google Scholar URL
                    </label>
                    <Input
                      value={googleScholar}
                      onChange={(e) => setGoogleScholar(e.target.value)}
                      placeholder="https://scholar.google.com/..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      ResearchGate URL
                    </label>
                    <Input
                      value={researchGate}
                      onChange={(e) => setResearchGate(e.target.value)}
                      placeholder="https://www.researchgate.net/..."
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleSave} className="w-full">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ResearchGate */}
        <div className="space-y-2">
          <label className="text-sm font-medium">ResearchGate</label>
          <div className="flex items-center gap-2">
            <Input
              value={researchGate}
              readOnly
              className="text-xs"
              placeholder="Not set"
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile Links</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Google Scholar URL
                    </label>
                    <Input
                      value={googleScholar}
                      onChange={(e) => setGoogleScholar(e.target.value)}
                      placeholder="https://scholar.google.com/..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      ResearchGate URL
                    </label>
                    <Input
                      value={researchGate}
                      onChange={(e) => setResearchGate(e.target.value)}
                      placeholder="https://www.researchgate.net/..."
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleSave} className="w-full">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
