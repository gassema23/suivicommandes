import oscarLogo from "@/assets/oscar-logo.svg";
import oscarTextLogo from "@/assets/oscar-text-logo.svg";

type Size = "xs" | "sm" | "md" | "lg";

const sizeClasses: Record<Size, string> = {
  xs: "h-8",
  sm: "h-12",
  md: "h-16",
  lg: "h-20",
};

export default function QuebecLogo({
  logoSize = "sm",
  textLogoSize = "md",
}: {
  logoSize?: Size;
  textLogoSize?: Size;
} = {}) {
  return (
    <div className="flex items-center gap-2">
      <img src={oscarLogo} className={sizeClasses[logoSize]} />
      <img src={oscarTextLogo} className={sizeClasses[textLogoSize]} />
    </div>
  );
}
