interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "danger";
}

export function Badge({ label, variant = "default" }: BadgeProps) {
  const colors = {
    default: "bg-zinc-800 text-zinc-300",
    success: "bg-emerald-900 text-emerald-300",
    warning: "bg-amber-900 text-amber-300",
    danger: "bg-red-900 text-red-300",
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colors[variant]}`}>
      {label}
    </span>
  );
}
