import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AuthorGuidelinesDialog({ open, onOpenChange, guidelines }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Author Guidelines</DialogTitle>
          <DialogDescription>
            Detailed guidelines for manuscript preparation and submission
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] overflow-auto pr-4">
          <div
            className="prose dark:prose-invert max-w-none text-sm"
            dangerouslySetInnerHTML={{ __html: guidelines }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
