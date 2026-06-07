import { InputHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  icon: LucideIcon;
  label?: string;
};

export function AuthField({
  icon: Icon,
  label,
  className,
  id,
  ...props
}: AuthFieldProps) {
  return (
    <div>
      {label ? (
        <label htmlFor={id} className="mb-2 block text-sm font-extrabold text-foreground">
          {label}
        </label>
      ) : null}
      <div className="group relative transition duration-200 focus-within:scale-[1.01]">
        <Icon
          className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#8a8797] transition group-focus-within:text-primary"
          aria-hidden="true"
        />
        <input
          id={id}
          className={cn(
            "h-12 w-full rounded-2xl border border-transparent bg-muted px-4 pl-12 text-sm font-semibold text-foreground outline-none transition placeholder:text-[#9a98a8] focus:border-primary/50 focus:bg-surface focus:ring-4 focus:ring-primary/15",
            className,
          )}
          {...props}
        />
      </div>
    </div>
  );
}

