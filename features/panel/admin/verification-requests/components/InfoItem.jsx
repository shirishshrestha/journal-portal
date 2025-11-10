// InfoItem component for displaying label-value pairs with an icon
export default function InfoItem({
  icon: Icon,
  label,
  value,
  className = "",
  paraClass = "",
}) {
  return (
    <div className={` ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </label>
      </div>
      <p className={`text-sm leading-relaxed capitalize pl-6 ${paraClass}`}>
        {value || (
          <span className="text-muted-foreground italic">-</span>
        )}
      </p>
    </div>
  );
}
