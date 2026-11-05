type ButtonLinkProps = React.ComponentProps<"a"> & {
  variant?: "primary" | "ghost";
};

const variants = {
  primary:
    "bg-accent text-accent-ink shadow-[0_0_40px_-8px_var(--accent)] hover:shadow-[0_0_60px_-6px_var(--accent)]",
  ghost: "border border-hairline text-text hover:border-text/40 hover:bg-white/5",
};

export function ButtonLink({ variant = "primary", className = "", ...props }: ButtonLinkProps) {
  return (
    <a
      className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-[0.95rem] font-medium transition-[box-shadow,background-color,border-color] duration-300 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
