import { cn } from "@/lib/utils";

export function Container({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-24", className)} {...props}>
      {children}
    </div>
  );
}
