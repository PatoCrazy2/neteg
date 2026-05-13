import { cn } from "@/lib/utils";

export function Section({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("relative py-24 md:py-32", className)} {...props}>
      {children}
    </section>
  );
}
