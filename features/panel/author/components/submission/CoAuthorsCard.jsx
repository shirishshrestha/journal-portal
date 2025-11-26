/**
 * CoAuthorsCard - Displays co-authors/contributors for a submission
 * @module features/panel/author/components/submission/CoAuthorsCard
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * @param {Object} props
 * @param {Array} props.authorContributions - Array of author contributions
 */
export default function CoAuthorsCard({ authorContributions }) {
  if (!authorContributions || authorContributions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Co-authors</CardTitle>
        <CardDescription>
          Authors contributing to this manuscript
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {authorContributions.map((author) => (
            <div
              key={author.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {author.profile?.display_name || "Unknown Author"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {author.contrib_role_display} • Order: {author.order}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
