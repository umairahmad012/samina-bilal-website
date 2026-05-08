import Link from "next/link";
import { cn } from "@/lib/cn";

export default function Logo({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const color = variant === "light" ? "text-white" : "text-ink";
  return (
    <Link
      href="/"
      className={cn("inline-flex flex-col leading-none", color, className)}
      aria-label="Samina Bilal — Home"
    >
      <span
        className="text-[1.6rem] md:text-[1.85rem] font-thin tracking-[0.18em] uppercase"
        style={{ fontWeight: 200 }}
      >
        Samina&nbsp;Bilal
      </span>
      <span
        className="text-[0.62rem] md:text-[0.7rem] font-light tracking-[0.42em] uppercase opacity-90 mt-1.5 self-end"
        style={{ fontWeight: 300 }}
      >
        Realtor
      </span>
    </Link>
  );
}
