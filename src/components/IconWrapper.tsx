export function IconWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="size-5 text-base-content/40 transition-colors group-hover:text-base-content/60">
      {children}
    </div>
  );
}
