import { useGetRORInstitution } from "@/features/shared/hooks/useGetRORInstitution";
import { Badge } from "@/components/ui/badge";
import ReactCountryFlag from "react-country-flag";

export default function CoAuthorInstitutionDetails({ rorId }) {
  const { data: rorInstitution, isPending: isRorLoading } =
    useGetRORInstitution(rorId, {
      enabled: Boolean(rorId),
    });
  if (!rorId) return null;
  if (isRorLoading) {
    return (
      <div className="py-2 text-sm text-muted-foreground">
        Loading institution...
      </div>
    );
  }
  if (!rorInstitution) return null;
  return (
    <div className="cursor-pointer py-2">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <ReactCountryFlag
          countryCode={rorInstitution.country_code || ""}
          svg
          style={{ width: "2em", height: "2em", borderRadius: "0.25em" }}
          title={rorInstitution.country}
        />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{rorInstitution.name}</span>
            {rorInstitution.acronyms?.length > 0 && (
              <span className="text-xs text-muted-foreground">
                ({rorInstitution.acronyms.join(", ")})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{rorInstitution.location}</span>
            {rorInstitution.established && (
              <>
                <span>•</span>
                <span>Est. {rorInstitution.established}</span>
              </>
            )}
          </div>
          <div className="flex gap-1 flex-wrap mt-1">
            {rorInstitution.id && (
              <Badge variant="outline" className="text-xs px-2 py-0 font-mono">
                ROR: {rorInstitution.id.replace("https://ror.org/", "")}
              </Badge>
            )}
            {rorInstitution.types?.length > 0 &&
              rorInstitution.types.map((type) => (
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
    </div>
  );
}
