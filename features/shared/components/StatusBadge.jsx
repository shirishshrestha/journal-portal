import { Badge } from "@/components/ui/badge";
/**
 * StatusBadge - Reusable badge for displaying status with color config
 * @param {Object} props
 * @param {string} props.status - Status key
 * @param {Object} props.statusConfig - Status config object (maps status to {bg, text, label})
 * @param {string} [props.className] - Additional className for Badge
 */
export default function StatusBadge({ status, statusConfig, className = "" }) {
  const config = statusConfig?.[status] || statusConfig?.DRAFT || {};
  return (
    <Badge
      className={`${config.bg || ""} ${
        config.text || ""
      } border-0 ${className}`}
    >
      {config.label || status}
    </Badge>
  );
}
