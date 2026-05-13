import { cn } from "@/lib/utils";

export function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border-custom bg-glass px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
